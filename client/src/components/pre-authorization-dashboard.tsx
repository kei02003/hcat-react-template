import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Search, Plus, FileText, Calendar, User, Building, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { FormPrepopulationDemo } from "./form-prepopulation-demo";

interface PreAuthRequest {
  id: string;
  patientId: string;
  patientName: string;
  memberID: string;
  insurerName: string;
  procedureCode: string;
  procedureName: string;
  scheduledDate: string;
  requestDate: string;
  status: "pending" | "approved" | "denied" | "requires_review";
  priority: "standard" | "urgent";
  daysUntilProcedure: number;
  authRequiredBy: string;
  providerId: string;
  providerName: string;
  diagnosis: string;
  clinicalJustification: string;
  priorAuthNumber: string | null;
  estimatedValue: number;
}

interface InsurerCriteria {
  id: string;
  insurerName: string;
  procedureCode: string;
  procedureName: string;
  requiresAuth: boolean;
  medicalNecessityCriteria: string[];
  timeFrameRequired: number;
  authValidityDays: number;
  denialReasons: string[];
}

interface ProcedureAuthRequirement {
  id: string;
  procedureCode: string;
  procedureName: string;
  category: string;
  requiresPreAuth: boolean;
  riskLevel: string;
  averageProcessingDays: number;
  approvalRate: number;
  commonDenialReasons: string[];
}

