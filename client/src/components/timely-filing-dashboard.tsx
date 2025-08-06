import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Timer
} from "lucide-react";
import { FilingTrendChart, FilingVolumeChart } from "./charts/filing-trend-chart";
import { DepartmentPerformanceChart, RiskLevelDistribution } from "./charts/department-performance-chart";

const filingMetrics = [
  {
    name: "Claims Due Today",
    value: "23",
    previousValue: "18",
    changePercentage: "+27.8",
    status: "negative" as const,
    target: "0"
  },
  {
    name: "Critical (0-3 days)",
    value: "89",
    previousValue: "67",
    changePercentage: "+32.8",
    status: "negative" as const,
    target: "<50"
  },
  {
    name: "Filing Success Rate",
    value: "92.8%",
    previousValue: "94.1%",
    changePercentage: "-1.3",
    status: "negative" as const,
    target: "95.0%"
  },
  {
    name: "Value at Risk",
    value: "$5.7M",
    previousValue: "$4.2M",
    changePercentage: "+35.7",
    status: "negative" as const,
    target: "<$3M"
  },
  {
    name: "Avg Days to File",
    value: "11.4",
    previousValue: "10.8",
    changePercentage: "+5.6",
    status: "negative" as const,
    target: "<10"
  },
  {
    name: "Expired Claims",
    value: "31",
    previousValue: "24",
    changePercentage: "+29.2",
    status: "negative" as const,
    target: "0"
  }
];

const criticalClaims = [
  {
    claimId: "CLM-24-089456",
    patientName: "Johnson, Michael R.",
    serviceDate: "2024-10-15",
    payerName: "Aetna Commercial",
    claimAmount: 45600,
    daysRemaining: 1,
    riskLevel: "Critical" as const,
    department: "Emergency Department",
    assignedTo: "Sarah Wilson",
    status: "Pending" as const,
    lastAction: "2024-12-01"
  },
  {
    claimId: "CLM-24-078234",
    patientName: "Williams, Jennifer L.",
    serviceDate: "2024-10-12",
    payerName: "Medicare",
    claimAmount: 38900,
    daysRemaining: 2,
    riskLevel: "Critical" as const,
    department: "Cardiology",
    assignedTo: "Mark Thompson",
    status: "In Progress" as const,
    lastAction: "2024-12-01"
  },
  {
    claimId: "CLM-24-067123",
    patientName: "Brown, David A.",
    serviceDate: "2024-10-18",
    payerName: "Blue Cross Blue Shield",
    claimAmount: 29300,
    daysRemaining: 0,
    riskLevel: "Critical" as const,
    department: "General Surgery",
    assignedTo: "Lisa Rodriguez",
    status: "Pending" as const,
    lastAction: "2024-11-30"
  },
  {
    claimId: "CLM-24-056789",
    patientName: "Davis, Mary K.",
    serviceDate: "2024-10-20",
    payerName: "Humana",
    claimAmount: 52100,
    daysRemaining: 3,
    riskLevel: "Critical" as const,
    department: "Oncology",
    assignedTo: "Robert Chen",
    status: "On Hold" as const,
    lastAction: "2024-11-28"
  },
  {
    claimId: "CLM-24-045678",
    patientName: "Miller, Christopher J.",
    serviceDate: "2024-10-22",
    payerName: "United Healthcare",
    claimAmount: 18700,
    daysRemaining: 2,
    riskLevel: "High" as const,
    department: "Orthopedics",
    assignedTo: "Amanda Wilson",
    status: "In Progress" as const,
    lastAction: "2024-12-01"
  },
  {
    claimId: "CLM-24-034567",
    patientName: "Garcia, Patricia M.",
    serviceDate: "2024-10-19",
    payerName: "Medicaid",
    claimAmount: 24800,
    daysRemaining: 1,
    riskLevel: "Critical" as const,
    department: "Laboratory",
    assignedTo: "James Anderson",
    status: "Pending" as const,
    lastAction: "2024-11-29"
  }
];

const recentAlerts = [
  {
    id: "ALERT-001",
    type: "Critical Deadline",
    message: "23 claims due for filing today across multiple departments",
    priority: "Critical" as const,
    timestamp: "2024-12-02 08:30:00",
    isResolved: false
  },
  {
    id: "ALERT-002",
    type: "Deadline Warning",
    message: "Emergency Department has 12 claims due within 48 hours",
    priority: "High" as const,
    timestamp: "2024-12-02 07:45:00",
    isResolved: false
  },
  {
    id: "ALERT-003",
    type: "Expired",
    message: "3 high-value claims expired overnight - total value $156K",
    priority: "Critical" as const,
    timestamp: "2024-12-02 06:00:00",
    isResolved: false
  },
  {
    id: "ALERT-004",
    type: "Missing Documentation",
    message: "Laboratory claims missing required authorization documents",
    priority: "High" as const,
    timestamp: "2024-12-01 16:20:00",
    isResolved: true
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "positive": return "text-green-600";
    case "negative": return "text-red-600";
    default: return "text-gray-600";
  }
}

