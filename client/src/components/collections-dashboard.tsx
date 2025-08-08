import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Phone,
  Mail,
  Network,
  FileText,
  Target
} from "lucide-react";
import { DischargeLocationsChart } from "./charts/discharge-locations-chart";
import { FinancialClassChart } from "./charts/financial-class-chart";
import { AgingSubcategoryCharts, AgingSummaryCards } from "./charts/aging-subcategory-charts";

const collectionsMetrics = [
  {
    name: "Total Collections Balance",
    value: "$45.9M",
    previousValue: "$43.2M",
    changePercentage: "+6.2",
    status: "neutral" as const,
    target: "$40.0M"
  },
  {
    name: "Active Accounts",
    value: "8,456",
    previousValue: "8,234",
    changePercentage: "+2.7",
    status: "positive" as const,
    target: "8,000"
  },
  {
    name: "Collection Rate",
    value: "87.3%",
    previousValue: "85.9%",
    changePercentage: "+1.4",
    status: "positive" as const,
    target: "90.0%"
  },
  {
    name: "Avg Days to Collect",
    value: "92.4",
    previousValue: "95.8",
    changePercentage: "-3.5",
    status: "positive" as const,
    target: "85.0"
  },
  {
    name: "Self-Pay Collections",
    value: "$13.2M",
    previousValue: "$12.8M",
    changePercentage: "+3.1",
    status: "positive" as const,
    target: "$15.0M"
  },
  {
    name: "Accounts in Legal",
    value: "234",
    previousValue: "198",
    changePercentage: "+18.2",
    status: "negative" as const,
    target: "150"
  }
];

const highPriorityAccounts = [
  {
    accountId: "ACC-89456",
    patientName: "Johnson, Michael R.",
    balance: 45600,
    ageInDays: 127,
    lastContact: "2024-11-28",
    nextFollowUp: "2024-12-05",
    status: "Active",
    payerClass: "Self-pay",
    location: "Main Hospital",
    collector: "Sarah Johnson",
    priority: "High" as const
  },
  {
    accountId: "ACC-78234",
    patientName: "Williams, Jennifer L.",
    balance: 38900,
    ageInDays: 145,
    lastContact: "2024-11-25",
    nextFollowUp: "2024-12-03",
    status: "Legal",
    payerClass: "Commercial",
    location: "Oncology Wing",
    collector: "Mark Thompson",
    priority: "High" as const
  },
  {
    accountId: "ACC-67123",
    patientName: "Brown, David A.",
    balance: 29300,
    ageInDays: 89,
    lastContact: "2024-11-30",
    nextFollowUp: "2024-12-07",
    status: "On Hold",
    payerClass: "Self-pay",
    location: "Day Surgery Center",
    collector: "Lisa Rodriguez",
    priority: "High" as const
  },
  {
    accountId: "ACC-56789",
    patientName: "Davis, Mary K.",
    balance: 52100,
    ageInDays: 156,
    lastContact: "2024-11-22",
    nextFollowUp: "2024-12-01",
    status: "Active",
    payerClass: "Worker's Comp",
    location: "Outpatient Plaza",
    collector: "Robert Chen",
    priority: "High" as const
  },
  {
    accountId: "ACC-45678",
    patientName: "Miller, Christopher J.",
    balance: 18700,
    ageInDays: 98,
    lastContact: "2024-11-29",
    nextFollowUp: "2024-12-06",
    status: "Active",
    payerClass: "Self-pay",
    location: "Medical Floor",
    collector: "Amanda Wilson",
    priority: "Medium" as const
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
    case "Active": return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    case "On Hold": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">On Hold</Badge>;
    case "Legal": return <Badge className="bg-red-100 text-red-800 border-red-200">Legal</Badge>;
    case "Settled": return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Settled</Badge>;
    default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High": return "text-red-600 bg-red-50";
    case "Medium": return "text-yellow-600 bg-yellow-50";
    case "Low": return "text-green-600 bg-green-50";
    default: return "text-gray-600 bg-gray-50";
  }
}

export function CollectionsDashboard() {
  const [selectedDimension, setSelectedDimension] = useState("Discharge Location");

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              data-testid="button-epic-architecture-collections"
            >
              <Network className="h-4 w-4" />
              <span className="text-sm">Epic Integration Architecture</span>
            </Button>
            <Button variant="outline" data-testid="button-export-collections">
              Export Report
            </Button>
          </div>
        </div>

        {/* Collections Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {collectionsMetrics.map((metric, index) => (
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

        {/* Dimension Selection */}
        <Card className="healthcare-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Select dimension:</label>
              <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Discharge Location">Discharge Location</SelectItem>
                  <SelectItem value="Payer Class">Payer Class</SelectItem>
                  <SelectItem value="Collector">Collector</SelectItem>
                  <SelectItem value="Priority Level">Priority Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Discharge Locations Chart */}
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Balance by Discharge Location
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Filtered to 10 bottom performing groups
              </p>
              <DischargeLocationsChart />
            </CardContent>
          </Card>

          {/* Financial Class Chart */}
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Balance Total by Original Financial Class
              </h3>
              <FinancialClassChart />
            </CardContent>
          </Card>
        </div>

        {/* Aging Analysis Summary Cards */}
        <AgingSummaryCards />

        {/* Aging Subcategory Charts */}
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <AgingSubcategoryCharts />
          </CardContent>
        </Card>

        {/* High Priority Accounts */}
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">High Priority Collections Accounts</h3>
              </div>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {highPriorityAccounts.filter(acc => acc.priority === "High").length} High Priority
              </Badge>
            </div>
            
            <div className="space-y-4">
              {highPriorityAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  data-testid={`collections-account-${account.accountId}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        account.priority === "High" ? "bg-red-500" : 
                        account.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{account.accountId}</span>
                          {getStatusBadge(account.status)}
                          <Badge className={`${getPriorityColor(account.priority)} border`}>
                            {account.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{account.patientName}</p>
                        <p className="text-xs text-gray-500">{account.location} • {account.payerClass}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${account.balance.toLocaleString()}</p>
                      <p className="text-sm text-red-600">{account.ageInDays} days</p>
                      <p className="text-xs text-gray-500">Assigned: {account.collector}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">Last Contact:</span>
                      <span className="font-medium">{account.lastContact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600">Next Follow-up:</span>
                      <span className="font-medium">{account.nextFollowUp}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" data-testid={`button-contact-${account.accountId}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-schedule-${account.accountId}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid={`button-view-${account.accountId}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}