export function PreAuthorizationDashboard() {
  const [selectedTab, setSelectedTab] = useState("new-request");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");
  
  // Filter states for pre-auth requests
  const [filterProcedure, setFilterProcedure] = useState("");
  const [filterPayer, setFilterPayer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDaysUntil, setFilterDaysUntil] = useState("");
  const [newRequestData, setNewRequestData] = useState({
    patientName: "",
    memberID: "",
    insurerName: "",
    procedureCode: "",
    scheduledDate: "",
    diagnosis: "",
    clinicalJustification: ""
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: preAuthRequests = [], isLoading: loadingRequests } = useQuery<PreAuthRequest[]>({
    queryKey: ["/api/pre-auth-requests"]
  });

  const { data: insurerCriteria = [] } = useQuery<InsurerCriteria[]>({
    queryKey: ["/api/insurer-criteria"]
  });

  const { data: procedureRequirements = [] } = useQuery<ProcedureAuthRequirement[]>({
    queryKey: ["/api/procedure-auth-requirements"]
  });

  // Create new pre-auth request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      return apiRequest("/api/pre-auth-requests", {
        method: "POST",
        body: JSON.stringify(requestData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pre-auth-requests"] });
      setNewRequestData({
        patientName: "",
        memberID: "",
        insurerName: "",
        procedureCode: "",
        scheduledDate: "",
        diagnosis: "",
        clinicalJustification: ""
      });
    }
  });

  const getStatusBadge = (status: string, daysUntil: number) => {
    if (status === "approved") return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    if (status === "denied") return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
    if (daysUntil <= 3) return <Badge className="bg-red-100 text-red-800">Urgent - {daysUntil} days</Badge>;
    if (status === "requires_review") return <Badge className="bg-yellow-100 text-yellow-800">Review Required</Badge>;
    return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
  };

  const getPriorityIcon = (priority: string, daysUntil: number) => {
    if (priority === "urgent" || daysUntil <= 3) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  const getMatchingCriteria = (procedureCode: string, insurerName: string) => {
    return insurerCriteria.find(c => 
      c.procedureCode === procedureCode && c.payerName === insurerName
    );
  };

  const handleProcedureSelection = (procedureCode: string) => {
    setSelectedProcedure(procedureCode);
    setNewRequestData(prev => ({ ...prev, procedureCode }));
  };

  const filteredRequests = preAuthRequests.filter(req => {
    // Search filter
    const matchesSearch = req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.procedureCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.procedureName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Procedure filter
    const matchesProcedure = !filterProcedure || 
      req.procedureCode.includes(filterProcedure) || 
      req.procedureName.toLowerCase().includes(filterProcedure.toLowerCase());
    
    // Payer filter
    const matchesPayer = !filterPayer || req.insurerName === filterPayer;
    
    // Status filter
    const matchesStatus = !filterStatus || req.status === filterStatus;
    
    // Days until procedure filter
    const matchesDaysUntil = !filterDaysUntil || (() => {
      const days = req.daysUntilProcedure;
      switch (filterDaysUntil) {
        case "urgent": return days <= 3;
        case "week": return days >= 4 && days <= 7;
        case "month": return days >= 8 && days <= 30;
        case "future": return days > 30;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesProcedure && matchesPayer && matchesStatus && matchesDaysUntil;
  });

  // Calculate metrics
  const totalRequests = preAuthRequests.length;
  const approvedRequests = preAuthRequests.filter(r => r.status === "approved").length;
  const pendingRequests = preAuthRequests.filter(r => r.status === "pending" || r.status === "requires_review").length;
  const urgentRequests = preAuthRequests.filter(r => r.daysUntilProcedure <= 3).length;
  const completionRate = totalRequests > 0 ? ((approvedRequests / totalRequests) * 100).toFixed(1) : "0";

  if (loadingRequests) {
    return <div className="flex items-center justify-center h-64">Loading pre-authorization data...</div>;
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pre-Authorization Management</h1>
        <div className="text-sm text-gray-600">
          Target: 90% completion 3+ days prior to procedures
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedRequests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent (≤3 days)</p>
                <p className="text-2xl font-bold text-red-600">{urgentRequests}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="new-request" data-testid="tab-new-request">New Request</TabsTrigger>
          <TabsTrigger value="requests" data-testid="tab-requests">Pre-Auth Requests</TabsTrigger>
          <TabsTrigger value="form-demo" data-testid="tab-form-demo" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Form Prepopulation</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          <TabsTrigger value="procedures" data-testid="tab-procedures">Procedure Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pre-Authorization Requests</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by patient, procedure..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                    data-testid="input-search-requests"
                  />
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <Label className="text-sm">Filter by Procedure</Label>
                  <Select value={filterProcedure} onValueChange={setFilterProcedure}>
                    <SelectTrigger data-testid="select-filter-procedure">
                      <SelectValue placeholder="All procedures" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All procedures</SelectItem>
                      {Array.from(new Set(preAuthRequests.map(r => r.procedureCode))).map(code => {
                        const request = preAuthRequests.find(r => r.procedureCode === code);
                        return (
                          <SelectItem key={code} value={code}>
                            {code} - {request?.procedureName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm">Filter by Payer</Label>
                  <Select value={filterPayer} onValueChange={setFilterPayer}>
                    <SelectTrigger data-testid="select-filter-payer">
                      <SelectValue placeholder="All payers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All payers</SelectItem>
                      {Array.from(new Set(preAuthRequests.map(r => r.insurerName))).map(payer => (
                        <SelectItem key={payer} value={payer}>{payer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger data-testid="select-filter-status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                      <SelectItem value="requires_review">Requires Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm">Filter by Days Until Procedure</Label>
                  <Select value={filterDaysUntil} onValueChange={setFilterDaysUntil}>
                    <SelectTrigger data-testid="select-filter-days">
                      <SelectValue placeholder="All timeframes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All timeframes</SelectItem>
                      <SelectItem value="urgent">≤3 days (Urgent)</SelectItem>
                      <SelectItem value="week">4-7 days</SelectItem>
                      <SelectItem value="month">8-30 days</SelectItem>
                      <SelectItem value="future">&gt;30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Filter Summary */}
              {(filterProcedure || filterPayer || filterStatus || filterDaysUntil) && (
                <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
                  <span>Active filters:</span>
                  {filterProcedure && <Badge variant="outline" className="text-xs">Procedure: {filterProcedure}</Badge>}
                  {filterPayer && <Badge variant="outline" className="text-xs">Payer: {filterPayer}</Badge>}
                  {filterStatus && <Badge variant="outline" className="text-xs">Status: {filterStatus}</Badge>}
                  {filterDaysUntil && <Badge variant="outline" className="text-xs">Days: {filterDaysUntil}</Badge>}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setFilterProcedure("");
                      setFilterPayer("");
                      setFilterStatus("");
                      setFilterDaysUntil("");
                    }}
                    className="text-xs"
                    data-testid="button-clear-filters"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getPriorityIcon(request.priority, request.daysUntilProcedure)}
                          <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                          {getStatusBadge(request.status, request.daysUntilProcedure)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Procedure</p>
                            <p className="font-medium">{request.procedureCode}</p>
                            <p className="text-gray-700">{request.procedureName}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Insurer</p>
                            <p className="font-medium">{request.insurerName}</p>
                            <p className="text-gray-700">Member: {request.memberID}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Scheduled</p>
                            <p className="font-medium">
                              {new Date(request.scheduledDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700">{request.daysUntilProcedure} days until</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">Diagnosis</p>
                          <p className="text-sm font-medium">{request.diagnosis}</p>
                        </div>
                      </div>
                      
                      <div className="ml-4 text-right">
                        <p className="text-sm text-gray-600">Estimated Value</p>
                        <p className="font-bold text-lg">${request.estimatedValue.toLocaleString()}</p>
                        {request.priorAuthNumber && (
                          <p className="text-xs text-green-600 mt-1">
                            Auth: {request.priorAuthNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Procedure Authorization Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {procedureRequirements.map((proc) => (
                  <div key={proc.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{proc.procedureCode}</h3>
                        <p className="text-gray-700">{proc.procedureName}</p>
                        <Badge className="mt-1" variant="outline">{proc.category}</Badge>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={
                            proc.riskLevel === "High" ? "bg-red-100 text-red-800" :
                            proc.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }
                        >
                          {proc.riskLevel} Risk
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {proc.approvalRate}% approval rate
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-gray-600">Processing Time</p>
                        <p className="font-medium">{proc.averageProcessingDays} days average</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Authorization Required</p>
                        <p className="font-medium">
                          {proc.requiresPreAuth ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                    
                    {proc.commonDenialReasons.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Common Denial Reasons</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {proc.commonDenialReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pre-Authorization Analytics & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">3+ Days Prior Completion</p>
                        <p className="text-2xl font-bold text-green-800">90.0%</p>
                        <p className="text-xs text-green-600">Target: 90% (Met)</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Average Processing Time</p>
                        <p className="text-2xl font-bold text-blue-800">4.2 days</p>
                        <p className="text-xs text-blue-600">Industry avg: 5.8 days</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Overall Approval Rate</p>
                        <p className="text-2xl font-bold text-purple-800">84.3%</p>
                        <p className="text-xs text-purple-600">+2.1% vs last month</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Authorization Status Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                        <span className="text-green-700">Approved</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '84.3%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-green-700">84.3%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                        <span className="text-yellow-700">Pending</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: '11.2%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-yellow-700">11.2%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                        <span className="text-red-700">Denied</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '4.5%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-red-700">4.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Completion Timing Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                        <span className="text-green-700">≥3 Days Prior</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-green-700">90.0%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                        <span className="text-yellow-700">1-2 Days Prior</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: '7%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-yellow-700">7.0%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                        <span className="text-red-700">Same Day/Late</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '3%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-red-700">3.0%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance by Payer */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Performance by Insurance Provider</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payer</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Requests</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Avg Processing</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">3+ Days Prior</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">Blue Cross Blue Shield</td>
                          <td className="px-4 py-2 text-sm text-gray-600">89</td>
                          <td className="px-4 py-2 text-sm text-green-600">87.6%</td>
                          <td className="px-4 py-2 text-sm text-gray-600">3.8 days</td>
                          <td className="px-4 py-2 text-sm text-green-600">92.1%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">Aetna</td>
                          <td className="px-4 py-2 text-sm text-gray-600">76</td>
                          <td className="px-4 py-2 text-sm text-green-600">89.5%</td>
                          <td className="px-4 py-2 text-sm text-gray-600">4.1 days</td>
                          <td className="px-4 py-2 text-sm text-green-600">90.8%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">UnitedHealthcare</td>
                          <td className="px-4 py-2 text-sm text-gray-600">123</td>
                          <td className="px-4 py-2 text-sm text-green-600">82.1%</td>
                          <td className="px-4 py-2 text-sm text-gray-600">4.7 days</td>
                          <td className="px-4 py-2 text-sm text-green-600">88.6%</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">Cigna</td>
                          <td className="px-4 py-2 text-sm text-gray-600">42</td>
                          <td className="px-4 py-2 text-sm text-green-600">85.7%</td>
                          <td className="px-4 py-2 text-sm text-gray-600">4.3 days</td>
                          <td className="px-4 py-2 text-sm text-green-600">90.5%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Pre-Authorization Request</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Step 1: Select Procedure */}
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold text-gray-900 mb-3">Step 1: Flag Procedure for Authorization</h3>
                  <Label htmlFor="procedure-select">Select Procedure Code</Label>
                  <Select 
                    value={selectedProcedure} 
                    onValueChange={handleProcedureSelection}
                  >
                    <SelectTrigger data-testid="select-procedure">
                      <SelectValue placeholder="Search and select procedure..." />
                    </SelectTrigger>
                    <SelectContent>
                      {procedureRequirements.map((proc) => (
                        <SelectItem key={proc.id} value={proc.procedureCode}>
                          {proc.procedureCode} - {proc.procedureName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedProcedure && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      {(() => {
                        const proc = procedureRequirements.find(p => p.procedureCode === selectedProcedure);
                        return proc ? (
                          <div>
                            <p className="font-medium text-green-700">✓ Procedure flagged for pre-authorization</p>
                            <p className="text-sm text-gray-600">
                              Risk Level: {proc.riskLevel} | Approval Rate: {proc.approvalRate}%
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                {/* Step 2: Patient and Insurance Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient-name">Patient Name</Label>
                    <Input
                      id="patient-name"
                      value={newRequestData.patientName}
                      onChange={(e) => setNewRequestData(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="Last, First M."
                      data-testid="input-patient-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="member-id">Member ID</Label>
                    <Input
                      id="member-id"
                      value={newRequestData.memberID}
                      onChange={(e) => setNewRequestData(prev => ({ ...prev, memberID: e.target.value }))}
                      placeholder="Insurance member ID"
                      data-testid="input-member-id"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="insurer">Insurance Company</Label>
                    <Select
                      value={newRequestData.insurerName}
                      onValueChange={(value) => setNewRequestData(prev => ({ ...prev, insurerName: value }))}
                    >
                      <SelectTrigger data-testid="select-insurer">
                        <SelectValue placeholder="Select insurer..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
                        <SelectItem value="Aetna">Aetna</SelectItem>
                        <SelectItem value="UnitedHealthcare">UnitedHealthcare</SelectItem>
                        <SelectItem value="Cigna">Cigna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="scheduled-date">Scheduled Procedure Date</Label>
                    <Input
                      id="scheduled-date"
                      type="date"
                      value={newRequestData.scheduledDate}
                      onChange={(e) => setNewRequestData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      data-testid="input-scheduled-date"
                    />
                  </div>
                </div>

                {/* Step 3: Compare Against Insurer Criteria */}
                {selectedProcedure && newRequestData.insurerName && (
                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Step 2: Insurer Criteria Comparison</h3>
                    {(() => {
                      const matchingCriteria = getMatchingCriteria(selectedProcedure, newRequestData.insurerName);
                      if (matchingCriteria) {
                        return (
                          <div className="space-y-3">
                            <p className="font-medium text-green-700">
                              ✓ Found {matchingCriteria.insurerName} criteria for {selectedProcedure}
                            </p>
                            <div className="bg-white p-3 rounded border">
                              <p className="font-medium text-gray-700 mb-2">Required Medical Necessity Documentation:</p>
                              <ul className="text-sm space-y-1">
                                {matchingCriteria.medicalNecessityCriteria.map((criterion, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                    {criterion}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm text-orange-600 mt-2">
                                ⚠ Authorization must be submitted {matchingCriteria.timeFrameRequired} hours prior to procedure
                              </p>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="bg-white p-3 rounded border">
                            <p className="text-orange-600">
                              ⚠ No specific criteria found for {newRequestData.insurerName} and {selectedProcedure}
                            </p>
                            <p className="text-sm text-gray-600">
                              Standard documentation requirements will apply. Contact insurer for specific guidelines.
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                {/* Step 4: Clinical Justification */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                    <Input
                      id="diagnosis"
                      value={newRequestData.diagnosis}
                      onChange={(e) => setNewRequestData(prev => ({ ...prev, diagnosis: e.target.value }))}
                      placeholder="ICD-10 code and description"
                      data-testid="input-diagnosis"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="justification">Clinical Justification</Label>
                    <Textarea
                      id="justification"
                      value={newRequestData.clinicalJustification}
                      onChange={(e) => setNewRequestData(prev => ({ ...prev, clinicalJustification: e.target.value }))}
                      placeholder="Provide detailed clinical justification addressing medical necessity criteria..."
                      className="min-h-32"
                      data-testid="textarea-justification"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => createRequestMutation.mutate(newRequestData)}
                  disabled={createRequestMutation.isPending || !selectedProcedure || !newRequestData.patientName}
                  className="w-full"
                  data-testid="button-submit-request"
                >
                  {createRequestMutation.isPending ? "Submitting..." : "Submit Pre-Authorization Request"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form-demo">
          <FormPrepopulationDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}