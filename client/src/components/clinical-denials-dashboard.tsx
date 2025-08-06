import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertCircle, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  RefreshCw,
  Gavel,
  Stethoscope,
  Shield,
  ExternalLink
} from "lucide-react";
import { DenialTrendsChart, DenialCategoryChart } from "./charts/denial-trends-chart";
import { DenialReasonAnalysis, PayerDenialPatterns } from "./charts/denial-reason-analysis";
import { AppealGenerationDashboard } from "./appeal-generation-dashboard";
import { ClinicalDecisionDashboard } from "./clinical-decision-dashboard";
import { PreAuthorizationDashboard } from "./pre-authorization-dashboard";

const clinicalMetrics = [
  {
    name: "Total Active Denials",
    value: "1,286",
    previousValue: "1,195",
    changePercentage: "+7.6",
    status: "negative" as const,
    target: "<1,000"
  },
  {
    name: "Denied Amount",
    value: "$21.8M",
    previousValue: "$19.4M",
    changePercentage: "+12.4",
    status: "negative" as const,
    target: "<$15M"
  },
  {
    name: "Appeal Success Rate",
    value: "41.7%",
    previousValue: "38.9%",
    changePercentage: "+2.8",
    status: "positive" as const,
    target: ">45%"
  },
  {
    name: "Avg Review Time",
    value: "8.3 days",
    previousValue: "9.7 days",
    changePercentage: "-14.4",
    status: "positive" as const,
    target: "<7 days"
  },
  {
    name: "Pending Appeals",
    value: "342",
    previousValue: "298",
    changePercentage: "+14.8",
    status: "negative" as const,
    target: "<250"
  },
  {
    name: "Recovered This Month",
    value: "$7.2M",
    previousValue: "$6.1M",
    changePercentage: "+18.0",
    status: "positive" as const,
    target: ">$8M"
  }
];

const activeDenials = [
  {
    denialId: "DN-24-089456",
    claimId: "CLM-24-089456",
    patientName: "Johnson, Michael R.",
    serviceDate: "2024-10-15",
    payerName: "Medicare",
    deniedAmount: 45600,
    denialReason: "Medical Necessity - N386",
    category: "Medical Necessity",
    department: "Cardiology",
    provider: "Dr. Sarah Wilson",
    denialDate: "2024-11-15",
    appealDeadline: "2025-01-14",
    daysToAppeal: 43,
    status: "Under Review" as const,
    assignedReviewer: "Dr. Mark Thompson",
    appealLevel: "First Level" as const,
    lastAction: "2024-11-28"
  },
  {
    denialId: "DN-24-078234",
    claimId: "CLM-24-078234",
    patientName: "Williams, Jennifer L.",
    serviceDate: "2024-10-20",
    payerName: "Blue Cross Blue Shield",
    deniedAmount: 38900,
    denialReason: "Authorization Required - N425",
    category: "Authorization",
    department: "Orthopedics",
    provider: "Dr. Lisa Rodriguez",
    denialDate: "2024-11-18",
    appealDeadline: "2025-01-17",
    daysToAppeal: 46,
    status: "Appeal Submitted" as const,
    assignedReviewer: "Dr. Robert Chen",
    appealLevel: "First Level" as const,
    lastAction: "2024-12-01"
  },
  {
    denialId: "DN-24-067123",
    claimId: "CLM-24-067123",
    patientName: "Brown, David A.",
    serviceDate: "2024-10-12",
    payerName: "Aetna",
    deniedAmount: 29300,
    denialReason: "LCD Coverage - N432",
    category: "Coverage",
    department: "General Surgery",
    provider: "Dr. Amanda Wilson",
    denialDate: "2024-11-10",
    appealDeadline: "2025-01-09",
    daysToAppeal: 38,
    status: "Pending Documentation" as const,
    assignedReviewer: "Dr. James Anderson",
    appealLevel: null,
    lastAction: "2024-11-25"
  },
  {
    denialId: "DN-24-056789",
    claimId: "CLM-24-056789",
    patientName: "Davis, Mary K.",
    serviceDate: "2024-10-25",
    payerName: "UnitedHealthcare",
    deniedAmount: 52100,
    denialReason: "Same Day Service - N428",
    category: "Coding",
    department: "Emergency Department",
    provider: "Dr. Michael Garcia",
    denialDate: "2024-11-22",
    appealDeadline: "2025-01-21",
    daysToAppeal: 50,
    status: "Under Review" as const,
    assignedReviewer: "Dr. Patricia Martinez",
    appealLevel: "First Level" as const,
    lastAction: "2024-11-30"
  },
  {
    denialId: "DN-24-045678",
    claimId: "CLM-24-045678",
    patientName: "Miller, Christopher J.",
    serviceDate: "2024-10-30",
    payerName: "Humana",
    deniedAmount: 18700,
    denialReason: "Medical Necessity - M80",
    category: "Documentation",
    department: "Radiology",
    provider: "Dr. Jennifer Kim",
    denialDate: "2024-11-25",
    appealDeadline: "2025-01-24",
    daysToAppeal: 53,
    status: "Overturned" as const,
    assignedReviewer: "Dr. David Park",
    appealLevel: "First Level" as const,
    lastAction: "2024-12-02"
  }
];

