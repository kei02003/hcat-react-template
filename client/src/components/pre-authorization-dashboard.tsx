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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, CheckCircle, Clock, Search, Plus, FileText, Calendar, User, Building, Sparkles, Flag, FormInput } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { FormPrepopulationDemo } from "./form-prepopulation-demo";

interface PreAuthRequest {
  id: string;
  patientId: string;
  patientName: string;
  memberID: string;
  payer: string;
  procedureCode: string;
  procedureName: string;
  scheduledDate: string;
  requestDate: string;
  status: "pending" | "approved" | "denied" | "requires_review";
  priority: "standard" | "urgent";
  authRequiredBy: string;
  providerId: string;
  providerName: string;
  diagnosis: string;
  clinicalJustification: string;
  priorAuthNumber: string | null;
  estimatedCost: string;
}

interface InsurerCriteria {
  id: string;
  payer: string;
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
  const [selectedTab, setSelectedTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");

  // Helper function to calculate days until procedure
  const calculateDaysUntilProcedure = (scheduledDate: string): number => {
    const today = new Date();
    const scheduled = new Date(scheduledDate);
    return Math.ceil((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  // Filter states for pre-auth requests
  const [filterProcedure, setFilterProcedure] = useState("");
  const [filterPayer, setFilterPayer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDaysUntil, setFilterDaysUntil] = useState("");
  
  // Search state for procedure requirements
  const [procedureSearchTerm, setProcedureSearchTerm] = useState("");
  const [selectedPayerFilter, setSelectedPayerFilter] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

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

  const getMatchingCriteria = (procedureCode: string, payerName: string) => {
    const criteria = insurerCriteria.find(c => 
      c.procedureCode === procedureCode && c.payerName === payerName
    );
    
    // Flatten the criteria structure for the frontend to use
    if (criteria && criteria.criteria) {
      return {
        ...criteria.criteria,
        payerName: criteria.payerName,
        procedureCode: criteria.procedureCode,
        procedureName: criteria.procedureName
      };
    }
    return null;
  };


  const filteredRequests = preAuthRequests.filter(req => {
    // Search filter
    const matchesSearch = req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.procedureCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.procedureName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Procedure filter
    const matchesProcedure = !filterProcedure || filterProcedure === "all" || 
      req.procedureCode.includes(filterProcedure) || 
      req.procedureName.toLowerCase().includes(filterProcedure.toLowerCase());
    
    // Payer filter
    const matchesPayer = !filterPayer || filterPayer === "all" || req.payer === filterPayer;
    
    // Status filter
    const matchesStatus = !filterStatus || filterStatus === "all" || req.status === filterStatus;
    
    // Days until procedure filter
    const matchesDaysUntil = !filterDaysUntil || filterDaysUntil === "all" || (() => {
      const today = new Date();
      const scheduledDate = new Date(req.scheduledDate);
      const days = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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
  const urgentRequests = preAuthRequests.filter(r => {
    const today = new Date();
    const scheduledDate = new Date(r.scheduledDate);
    const days = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 3;
  }).length;
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests" data-testid="tab-requests">Pre-Auth Requests</TabsTrigger>
          <TabsTrigger value="form-demo" data-testid="tab-form-demo" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Form Prepopulation</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          <TabsTrigger value="procedures" data-testid="tab-procedures">Reference Guide</TabsTrigger>
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
                      <SelectItem value="all">All procedures</SelectItem>
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
                      <SelectItem value="all">All payers</SelectItem>
                      {Array.from(new Set(preAuthRequests.map(r => r.payer))).map(payer => (
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
                      <SelectItem value="all">All statuses</SelectItem>
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
                      <SelectItem value="all">All timeframes</SelectItem>
                      <SelectItem value="urgent">≤3 days (Urgent)</SelectItem>
                      <SelectItem value="week">4-7 days</SelectItem>
                      <SelectItem value="month">8-30 days</SelectItem>
                      <SelectItem value="future">&gt;30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Filter Summary */}
              {(filterProcedure && filterProcedure !== "all" || filterPayer && filterPayer !== "all" || filterStatus && filterStatus !== "all" || filterDaysUntil && filterDaysUntil !== "all") && (
                <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
                  <span>Active filters:</span>
                  {filterProcedure && filterProcedure !== "all" && <Badge variant="outline" className="text-xs">Procedure: {filterProcedure}</Badge>}
                  {filterPayer && filterPayer !== "all" && <Badge variant="outline" className="text-xs">Payer: {filterPayer}</Badge>}
                  {filterStatus && filterStatus !== "all" && <Badge variant="outline" className="text-xs">Status: {filterStatus}</Badge>}
                  {filterDaysUntil && filterDaysUntil !== "all" && <Badge variant="outline" className="text-xs">Days: {filterDaysUntil}</Badge>}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setFilterProcedure("all");
                      setFilterPayer("all");
                      setFilterStatus("all");
                      setFilterDaysUntil("all");
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
                {filteredRequests.map((request) => {
                  const matchingCriteria = getMatchingCriteria(request.procedureCode, request.payer);
                  return (
                    <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getPriorityIcon(request.priority, calculateDaysUntilProcedure(request.scheduledDate))}
                            <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                            {getStatusBadge(request.status, calculateDaysUntilProcedure(request.scheduledDate))}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Procedure</p>
                              <p className="font-medium">{request.procedureCode || "N/A"}</p>
                              <p className="text-gray-700">{request.procedureName || "Procedure name not available"}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Insurer</p>
                              <p className="font-medium">{request.payer}</p>
                              <p className="text-gray-700">Member: {request.memberID || "N/A"}</p>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">Scheduled</p>
                              <p className="font-medium">
                                {request.scheduledDate ? new Date(request.scheduledDate).toLocaleDateString() : "Not scheduled"}
                              </p>
                              <p className="text-gray-700">
                                {`${calculateDaysUntilProcedure(request.scheduledDate)} days until`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">Diagnosis</p>
                            <p className="text-sm font-medium">{request.diagnosis || "Not specified"}</p>
                          </div>
                          
                          {/* Payer Criteria Information - Accordion */}
                          {matchingCriteria && (
                            <div className="mt-4">
                              <Accordion type="single" collapsible className="border border-blue-200 rounded-lg">
                                <AccordionItem value="criteria" className="border-0">
                                  <AccordionTrigger className="px-3 py-2 hover:no-underline bg-blue-50 rounded-t-lg data-[state=open]:rounded-b-none">
                                    <div className="flex items-center justify-between w-full mr-3">
                                      <h4 className="text-sm font-semibold text-blue-900 flex items-center">
                                        <Building className="h-4 w-4 mr-2" />
                                        Payer Authorization Criteria
                                      </h4>
                                      <div className="flex items-center space-x-2 text-xs">
                                        {matchingCriteria.requiresAuth ? (
                                          <Badge className="bg-orange-100 text-orange-800">Auth Required</Badge>
                                        ) : (
                                          <Badge className="bg-green-100 text-green-800">No Auth Needed</Badge>
                                        )}
                                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                                          {matchingCriteria.timeFrameRequired} days processing
                                        </Badge>
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="px-3 pb-3 bg-blue-50 border-t border-blue-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2">
                                      {matchingCriteria.medicalNecessityCriteria && matchingCriteria.medicalNecessityCriteria.length > 0 && (
                                        <div>
                                          <p className="font-medium text-blue-800 mb-1">Medical Necessity Requirements:</p>
                                          <ul className="text-blue-700 space-y-1">
                                            {matchingCriteria.medicalNecessityCriteria.slice(0, 3).map((criteria, idx) => (
                                              <li key={idx} className="flex items-start">
                                                <span className="text-blue-500 mr-1">•</span>
                                                <span className="line-clamp-1">{criteria}</span>
                                              </li>
                                            ))}
                                            {matchingCriteria.medicalNecessityCriteria.length > 3 && (
                                              <li className="text-blue-600 italic">+{matchingCriteria.medicalNecessityCriteria.length - 3} more criteria</li>
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {matchingCriteria.denialReasons && matchingCriteria.denialReasons.length > 0 && (
                                        <div>
                                          <p className="font-medium text-red-800 mb-1">Common Denial Reasons:</p>
                                          <ul className="text-red-700 space-y-1">
                                            {matchingCriteria.denialReasons.slice(0, 2).map((reason, idx) => (
                                              <li key={idx} className="flex items-start">
                                                <span className="text-red-500 mr-1">•</span>
                                                <span className="line-clamp-1">{reason}</span>
                                              </li>
                                            ))}
                                            {matchingCriteria.denialReasons.length > 2 && (
                                              <li className="text-red-600 italic">+{matchingCriteria.denialReasons.length - 2} more reasons</li>
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="mt-3 pt-2 border-t border-blue-300 flex items-center justify-between text-xs text-blue-700">
                                      <span>Authorization valid for {matchingCriteria.authValidityDays} days</span>
                                      <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Submit {matchingCriteria.timeFrameRequired} days before procedure
                                      </span>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          )}
                          
                          {/* Warning if no criteria found */}
                          {!matchingCriteria && (
                            <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                              <div className="flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                No specific payer criteria found for this procedure combination. Manual review may be required.
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 text-right">
                          <p className="text-sm text-gray-600">Estimated Cost</p>
                          <p className="font-bold text-lg">
                            ${request.estimatedCost ? parseFloat(request.estimatedCost).toLocaleString() : "0"}
                          </p>
                          {request.priorAuthNumber && (
                            <p className="text-xs text-green-600 mt-1">
                              Auth: {request.priorAuthNumber}
                            </p>
                          )}
                          
                          {/* Timeline indicator based on criteria */}
                          {matchingCriteria && (
                            <div className="mt-2 text-xs">
                              {calculateDaysUntilProcedure(request.scheduledDate) <= matchingCriteria.timeFrameRequired ? (
                                <div className="flex items-center text-red-600">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  <span>Time Critical</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  <span>On Schedule</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-end space-x-2">
                        {/* Flag for Review button - show if requires review and not already flagged */}
                        {((matchingCriteria && matchingCriteria.requiresAuth) || request.status === "pending") && !request.requiresReview && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Handle flag for review
                              console.log('Flagging request for review:', request.id);
                            }}
                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            data-testid={`button-flag-review-${request.id}`}
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            Flag for Review
                          </Button>
                        )}
                        
                        {/* Auto-Populate Form button */}
                        <Button
                          size="sm"
                          onClick={() => {
                            // Handle auto-populate form
                            console.log('Auto-populating form for request:', request.id);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          data-testid={`button-auto-populate-${request.id}`}
                        >
                          <FormInput className="h-3 w-3 mr-1" />
                          Auto-Populate Form
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Procedure Requirements & Payer Criteria Reference Guide</CardTitle>
                  <p className="text-gray-600 mt-1">Comprehensive reference for authorization requirements, payer policies, and approval criteria</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search procedures, codes, or criteria..."
                    value={procedureSearchTerm}
                    onChange={(e) => setProcedureSearchTerm(e.target.value)}
                    className="w-64"
                    data-testid="input-search-procedures"
                  />
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-sm">Filter by Category</Label>
                  <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                    <SelectTrigger data-testid="select-category-filter">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {Array.from(new Set(procedureRequirements.map(p => p.category))).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm">Filter by Authorization Required</Label>
                  <Select value={selectedPayerFilter} onValueChange={setSelectedPayerFilter}>
                    <SelectTrigger data-testid="select-auth-filter">
                      <SelectValue placeholder="All procedures" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All procedures</SelectItem>
                      <SelectItem value="required">Authorization required</SelectItem>
                      <SelectItem value="not-required">No authorization needed</SelectItem>
                      <SelectItem value="high-risk">High risk procedures</SelectItem>
                      <SelectItem value="medium-risk">Medium risk procedures</SelectItem>
                      <SelectItem value="low-risk">Low risk procedures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Total Procedures</p>
                        <p className="text-2xl font-bold text-blue-800">{procedureRequirements.length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-700">Require Pre-Auth</p>
                        <p className="text-2xl font-bold text-orange-800">
                          {procedureRequirements.filter(p => p.requiresPreAuth).length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-700">High Risk</p>
                        <p className="text-2xl font-bold text-red-800">
                          {procedureRequirements.filter(p => p.riskLevel === "High").length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Avg Approval Rate</p>
                        <p className="text-2xl font-bold text-green-800">
                          {Math.round(procedureRequirements.reduce((sum, p) => sum + p.approvalRate, 0) / procedureRequirements.length)}%
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Procedure Requirements List */}
                <div className="space-y-4">
                  {(() => {
                    // Filter logic
                    const filtered = procedureRequirements.filter(proc => {
                      const matchesSearch = procedureSearchTerm === "" || 
                        proc.procedureCode.toLowerCase().includes(procedureSearchTerm.toLowerCase()) ||
                        proc.procedureName.toLowerCase().includes(procedureSearchTerm.toLowerCase()) ||
                        proc.category.toLowerCase().includes(procedureSearchTerm.toLowerCase()) ||
                        proc.commonDenialReasons.some(reason => reason.toLowerCase().includes(procedureSearchTerm.toLowerCase()));
                      
                      const matchesCategory = selectedCategoryFilter === "" || selectedCategoryFilter === "all" || 
                        proc.category === selectedCategoryFilter;
                      
                      const matchesAuthFilter = selectedPayerFilter === "" || selectedPayerFilter === "all" || 
                        (selectedPayerFilter === "required" && proc.requiresPreAuth) ||
                        (selectedPayerFilter === "not-required" && !proc.requiresPreAuth) ||
                        (selectedPayerFilter === "high-risk" && proc.riskLevel === "High") ||
                        (selectedPayerFilter === "medium-risk" && proc.riskLevel === "Medium") ||
                        (selectedPayerFilter === "low-risk" && proc.riskLevel === "Low");
                      
                      return matchesSearch && matchesCategory && matchesAuthFilter;
                    });
                    
                    return filtered.map((proc) => {
                      // Find matching insurer criteria for this procedure
                      const relatedCriteria = insurerCriteria.filter(c => c.procedureCode === proc.procedureCode);
                      
                      return (
                        <div key={proc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">{proc.procedureCode}</h3>
                                <Badge className="mt-1" variant="outline">{proc.category}</Badge>
                                <Badge 
                                  className={
                                    proc.riskLevel === "High" ? "bg-red-100 text-red-800" :
                                    proc.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-green-100 text-green-800"
                                  }
                                >
                                  {proc.riskLevel} Risk
                                </Badge>
                                {proc.requiresPreAuth && (
                                  <Badge className="bg-orange-100 text-orange-800">
                                    Pre-Auth Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-700 font-medium">{proc.procedureName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Approval Rate</p>
                              <p className="text-2xl font-bold text-green-600">{proc.approvalRate}%</p>
                              <p className="text-xs text-gray-500">{proc.averageProcessingDays} days avg</p>
                            </div>
                          </div>
                          
                          {/* Key Requirements Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="font-medium text-blue-700 mb-1">Authorization Status</p>
                              <p className="text-blue-800">
                                {proc.requiresPreAuth ? "Required" : "Not Required"}
                              </p>
                              {proc.requiresPreAuth && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Submit {proc.averageProcessingDays} days before procedure
                                </p>
                              )}
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="font-medium text-gray-700 mb-1">Processing Time</p>
                              <p className="text-gray-800">{proc.averageProcessingDays} days average</p>
                              <p className="text-xs text-gray-600 mt-1">Based on historical data</p>
                            </div>
                            
                            <div className="bg-green-50 p-3 rounded">
                              <p className="font-medium text-green-700 mb-1">Success Rate</p>
                              <p className="text-green-800">{proc.approvalRate}% approved</p>
                              <p className="text-xs text-green-600 mt-1">Historical approval rate</p>
                            </div>
                          </div>
                          
                          {/* Payer-Specific Criteria */}
                          {relatedCriteria.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                <Building className="h-4 w-4 mr-2" />
                                Payer-Specific Criteria
                              </h4>
                              <div className="space-y-2">
                                {relatedCriteria.map((criteria, idx) => (
                                  <div key={idx} className="border border-blue-200 rounded p-3 bg-blue-50">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-blue-800">{criteria.payerName}</span>
                                      <div className="flex space-x-2">
                                        {criteria.criteriaType && (
                                          <Badge variant="outline" className="text-xs text-blue-700 border-blue-300">
                                            {criteria.criteriaType.replace('_', ' ')}
                                          </Badge>
                                        )}
                                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                                          {criteria.timeFrameRequired || 3} days required
                                        </Badge>
                                      </div>
                                    </div>
                                    {criteria.medicalNecessityCriteria && criteria.medicalNecessityCriteria.length > 0 && (
                                      <div>
                                        <p className="text-xs font-medium text-blue-700 mb-1">Key Requirements:</p>
                                        <ul className="text-xs text-blue-700 space-y-1">
                                          {criteria.medicalNecessityCriteria.slice(0, 2).map((req, reqIdx) => (
                                            <li key={reqIdx} className="flex items-start">
                                              <span className="text-blue-500 mr-1">•</span>
                                              <span>{req}</span>
                                            </li>
                                          ))}
                                          {criteria.medicalNecessityCriteria.length > 2 && (
                                            <li className="text-blue-600 italic text-xs">
                                              +{criteria.medicalNecessityCriteria.length - 2} more requirements
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Common Denial Reasons */}
                          {proc.commonDenialReasons.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <p className="text-sm font-medium text-red-800 mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Common Denial Reasons
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {proc.commonDenialReasons.map((reason, idx) => (
                                  <div key={idx} className="flex items-start text-xs text-red-700">
                                    <span className="text-red-500 mr-2 font-bold">•</span>
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()
                  }
                </div>
                
                {/* No results message */}
                {(() => {
                  const filteredCount = procedureRequirements.filter(proc => {
                    const matchesSearch = procedureSearchTerm === "" || 
                      proc.procedureCode.toLowerCase().includes(procedureSearchTerm.toLowerCase()) ||
                      proc.procedureName.toLowerCase().includes(procedureSearchTerm.toLowerCase()) ||
                      proc.category.toLowerCase().includes(procedureSearchTerm.toLowerCase());
                    
                    const matchesCategory = selectedCategoryFilter === "" || selectedCategoryFilter === "all" || 
                      proc.category === selectedCategoryFilter;
                    
                    const matchesAuthFilter = selectedPayerFilter === "" || selectedPayerFilter === "all" || 
                      (selectedPayerFilter === "required" && proc.requiresPreAuth) ||
                      (selectedPayerFilter === "not-required" && !proc.requiresPreAuth) ||
                      (selectedPayerFilter === "high-risk" && proc.riskLevel === "High") ||
                      (selectedPayerFilter === "medium-risk" && proc.riskLevel === "Medium") ||
                      (selectedPayerFilter === "low-risk" && proc.riskLevel === "Low");
                    
                    return matchesSearch && matchesCategory && matchesAuthFilter;
                  }).length;
                  
                  return filteredCount === 0 && procedureRequirements.length > 0 ? (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No procedures match your search criteria</p>
                      <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                    </div>
                  ) : null;
                })()
                }
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


        <TabsContent value="form-demo">
          <FormPrepopulationDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}