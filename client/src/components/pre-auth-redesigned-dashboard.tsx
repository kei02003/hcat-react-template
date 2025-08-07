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
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  Building, 
  Sparkles,
  Flag,
  Activity,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Send,
  Filter,
  Download
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Types for the redesigned pre-auth system
interface PreAuthTimeline {
  id: string;
  patientId: string;
  patientName: string;
  procedureCode: string;
  procedureName: string;
  scheduledDate: string;
  daysUntilProcedure: number;
  urgencyLevel: "green" | "yellow" | "red";
  authRequiredBy: string;
  currentStatus: "flagged" | "submitted" | "approved" | "denied" | "expired";
  payerId: string;
  payerName: string;
  estimatedProcessingDays: number;
}

interface ComplianceMetrics {
  id: string;
  period: string;
  periodDate: string;
  totalRequests: number;
  submittedOnTime: number;
  submittedLate: number;
  compliancePercentage: number;
  avgDaysToSubmission: number;
  department?: string;
}

interface PayerResponseAnalytics {
  id: string;
  payerId: string;
  payerName: string;
  avgResponseDays: number;
  approvalRate: number;
  denialRate: number;
  totalRequests: number;
  monthYear: string;
  trendDirection: "improving" | "declining" | "stable";
}

interface DocumentationAlert {
  id: string;
  preAuthRequestId: string;
  patientName: string;
  procedureName: string;
  missingDocuments: string[];
  alertPriority: "low" | "medium" | "high" | "critical";
  daysOverdue: number;
  payerName: string;
  directLink?: string;
  isResolved: boolean;
  assignedTo?: string;
}

interface StatusGridData {
  status: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  color: string;
}