const clinicalReviewers = [
  {
    reviewerId: "REV-001",
    name: "Dr. Mark Thompson",
    credentials: "MD, FACP",
    specialization: "Internal Medicine",
    activeReviews: 23,
    completedThisMonth: 87,
    appealSuccessRate: 45.8,
    avgReviewTime: 6.2
  },
  {
    reviewerId: "REV-002", 
    name: "Dr. Sarah Martinez",
    credentials: "MD, FACS",
    specialization: "General Surgery",
    activeReviews: 18,
    completedThisMonth: 64,
    appealSuccessRate: 52.3,
    avgReviewTime: 7.8
  },
  {
    reviewerId: "REV-003",
    name: "Dr. Robert Chen",
    credentials: "MD, FACC",
    specialization: "Cardiology",
    activeReviews: 31,
    completedThisMonth: 92,
    appealSuccessRate: 41.2,
    avgReviewTime: 8.9
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

function getStatusBadge(status: string) {
  switch (status) {
    case "Under Review": return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Under Review</Badge>;
    case "Appeal Submitted": return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Appeal Submitted</Badge>;
    case "Pending Documentation": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Documentation</Badge>;
    case "Overturned": return <Badge className="bg-green-100 text-green-800 border-green-200">Overturned</Badge>;
    case "Upheld": return <Badge className="bg-red-100 text-red-800 border-red-200">Upheld</Badge>;
    case "Closed": return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Closed</Badge>;
    default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Medical Necessity": return "bg-red-100 text-red-800 border-red-200";
    case "Authorization": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Coverage": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Coding": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Documentation": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getDaysToAppealColor(days: number) {
  if (days <= 14) return "text-red-600 font-semibold";
  if (days <= 30) return "text-orange-600";
  return "text-green-600";
}

export function ClinicalDenialsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedPayer, setSelectedPayer] = useState("All Payers");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDenialForRFP, setSelectedDenialForRFP] = useState<any>(null);
  const [activeRFPModule, setActiveRFPModule] = useState<string | null>(null);

  const filteredDenials = activeDenials.filter(denial => {
    const matchesSearch = searchTerm === "" || 
      denial.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denial.denialId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "All Departments" || denial.department === selectedDepartment;
    const matchesPayer = selectedPayer === "All Payers" || denial.payerName === selectedPayer;
    
    return matchesSearch && matchesDepartment && matchesPayer;
  });

  // Helper functions for contextual RFP module integration
  const getContextualActions = (denial: any) => {
    const actions = [];

    // Appeal Generation - for appealable denials
    if (denial.daysToAppeal > 0 && denial.status !== "Upheld" && denial.status !== "Closed") {
      actions.push({
        type: "appeal",
        label: "Generate Appeal",
        icon: Gavel,
        color: "bg-purple-600 hover:bg-purple-700",
        description: "AI-powered appeal letter generation"
      });
    }

    // Clinical Decision Support - for medical necessity and documentation denials
    if (denial.category === "Medical Necessity" || denial.category === "Documentation") {
      actions.push({
        type: "clinical",
        label: "Clinical Review",
        icon: Stethoscope,
        color: "bg-blue-600 hover:bg-blue-700",
        description: "Medical record analysis and recommendations"
      });
    }

    // Pre-Authorization Check - for authorization-related denials
    if (denial.category === "Authorization" || denial.denialReason.includes("authorization")) {
      actions.push({
        type: "preauth",
        label: "Check Pre-Auth",
        icon: Shield,
        color: "bg-green-600 hover:bg-green-700",
        description: "Pre-authorization status and requirements"
      });
    }

    return actions;
  };

  const handleRFPModuleOpen = (denial: any, moduleType: string) => {
    setSelectedDenialForRFP(denial);
    setActiveRFPModule(moduleType);
  };

  const closeRFPModule = () => {
    setSelectedDenialForRFP(null);
    setActiveRFPModule(null);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Clinical Denials</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm text-gray-600">Last Updated: Just now</span>
            </div>
            <Button variant="outline" data-testid="button-export-denials">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Clinical Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {clinicalMetrics.map((metric, index) => (
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

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Active Denials</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Reason Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="reviewers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Reviewers</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trends</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Denial Trends (Last 7 Days)
                  </h3>
                  <DenialTrendsChart />
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Denials by Category
                  </h3>
                  <DenialCategoryChart />
                </CardContent>
              </Card>
            </div>

            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payer Denial Patterns
                </h3>
                <PayerDenialPatterns />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Denials Tab */}
          <TabsContent value="active" className="space-y-6">
            {/* Filters */}
            <Card className="healthcare-card">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by patient name or denial ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                      data-testid="input-search-denials"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Departments">All Departments</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="General Surgery">General Surgery</SelectItem>
                      <SelectItem value="Emergency Department">Emergency Department</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPayer} onValueChange={setSelectedPayer}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Payers">All Payers</SelectItem>
                      <SelectItem value="Medicare">Medicare</SelectItem>
                      <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
                      <SelectItem value="Aetna">Aetna</SelectItem>
                      <SelectItem value="UnitedHealthcare">UnitedHealthcare</SelectItem>
                      <SelectItem value="Humana">Humana</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Filter className="h-4 w-4" />
                    <span>{filteredDenials.length} of {activeDenials.length} denials</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Denials List */}
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredDenials.map((denial, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      data-testid={`denial-${denial.denialId}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            denial.daysToAppeal <= 14 ? "bg-red-500 animate-pulse" :
                            denial.daysToAppeal <= 30 ? "bg-orange-500" : "bg-green-500"
                          }`} />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-gray-900">{denial.denialId}</span>
                              {getStatusBadge(denial.status)}
                              <Badge className={getCategoryColor(denial.category)}>
                                {denial.category}
                              </Badge>
                              {denial.appealLevel && (
                                <Badge variant="outline">{denial.appealLevel}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{denial.patientName}</p>
                            <p className="text-xs text-gray-500">
                              {denial.department} • {denial.provider} • Service Date: {denial.serviceDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${denial.deniedAmount.toLocaleString()}</p>
                          <p className={`text-sm ${getDaysToAppealColor(denial.daysToAppeal)}`}>
                            {denial.daysToAppeal} days to appeal
                          </p>
                          <p className="text-xs text-gray-500">
                            Assigned: {denial.assignedReviewer || "Unassigned"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Payer:</span>
                          <span className="font-medium ml-2">{denial.payerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Denial Reason:</span>
                          <span className="font-medium ml-2">{denial.denialReason}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Denial Date:</span>
                          <span className="font-medium ml-2">{denial.denialDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Appeal Deadline:</span>
                          <span className="font-medium ml-2">{denial.appealDeadline}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Essential Administrative Actions */}
                        <Button size="sm" variant="outline" data-testid={`button-assign-${denial.denialId}`}>
                          <Users className="h-4 w-4 mr-2" />
                          Assign Reviewer
                        </Button>
                        
                        {/* Contextual RFP Module Actions */}
                        {getContextualActions(denial).length > 0 ? (
                          <div className="flex gap-2">
                            {getContextualActions(denial).map((action, actionIndex) => {
                              const IconComponent = action.icon;
                              return (
                                <Dialog key={actionIndex}>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      className={`text-white ${action.color}`}
                                      title={action.description}
                                      data-testid={`button-${action.type}-${denial.denialId}`}
                                      onClick={() => handleRFPModuleOpen(denial, action.type)}
                                    >
                                      <IconComponent className="h-4 w-4 mr-1" />
                                      {action.label}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </Button>
                                  </DialogTrigger>
                                </Dialog>
                              );
                            })}
                          </div>
                        ) : (
                          /* Fallback actions for denials without contextual RFP modules */
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              data-testid={`button-review-${denial.denialId}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review Details
                            </Button>
                            {denial.daysToAppeal > 0 && denial.status !== "Upheld" && denial.status !== "Closed" && (
                              <Button size="sm" variant="outline" data-testid={`button-appeal-${denial.denialId}`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Manual Appeal
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reason Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Denial Reasons
                </h3>
                <DenialReasonAnalysis />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviewers Tab */}
          <TabsContent value="reviewers" className="space-y-6">
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Clinical Reviewers Performance
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {clinicalReviewers.map((reviewer, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{reviewer.name}</h4>
                          <p className="text-sm text-gray-600">{reviewer.credentials}</p>
                          <p className="text-xs text-gray-500">{reviewer.specialization}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          reviewer.activeReviews > 25 ? "bg-red-500" :
                          reviewer.activeReviews > 15 ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Reviews:</span>
                          <span className="font-medium">{reviewer.activeReviews}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed This Month:</span>
                          <span className="font-medium">{reviewer.completedThisMonth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Appeal Success Rate:</span>
                          <span className="font-medium text-green-600">{reviewer.appealSuccessRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Review Time:</span>
                          <span className="font-medium">{reviewer.avgReviewTime} days</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Weekly Denial Volume
                  </h3>
                  <DenialTrendsChart />
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Category Distribution
                  </h3>
                  <DenialCategoryChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* RFP Module Modals */}
        {selectedDenialForRFP && (
          <>
            {/* Appeal Generation Modal */}
            <Dialog open={activeRFPModule === "appeal"} onOpenChange={closeRFPModule}>
              <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Gavel className="h-5 w-5 text-purple-600" />
                    <span>Appeal Generation - {selectedDenialForRFP.denialId}</span>
                    <Badge className="ml-2 bg-purple-100 text-purple-800">
                      {selectedDenialForRFP.patientName}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Denial Context</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Denial Reason:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.denialReason}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Denied Amount:</span>
                        <span className="ml-2 font-medium">${selectedDenialForRFP.deniedAmount?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Days to Appeal:</span>
                        <span className={`ml-2 font-medium ${getDaysToAppealColor(selectedDenialForRFP.daysToAppeal)}`}>
                          {selectedDenialForRFP.daysToAppeal} days
                        </span>
                      </div>
                    </div>
                  </div>
                  <AppealGenerationDashboard />
                </div>
              </DialogContent>
            </Dialog>

            {/* Clinical Decision Support Modal */}
            <Dialog open={activeRFPModule === "clinical"} onOpenChange={closeRFPModule}>
              <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    <span>Clinical Decision Support - {selectedDenialForRFP.denialId}</span>
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      {selectedDenialForRFP.patientName}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Medical Necessity Review Context</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Denial Reason:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.denialReason}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Department:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.department}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Provider:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.provider}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Service Date:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.serviceDate}</span>
                      </div>
                    </div>
                  </div>
                  <ClinicalDecisionDashboard />
                </div>
              </DialogContent>
            </Dialog>

            {/* Pre-Authorization Check Modal */}
            <Dialog open={activeRFPModule === "preauth"} onOpenChange={closeRFPModule}>
              <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Pre-Authorization Analysis - {selectedDenialForRFP.denialId}</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      {selectedDenialForRFP.patientName}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Authorization Context</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Payer:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.payerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Denial Reason:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.denialReason}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Service Date:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.serviceDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Procedure:</span>
                        <span className="ml-2 font-medium">{selectedDenialForRFP.procedureCode || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <PreAuthorizationDashboard />
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </main>
  );
}