function getChangeIcon(changePercentage: string) {
  const isPositive = !changePercentage.startsWith("-");
  return isPositive ? "↗" : "↘";
}

function getRiskColor(riskLevel: string) {
  switch (riskLevel) {
    case "Critical": return "bg-red-100 text-red-800 border-red-200";
    case "High": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Pending": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case "In Progress": return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
    case "Filed": return <Badge className="bg-green-100 text-green-800 border-green-200">Filed</Badge>;
    case "Expired": return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
    case "On Hold": return <Badge className="bg-gray-100 text-gray-800 border-gray-200">On Hold</Badge>;
    default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
}

function getDaysRemainingColor(days: number) {
  if (days <= 0) return "text-red-600 font-bold";
  if (days <= 3) return "text-red-600";
  if (days <= 7) return "text-orange-600";
  return "text-green-600";
}

export function TimelyFilingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Timely Filing</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm text-gray-600">Real-time Monitoring</span>
            </div>
            <Button variant="outline" data-testid="button-export-filing">
              Export Report
            </Button>
          </div>
        </div>

        {/* Filing Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filingMetrics.map((metric, index) => (
            <Card key={index} className="healthcare-card">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 font-medium">{metric.name}</p>
                    <span className={`text-xs ${getStatusColor(metric.status)}`}>
                      {getChangeIcon(metric.changePercentage)}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">vs {metric.previousValue}</span>
                    <span className={`font-medium ${getStatusColor(metric.status)}`}>
                      {metric.changePercentage}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Target: {metric.target}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Alerts */}
        <Card className="healthcare-card border-l-4 border-red-400">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {recentAlerts.filter(alert => !alert.isResolved).length} Active
              </Badge>
            </div>
            <div className="space-y-3">
              {recentAlerts.slice(0, 3).map((alert, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    alert.isResolved ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {alert.isResolved ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{alert.type}</span>
                        <Badge className={getRiskColor(alert.priority)}>
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                  {!alert.isResolved && (
                    <Button size="sm" data-testid={`button-resolve-${alert.id}`}>
                      Resolve
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="critical" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Critical Claims</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Departments</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Filing Trends (Last 10 Days)
                  </h3>
                  <FilingTrendChart />
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Claims Volume (Last 7 Days)
                  </h3>
                  <FilingVolumeChart />
                </CardContent>
              </Card>
            </div>

            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Risk Level Distribution
                </h3>
                <RiskLevelDistribution />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Critical Claims Tab */}
          <TabsContent value="critical" className="space-y-6">
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Critical Claims Requiring Immediate Action</h3>
                  <div className="flex items-center space-x-4">
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Departments">All Departments</SelectItem>
                        <SelectItem value="Emergency Department">Emergency Department</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="General Surgery">General Surgery</SelectItem>
                        <SelectItem value="Oncology">Oncology</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      {criticalClaims.filter(claim => claim.daysRemaining <= 3).length} Critical
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {criticalClaims.map((claim, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      data-testid={`filing-claim-${claim.claimId}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            claim.daysRemaining <= 0 ? "bg-red-600 animate-pulse" :
                            claim.daysRemaining <= 3 ? "bg-red-500" : "bg-orange-500"
                          }`} />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-gray-900">{claim.claimId}</span>
                              {getStatusBadge(claim.status)}
                              <Badge className={getRiskColor(claim.riskLevel)}>
                                {claim.riskLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{claim.patientName}</p>
                            <p className="text-xs text-gray-500">
                              {claim.department} • Service Date: {claim.serviceDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${claim.claimAmount.toLocaleString()}</p>
                          <p className={`text-sm font-medium ${getDaysRemainingColor(claim.daysRemaining)}`}>
                            {claim.daysRemaining <= 0 ? "DUE TODAY" : `${claim.daysRemaining} days remaining`}
                          </p>
                          <p className="text-xs text-gray-500">Assigned: {claim.assignedTo}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Payer:</span>
                          <span className="font-medium ml-2">{claim.payerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Action:</span>
                          <span className="font-medium ml-2">{claim.lastAction}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700 text-white"
                          data-testid={`button-file-${claim.claimId}`}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          File Claim
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-contact-${claim.claimId}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Payer
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-details-${claim.claimId}`}>
                          <Timer className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Department Filing Performance
                </h3>
                <DepartmentPerformanceChart />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Monthly Filing Success Rate
                  </h3>
                  <div className="text-center py-8 text-gray-500">
                    Historical analytics chart would display monthly success rates, 
                    trends, and comparative analysis across departments.
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payer-Specific Deadlines
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Medicare</span>
                      <span className="text-sm text-gray-600">12 months from service date</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Medicaid</span>
                      <span className="text-sm text-gray-600">12 months from service date</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Commercial (Most)</span>
                      <span className="text-sm text-gray-600">90-180 days from service date</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Workers' Comp</span>
                      <span className="text-sm text-gray-600">Varies by state (30-180 days)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}