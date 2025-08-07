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
import { PatientAppealModal } from "./patient-appeal-modal";
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
    denialId: "DEN-2025-001",
    claimId: "CLM-2025-001",
    patientName: "Martinez, Elena R.",
    serviceDate: "2025-01-03",
    payerName: "Medicare Advantage",
    deniedAmount: 12450,
    denialReason: "Inappropriate inpatient status - heart failure admission",
    category: "Medical Necessity",
    department: "Cardiology",
    provider: "Dr. Sarah Johnson",
    denialDate: "2025-01-05",
    appealDeadline: "2025-02-05",
    daysToAppeal: 30,
    status: "Under Review" as const,
    assignedReviewer: "Dr. Lisa Wilson",
    appealLevel: "First Level" as const,
    lastAction: "2025-01-08"
  },
  {
    denialId: "DEN-2025-003",
    claimId: "CLM-2025-003",
    patientName: "Thompson, Sarah M.",
    serviceDate: "2025-01-06",
    payerName: "Blue Cross Blue Shield",
    deniedAmount: 8750,
    denialReason: "COPD exacerbation - questioning inpatient necessity",
    category: "Medical Necessity",
    department: "Pulmonology",
    provider: "Dr. Robert Martinez",
    denialDate: "2025-01-06",
    appealDeadline: "2025-02-06",
    daysToAppeal: 30,
    status: "Pending Documentation" as const,
    assignedReviewer: "Dr. Mark Thompson",
    appealLevel: null,
    lastAction: "2025-01-08"
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
  const [selectedDenialForAppeal, setSelectedDenialForAppeal] = useState<any>(null);
  const [showAppealModal, setShowAppealModal] = useState(false);

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
    if (moduleType === "appeal") {
      setSelectedDenialForAppeal(denial);
      setShowAppealModal(true);
    } else {
      setSelectedDenialForRFP(denial);
      setActiveRFPModule(moduleType);
    }
  };

  const closeRFPModule = () => {
    setSelectedDenialForRFP(null);
    setActiveRFPModule(null);
  };

  const closeAppealModal = () => {
    setSelectedDenialForAppeal(null);
    setShowAppealModal(false);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Active Denials</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" data-testid={`button-assign-${denial.denialId}`}>
                              <Users className="h-4 w-4 mr-2" />
                              Assign Reviewer
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Assign Clinical Reviewer - {denial.denialId}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Denial Details */}
                              <div className="bg-gray-50 p-4 rounded">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Patient:</span> {denial.patientName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Amount:</span> ${denial.deniedAmount.toLocaleString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">Category:</span> {denial.category}
                                  </div>
                                  <div>
                                    <span className="font-medium">Days to Appeal:</span> 
                                    <span className={getDaysToAppealColor(denial.daysToAppeal)}> {denial.daysToAppeal} days</span>
                                  </div>
                                </div>
                              </div>

                              {/* Available Reviewers */}
                              <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Available Clinical Reviewers</h3>
                                <div className="grid gap-3">
                                  {[
                                    { 
                                      name: "Dr. Sarah Chen", 
                                      specialty: "Cardiology", 
                                      workload: 12, 
                                      avgDays: 2.8, 
                                      successRate: 89,
                                      status: "Available"
                                    },
                                    { 
                                      name: "Dr. Michael Rodriguez", 
                                      specialty: "Internal Medicine", 
                                      workload: 8, 
                                      avgDays: 3.2, 
                                      successRate: 92,
                                      status: "Available"
                                    },
                                    { 
                                      name: "Dr. Lisa Thompson", 
                                      specialty: "Surgery", 
                                      workload: 15, 
                                      avgDays: 4.1, 
                                      successRate: 85,
                                      status: "Busy"
                                    },
                                    { 
                                      name: "Dr. James Wilson", 
                                      specialty: "Emergency Medicine", 
                                      workload: 6, 
                                      avgDays: 2.3, 
                                      successRate: 94,
                                      status: "Available"
                                    }
                                  ].map((reviewer, index) => (
                                    <div key={index} className={`border rounded p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                      reviewer.status === "Busy" ? "opacity-60" : ""
                                    }`}>
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Stethoscope className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <div>
                                            <p className="font-medium text-gray-900">{reviewer.name}</p>
                                            <p className="text-xs text-gray-500">{reviewer.specialty}</p>
                                          </div>
                                        </div>
                                        <Badge className={
                                          reviewer.status === "Available" ? 
                                          "bg-green-100 text-green-800" : 
                                          "bg-yellow-100 text-yellow-800"
                                        }>
                                          {reviewer.status}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                                        <div>
                                          <span className="font-medium">Workload:</span> {reviewer.workload} cases
                                        </div>
                                        <div>
                                          <span className="font-medium">Avg Days:</span> {reviewer.avgDays}
                                        </div>
                                        <div>
                                          <span className="font-medium">Success Rate:</span> {reviewer.successRate}%
                                        </div>
                                      </div>
                                      {reviewer.status === "Available" && (
                                        <div className="mt-2">
                                          <Button size="sm" className="w-full">
                                            Assign to {reviewer.name.split(' ')[1]}
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Performance Overview */}
                              <div className="bg-blue-50 p-4 rounded">
                                <h4 className="font-medium text-blue-900 mb-2">Team Performance Summary</h4>
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                  <div className="text-center">
                                    <p className="font-semibold text-blue-900">41</p>
                                    <p className="text-blue-600">Total Active Cases</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-semibold text-blue-900">3.1</p>
                                    <p className="text-blue-600">Avg Review Days</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-semibold text-blue-900">90%</p>
                                    <p className="text-blue-600">Success Rate</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-semibold text-blue-900">$12.4M</p>
                                    <p className="text-blue-600">Recovered YTD</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
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





          {/* Analytics Tab - Lessons Learned */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Key Insights Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Prevention Opportunities</h3>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-sm font-medium text-red-800">30% of Medical Necessity denials</p>
                      <p className="text-xs text-red-600">Missing comprehensive documentation</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="text-sm font-medium text-orange-800">25% of Authorization denials</p>
                      <p className="text-xs text-orange-600">Pre-auth not obtained timely</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded">
                      <p className="text-sm font-medium text-yellow-800">18% of Coverage denials</p>
                      <p className="text-xs text-yellow-600">LCD criteria not verified</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Success Stories</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm font-medium text-green-800">42% reduction in M80 denials</p>
                      <p className="text-xs text-green-600">Enhanced documentation training</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-800">35% improvement in appeal success</p>
                      <p className="text-xs text-blue-600">Clinical decision support adoption</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-sm font-medium text-purple-800">28% faster resolution time</p>
                      <p className="text-xs text-purple-600">Streamlined reviewer assignment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
                    <Badge className="bg-blue-100 text-blue-800">High Priority</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Implement pre-auth checklist</p>
                        <p className="text-xs text-gray-600">Target: Reduce N425 denials by 40%</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Enhance LCD verification</p>
                        <p className="text-xs text-gray-600">Target: 90% compliance by Q2</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Documentation training</p>
                        <p className="text-xs text-gray-600">Focus: Medical necessity support</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Root Cause Analysis */}
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Root Cause Analysis - Top Prevention Opportunities
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Pattern</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Financial Impact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Root Cause</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prevention Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Missing Clinical Support</div>
                          <div className="text-sm text-gray-500">Medical Necessity Documentation</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">30%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2.85M</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">Incomplete clinical notes</div>
                          <div className="text-sm text-gray-500">Lack of necessity justification</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">Enhanced documentation templates</div>
                          <div className="text-sm text-gray-500">Clinical decision support integration</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Late Pre-Authorization</div>
                          <div className="text-sm text-gray-500">Timing and Process Issues</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">25%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1.89M</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">Manual tracking systems</div>
                          <div className="text-sm text-gray-500">Inconsistent follow-up</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">Automated pre-auth tracking</div>
                          <div className="text-sm text-gray-500">3+ day advance requirement</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-800">Implemented</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">LCD Criteria Gaps</div>
                          <div className="text-sm text-gray-500">Coverage Determination</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">18%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1.45M</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">Outdated coverage policies</div>
                          <div className="text-sm text-gray-500">Insufficient criteria verification</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">Real-time LCD verification</div>
                          <div className="text-sm text-gray-500">Automated policy updates</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-blue-100 text-blue-800">Planned</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Trends and Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Prevention Impact Trends
                  </h3>
                  <DenialTrendsChart />
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Learning Implementation Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Documentation Enhancement</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Pre-Auth Automation</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">90%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">LCD Verification System</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Staff Training Program</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                    </div>
                  </div>
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
                  {/* This modal now shows patient-specific appeal generation */}
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Patient-specific appeal generation is now available via the "Generate Appeal" button 
                      on individual denial records. For comprehensive appeal management, navigate to 
                      Denials → Appeals Management.
                    </p>
                  </div>
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
                  {/* Patient-Specific Medical Record Analysis */}
                  <div className="space-y-6">
                    {/* Patient Overview */}
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Patient Medical Record Analysis</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Patient Demographics</h5>
                              <div className="text-sm space-y-1">
                                <p><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedDenialForRFP.patientName}</span></p>
                                <p><span className="text-gray-600">Patient ID:</span> <span className="font-medium">{selectedDenialForRFP.patientId || 'PAT-' + Math.random().toString(36).substr(2, 5).toUpperCase()}</span></p>
                                <p><span className="text-gray-600">Date of Birth:</span> <span className="font-medium">03/15/1965</span></p>
                                <p><span className="text-gray-600">Age:</span> <span className="font-medium">59 years</span></p>
                                <p><span className="text-gray-600">Gender:</span> <span className="font-medium">Female</span></p>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Admission Details</h5>
                              <div className="text-sm space-y-1">
                                <p><span className="text-gray-600">Admission Date:</span> <span className="font-medium">{selectedDenialForRFP.serviceDate}</span></p>
                                <p><span className="text-gray-600">Department:</span> <span className="font-medium">{selectedDenialForRFP.department}</span></p>
                                <p><span className="text-gray-600">Attending Physician:</span> <span className="font-medium">{selectedDenialForRFP.provider}</span></p>
                                <p><span className="text-gray-600">Primary Diagnosis:</span> <span className="font-medium">I50.9 - Heart failure, unspecified</span></p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Clinical Indicators</h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                                  <span className="text-sm">Ejection Fraction</span>
                                  <Badge className="bg-red-100 text-red-800">35% (Severe)</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                                  <span className="text-sm">BNP Level</span>
                                  <Badge className="bg-yellow-100 text-yellow-800">850 pg/mL (Elevated)</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                                  <span className="text-sm">Creatinine</span>
                                  <Badge className="bg-red-100 text-red-800">2.1 mg/dL (High)</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                                  <span className="text-sm">Chest X-Ray</span>
                                  <Badge className="bg-green-100 text-green-800">Pulmonary Edema</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Clinical Documentation Analysis */}
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Documentation Assessment</h4>
                        <div className="space-y-4">
                          {[
                            {
                              category: "Admission Documentation",
                              status: "Complete",
                              color: "green",
                              items: [
                                "✓ H&P completed within 24 hours",
                                "✓ Admission orders documented",
                                "✓ Progress notes daily",
                                "✓ Physician signatures present"
                              ]
                            },
                            {
                              category: "Medical Necessity Criteria",
                              status: "Meets Requirements",
                              color: "green",
                              items: [
                                "✓ Acute exacerbation of heart failure",
                                "✓ IV diuretic therapy required",
                                "✓ Monitoring for fluid overload",
                                "✓ Inability to manage outpatient"
                              ]
                            },
                            {
                              category: "Potential Documentation Gaps",
                              status: "Action Required",
                              color: "orange",
                              items: [
                                "⚠ Social work assessment incomplete",
                                "⚠ Discharge planning note missing",
                                "⚠ Patient education documentation needed"
                              ]
                            }
                          ].map((section, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-900">{section.category}</h5>
                                <Badge className={
                                  section.color === "green" ? "bg-green-100 text-green-800" :
                                  section.color === "orange" ? "bg-orange-100 text-orange-800" :
                                  "bg-red-100 text-red-800"
                                }>
                                  {section.status}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                {section.items.map((item, idx) => (
                                  <p key={idx} className="text-sm text-gray-700">{item}</p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Recommendations */}
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">AI Clinical Recommendations</h4>
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <h5 className="font-medium text-blue-900">Appeal Probability: High (85%)</h5>
                                <p className="text-sm text-blue-700 mt-1">
                                  Clinical documentation strongly supports inpatient status. Patient meets InterQual criteria for inpatient care with severe heart failure exacerbation requiring IV therapy and close monitoring.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <Stethoscope className="h-5 w-5 text-green-600 mt-0.5" />
                              <div>
                                <h5 className="font-medium text-green-900">Recommended Actions</h5>
                                <ul className="text-sm text-green-700 mt-1 space-y-1">
                                  <li>• Obtain complete social work assessment</li>
                                  <li>• Document discharge planning discussion</li>
                                  <li>• Add patient education notes</li>
                                  <li>• Include family conference documentation</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                              <div>
                                <h5 className="font-medium text-yellow-900">Appeal Strategy</h5>
                                <p className="text-sm text-yellow-700 mt-1">
                                  Focus on medical necessity with emphasis on acute decompensation requiring IV diuretics, monitoring, and inability to manage symptoms outpatient. Include cardiology consultation and echo results.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Clinical Summary
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Gavel className="h-4 w-4 mr-2" />
                        Generate Appeal Letter
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Medical Record
                      </Button>
                    </div>
                  </div>
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

        {/* Patient-specific Appeal Generation Modal */}
        {selectedDenialForAppeal && (
          <PatientAppealModal
            denial={selectedDenialForAppeal}
            isOpen={showAppealModal}
            onClose={closeAppealModal}
          />
        )}
      </div>
    </main>
  );
}