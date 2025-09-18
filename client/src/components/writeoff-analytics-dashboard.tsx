import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Search,
  Download,
  RefreshCw,
  X,
  FileText,
  CreditCard,
  PieChart,
} from "lucide-react";
import {
  WriteOffTrendsChart,
  WriteOffReasonChart,
} from "./charts/writeoff-trends-chart";
import { WriteOffFilterProvider, useWriteOffFilters } from "./writeoff-filter-context";

const writeOffMetrics = [
  {
    name: "Total Write-Offs",
    value: "$312K",
    previousValue: "$298K",
    changePercentage: "+4.7",
    status: "negative" as const,
    target: "<$280K",
  },
  {
    name: "Bad Debt Amount",
    value: "$84K",
    previousValue: "$91K",
    changePercentage: "-7.7",
    status: "positive" as const,
    target: "<$75K",
  },
  {
    name: "Recovery Rate",
    value: "21.4%",
    previousValue: "19.8%",
    changePercentage: "+1.6",
    status: "positive" as const,
    target: ">25%",
  },
  {
    name: "Charity Care",
    value: "$56K",
    previousValue: "$48K",
    changePercentage: "+16.7",
    status: "neutral" as const,
    target: "Variable",
  },
  {
    name: "Contractual Adjustments",
    value: "$118K",
    previousValue: "$112K",
    changePercentage: "+5.4",
    status: "neutral" as const,
    target: "Expected",
  },
  {
    name: "Collection Rate",
    value: "94.2%",
    previousValue: "93.8%",
    changePercentage: "+0.4",
    status: "positive" as const,
    target: ">95%",
  },
];

const writeOffData = [
  {
    writeOffId: "WO-24-089456",
    claimId: "CLM-24-089456",
    patientName: "Johnson, Michael R.",
    serviceDate: "2024-10-15",
    payerName: "Medicare",
    writeOffAmount: 4560,
    reason: "contractual",
    reasonDescription: "Contractual Adjustment - Medicare Allowable",
    department: "Cardiology",
    provider: "Dr. Sarah Wilson",
    site: "Medical Center Health System",
    writeOffDate: "2024-11-15",
    status: "final",
    badDebtFlag: false,
    recoveryAmount: 0,
    agingDays: 45,
  },
  {
    writeOffId: "WO-24-089457",
    claimId: "CLM-24-089457",
    patientName: "Martinez, Elena R.",
    serviceDate: "2024-09-20",
    payerName: "Uninsured",
    writeOffAmount: 12450,
    reason: "charity",
    reasonDescription: "Charity Care - Financial Hardship",
    department: "Emergency Department",
    provider: "Dr. Robert Chen",
    site: "Hendrick Health",
    writeOffDate: "2024-11-01",
    status: "final",
    badDebtFlag: false,
    recoveryAmount: 0,
    agingDays: 90,
  },
  {
    writeOffId: "WO-24-089458",
    claimId: "CLM-24-089458",
    patientName: "Thompson, Sarah M.",
    serviceDate: "2024-08-15",
    payerName: "Self-Pay",
    writeOffAmount: 8750,
    reason: "bad_debt",
    reasonDescription: "Bad Debt - Collection Exhausted",
    department: "Surgery",
    provider: "Dr. Lisa Rodriguez",
    site: "Medical Center Health System",
    writeOffDate: "2024-10-20",
    status: "final",
    badDebtFlag: true,
    recoveryAmount: 1250,
    agingDays: 120,
  },
  {
    writeOffId: "WO-24-089459",
    claimId: "CLM-24-089459",
    patientName: "Williams, Jennifer L.",
    serviceDate: "2024-11-01",
    payerName: "Blue Cross Blue Shield",
    writeOffAmount: 125,
    reason: "small_balance",
    reasonDescription: "Small Balance Write-Off",
    department: "Radiology",
    provider: "Dr. Amanda Davis",
    site: "Hendrick Health",
    writeOffDate: "2024-11-10",
    status: "final",
    badDebtFlag: false,
    recoveryAmount: 0,
    agingDays: 15,
  },
  {
    writeOffId: "WO-24-089460",
    claimId: "CLM-24-089460",
    patientName: "Brown, David A.",
    serviceDate: "2024-10-25",
    payerName: "Aetna",
    site: "Medical Center Health System",
    writeOffAmount: 890,
    reason: "prompt_pay",
    reasonDescription: "Prompt Pay Discount",
    department: "Orthopedics",
    provider: "Dr. Michael Garcia",
    writeOffDate: "2024-11-05",
    status: "final",
    badDebtFlag: false,
    recoveryAmount: 0,
    agingDays: 20,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "positive":
      return "text-green-600";
    case "negative":
      return "text-[#f13c45]";
    case "neutral":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}

function getChangeIcon(changePercentage: string) {
  const isPositive = !changePercentage.startsWith("-");
  return isPositive ? "↗" : "↘";
}

function getReasonBadge(reason: string) {
  switch (reason) {
    case "contractual":
      return (
        <Badge className="bg-[#006d9a]/20 text-[#006d9a] border-[#006d9a]/30">
          Contractual
        </Badge>
      );
    case "bad_debt":
      return (
        <Badge className="bg-[#f13c45]/20 text-[#f13c45]/95 border-[#f13c45]/30">
          Bad Debt
        </Badge>
      );
    case "charity":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Charity Care
        </Badge>
      );
    case "small_balance":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Small Balance
        </Badge>
      );
    case "prompt_pay":
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Prompt Pay
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {reason}
        </Badge>
      );
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "final":
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Final
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Pending
        </Badge>
      );
    case "under_review":
      return (
        <Badge className="bg-[#006d9a]/20 text-[#006d9a] border-[#006d9a]/30">
          Under Review
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {status}
        </Badge>
      );
  }
}