export function PreAuthRedesignedDashboard() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayer, setSelectedPayer] = useState("");
  const [showBulkSubmission, setShowBulkSubmission] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Data queries for the redesigned system
  const { data: timelineData, isLoading: timelineLoading } = useQuery({
    queryKey: ["/api/pre-auth/timeline", selectedTimeframe],
  });

  const { data: complianceData, isLoading: complianceLoading } = useQuery({
    queryKey: ["/api/pre-auth/compliance-metrics", selectedTimeframe],
  });

  const { data: payerAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/pre-auth/payer-analytics", selectedTimeframe],
  });

  const { data: documentationAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/pre-auth/missing-docs"],
  });

  const { data: statusGridData, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/pre-auth/status-grid"],
  });

  // Mutations
  const bulkSubmitMutation = useMutation({
    mutationFn: async (requestIds: string[]) => {
      return apiRequest("/api/pre-auth/bulk-submit", {
        method: "POST",
        body: JSON.stringify({ requestIds }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pre-auth"] });
      setSelectedItems([]);
      setShowBulkSubmission(false);
    },
  });

  const flagProcedureMutation = useMutation({
    mutationFn: async (procedureData: any) => {
      return apiRequest("/api/pre-auth/flag-procedure", {
        method: "POST",
        body: JSON.stringify(procedureData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pre-auth"] });
    },
  });

  // Helper functions
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "green": return "bg-green-100 text-green-800 border-green-200";
      case "yellow": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "red": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6" data-testid="pre-auth-redesigned-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pre-Authorization Management</h2>
          <p className="text-gray-600">Comprehensive tracking and workflow management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40" data-testid="select-timeframe">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setShowBulkSubmission(true)}
            disabled={selectedItems.length === 0}
            data-testid="button-bulk-submit"
          >
            <Send className="h-4 w-4 mr-2" />
            Bulk Submit ({selectedItems.length})
          </Button>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tracking" data-testid="tab-tracking">Tracking</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts" data-testid="tab-alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab - Status Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Status Tracker Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusGridData?.map((status: StatusGridData) => (
              <Card key={status.status} className="cursor-pointer hover:shadow-md transition-shadow" data-testid={`status-card-${status.status}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 capitalize">{status.status}</p>
                      <p className="text-2xl font-bold" style={{color: status.color}}>{status.count}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(status.trend)}
                      <span className="text-sm text-gray-500">{status.percentage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || Array.from({ length: 4 }, (_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 3-Day Compliance Meter */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>3-Day Compliance Tracking</span>
                </CardTitle>
                <Badge variant="outline" data-testid="compliance-percentage">
                  {complianceData?.compliancePercentage ?? 0}% Target: 90%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Submitted on time</span>
                  <span className="font-medium">{complianceData?.submittedOnTime ?? 0} / {complianceData?.totalRequests ?? 0}</span>
                </div>
                <Progress 
                  value={complianceData?.compliancePercentage ?? 0} 
                  className="h-3"
                  data-testid="compliance-progress"
                />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-green-600">{complianceData?.submittedOnTime ?? 0}</p>
                    <p className="text-gray-500">On Time</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-red-600">{complianceData?.submittedLate ?? 0}</p>
                    <p className="text-gray-500">Late</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-600">{complianceData?.avgDaysToSubmission ?? 0}</p>
                    <p className="text-gray-500">Avg Days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payer Response Time Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Payer Response Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payerAnalytics?.map((payer: PayerResponseAnalytics) => (
                  <div key={payer.id} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`payer-analytics-${payer.payerId}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">{payer.payerName}</p>
                        <p className="text-sm text-gray-500">{payer.totalRequests} requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{payer.avgResponseDays} days</p>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(payer.trendDirection)}
                        <span className="text-sm text-gray-500">{payer.approvalRate}% approval</span>
                      </div>
                    </div>
                  </div>
                )) || Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                    <div className="h-12 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracking Tab - Interactive Timeline */}
        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Interactive Procedure Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search patients, procedures..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                      data-testid="input-timeline-search"
                    />
                  </div>
                  <Select value={selectedPayer} onValueChange={setSelectedPayer}>
                    <SelectTrigger className="w-48" data-testid="select-payer-filter">
                      <SelectValue placeholder="Filter by payer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Payers</SelectItem>
                      <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                      <SelectItem value="uhc">United Healthcare</SelectItem>
                      <SelectItem value="medicare">Medicare</SelectItem>
                      <SelectItem value="medicaid">Medicaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline View */}
                <div className="space-y-3">
                  {timelineData?.map((item: PreAuthTimeline) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50" data-testid={`timeline-item-${item.id}`}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="w-4 h-4"
                        data-testid={`checkbox-${item.id}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.patientName}</p>
                            <p className="text-sm text-gray-600">{item.procedureName} - {item.payerName}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getUrgencyColor(item.urgencyLevel)} data-testid={`urgency-${item.id}`}>
                              {item.daysUntilProcedure} days
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">{item.currentStatus}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                      <div className="h-16 bg-gray-200 rounded flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab - Detailed Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-gray-500">Approval rate visualization chart</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-gray-500">Processing time trends chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab - Missing Documentation */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Missing Documentation Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentationAlerts?.map((alert: DocumentationAlert) => (
                  <div key={alert.id} className="border rounded-lg p-4" data-testid={`alert-${alert.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(alert.alertPriority)}>
                            {alert.alertPriority}
                          </Badge>
                          <span className="font-medium">{alert.patientName}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.procedureName} - {alert.payerName}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Missing Documents:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {alert.missingDocuments.map((doc, idx) => (
                              <li key={idx}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600 font-medium">{alert.daysOverdue} days overdue</p>
                        {alert.directLink && (
                          <Button size="sm" variant="outline" className="mt-2" data-testid={`link-${alert.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )) || Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="border rounded-lg p-4 animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bulk Submission Dialog */}
      <Dialog open={showBulkSubmission} onOpenChange={setShowBulkSubmission}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Pre-Authorization Submission</DialogTitle>
            <DialogDescription>
              Submit {selectedItems.length} selected pre-authorization requests simultaneously.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This will submit all selected requests to their respective payers. 
              Make sure all required documentation is attached.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkSubmission(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => bulkSubmitMutation.mutate(selectedItems)}
              disabled={bulkSubmitMutation.isPending}
              data-testid="button-confirm-bulk-submit"
            >
              {bulkSubmitMutation.isPending ? "Submitting..." : "Submit All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}