function getAmountColor(amount: number) {
  if (amount > 10000) return "text-[#f13c45] font-semibold";
  if (amount > 5000) return "text-[#f8961d]";
  return "text-gray-900";
}

// Internal dashboard component that uses the filters
function WriteOffDashboardContent() {
  const { filters, clearFilters, hasActiveFilters } = useWriteOffFilters();
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedPayer, setSelectedPayer] = useState("All Payers");
  const [selectedSite, setSelectedSite] = useState("All Sites");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartGroupBy, setChartGroupBy] = useState("month");

  const filteredWriteOffs = writeOffData.filter((writeOff) => {
    const matchesSearch =
      searchTerm === "" ||
      writeOff.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      writeOff.writeOffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      writeOff.department === selectedDepartment;
    const matchesPayer =
      selectedPayer === "All Payers" || writeOff.payerName === selectedPayer;
    const matchesSite =
      selectedSite === "All Sites" || writeOff.site === selectedSite;

    // Chart-based filters from context
    const matchesReason =
      !filters.reason || writeOff.reason === filters.reason;

    const matchesChartPayer =
      !filters.payer || writeOff.payerName === filters.payer;

    const matchesChartDepartment =
      !filters.department || writeOff.department === filters.department;

    const matchesStatus =
      !filters.status || writeOff.status === filters.status;

    const matchesBadDebt =
      filters.badDebtFlag === undefined || writeOff.badDebtFlag === filters.badDebtFlag;

    // Date range filtering
    const matchesDateRange = 
      (!filters.dateFrom || new Date(writeOff.writeOffDate) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(writeOff.writeOffDate) <= new Date(filters.dateTo));

    return matchesSearch && 
           matchesDepartment && 
           matchesPayer && 
           matchesSite &&
           matchesReason && 
           matchesChartPayer && 
           matchesChartDepartment &&
           matchesStatus &&
           matchesBadDebt &&
           matchesDateRange;
  });

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Write-Off Analytics</h2>
          <p className="text-muted-foreground">
            Monitor and analyze write-off patterns, bad debt trends, and collection performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {writeOffMetrics.map((metric, index) => (
          <Card key={index} className="healthcare-card" data-testid={`card-metric-${index}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {getChangeIcon(metric.changePercentage)} {metric.changePercentage}%
                    </span>
                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: {metric.target}</p>
                </div>
                
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Controls */}
      <Card className="healthcare-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by patient name or write-off ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48" data-testid="select-department">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments">All Departments</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Emergency Department">Emergency Department</SelectItem>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Radiology">Radiology</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPayer} onValueChange={setSelectedPayer}>
              <SelectTrigger className="w-48" data-testid="select-payer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Payers">All Payers</SelectItem>
                <SelectItem value="Medicare">Medicare</SelectItem>
                <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
                <SelectItem value="Aetna">Aetna</SelectItem>
                <SelectItem value="Self-Pay">Self-Pay</SelectItem>
                <SelectItem value="Uninsured">Uninsured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-48" data-testid="select-site">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sites">All Sites</SelectItem>
                <SelectItem value="Medical Center Health System">Medical Center Health System</SelectItem>
                <SelectItem value="Hendrick Health">Hendrick Health</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-[#f13c45] hover:text-[#f13c45]/90"
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart Grouping Controls */}
      <Card className="healthcare-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Chart View Options</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Group by:</span>
              <Select value={chartGroupBy} onValueChange={setChartGroupBy}>
                <SelectTrigger className="w-40" data-testid="select-chart-group">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="payer">Payer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className={`grid gap-6 ${hasActiveFilters ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Left Column: Charts */}
        <div className="space-y-6">
          <Card className="healthcare-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Write-Off Trends
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Click data points to filter by date)
                </span>
              </h3>
              <WriteOffTrendsChart groupBy={chartGroupBy} />
            </CardContent>
          </Card>

          <Card className="healthcare-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Write-Off by Reason
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Click bars to filter)
                </span>
              </h3>
              <WriteOffReasonChart groupBy={chartGroupBy} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Filtered Write-Off List (only when filters are active) */}
        {hasActiveFilters && (
          <div className="space-y-6">
            <Card className="healthcare-card">
              <CardContent className="p-6">
                {/* Active Filters Display */}
                <div className="mb-4 p-3 bg-[#006d9a]/10 border border-[#006d9a]/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-[#006d9a]" />
                      <span className="text-sm font-medium text-[#006d9a]">Active Filters:</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-[#006d9a] hover:text-[#006d9a]/90"
                      data-testid="button-clear-active-filters"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.reason && (
                      <Badge variant="secondary" data-testid={`badge-filter-reason-${filters.reason}`}>
                        Reason: {filters.reason}
                      </Badge>
                    )}
                    {filters.payer && (
                      <Badge variant="secondary" data-testid={`badge-filter-payer-${filters.payer}`}>
                        Payer: {filters.payer}
                      </Badge>
                    )}
                    {filters.department && (
                      <Badge variant="secondary" data-testid={`badge-filter-department-${filters.department}`}>
                        Department: {filters.department}
                      </Badge>
                    )}
                    {filters.dateFrom && (
                      <Badge variant="secondary" data-testid="badge-filter-date">
                        Date: {filters.dateFrom}
                        {filters.dateTo && filters.dateTo !== filters.dateFrom && ` to ${filters.dateTo}`}
                      </Badge>
                    )}
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Filtered Write-Offs ({filteredWriteOffs.length})
                </h4>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredWriteOffs.map((writeOff) => (
                    <div
                      key={writeOff.writeOffId}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      data-testid={`card-writeoff-${writeOff.writeOffId}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-semibold text-gray-900" data-testid={`text-patient-${writeOff.writeOffId}`}>
                              {writeOff.patientName}
                            </h5>
                            {getReasonBadge(writeOff.reason)}
                            {getStatusBadge(writeOff.status)}
                            {writeOff.badDebtFlag && (
                              <Badge className="bg-[#f13c45]/20 text-[#f13c45]/95 border-[#f13c45]/30" data-testid={`badge-bad-debt-${writeOff.writeOffId}`}>
                                Bad Debt
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>Write-Off ID: {writeOff.writeOffId}</div>
                            <div>Claim: {writeOff.claimId}</div>
                            <div>Department: {writeOff.department}</div>
                            <div>Payer: {writeOff.payerName}</div>
                            <div>Service Date: {writeOff.serviceDate}</div>
                            <div>Write-Off Date: {writeOff.writeOffDate}</div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{writeOff.reasonDescription}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-lg font-bold ${getAmountColor(writeOff.writeOffAmount)}`} data-testid={`text-amount-${writeOff.writeOffId}`}>
                            ${writeOff.writeOffAmount.toLocaleString()}
                          </div>
                          {writeOff.recoveryAmount > 0 && (
                            <div className="text-sm text-green-600" data-testid={`text-recovery-${writeOff.writeOffId}`}>
                              Recovered: ${writeOff.recoveryAmount.toLocaleString()}
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            Aging: {writeOff.agingDays} days
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredWriteOffs.length === 0 && (
                    <div className="text-center py-8 text-gray-500" data-testid="text-no-results">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No write-offs match the current filters.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Main exported component with filter provider
export function WriteOffAnalyticsDashboard() {
  return (
    <WriteOffFilterProvider>
      <WriteOffDashboardContent />
    </WriteOffFilterProvider>
  );
}