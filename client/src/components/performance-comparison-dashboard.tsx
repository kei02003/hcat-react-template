import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building2,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from "date-fns";

// Mock denial data for calculations (this would come from actual API in production)
const mockDenialData = [
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
    site: "Medical Center Health System",
    denialDate: "2024-11-15",
    appealDeadline: "2025-01-14",
    daysToAppeal: 43,
    status: "Under Review" as const,
    assignedReviewer: "Dr. Mark Thompson",
    appealLevel: "First Level" as const,
    lastAction: "2024-11-28",
    appealed: true,
    appealOutcome: "Overturned",
    recoveredAmount: 45600,
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
    site: "Hendrick Health",
    denialDate: "2025-01-05",
    appealDeadline: "2025-02-05",
    daysToAppeal: 30,
    status: "Under Review" as const,
    assignedReviewer: "Dr. Lisa Wilson",
    appealLevel: "First Level" as const,
    lastAction: "2025-01-08",
    appealed: false,
    appealOutcome: null,
    recoveredAmount: 0,
  },
  {
    denialId: "DEN-2025-003",
    claimId: "CLM-2025-003",
    patientName: "Thompson, Robert A.",
    serviceDate: "2024-12-20",
    payerName: "Blue Cross Blue Shield",
    deniedAmount: 28750,
    denialReason: "Prior authorization required",
    category: "Authorization",
    department: "Orthopedics",
    provider: "Dr. Michael Brown",
    site: "Medical Center Health System",
    denialDate: "2024-12-22",
    appealDeadline: "2025-01-22",
    daysToAppeal: 15,
    status: "Pending Appeal" as const,
    assignedReviewer: "Dr. Amanda Davis",
    appealLevel: "First Level" as const,
    lastAction: "2024-12-28",
    appealed: true,
    appealOutcome: "Pending",
    recoveredAmount: 0,
  },
  {
    denialId: "DEN-2024-892",
    claimId: "CLM-2024-892",
    patientName: "Davis, Jennifer L.",
    serviceDate: "2024-11-05",
    payerName: "Aetna",
    deniedAmount: 15200,
    denialReason: "Duplicate service",
    category: "Coding",
    department: "Emergency Department",
    provider: "Dr. Kevin Rodriguez",
    site: "Hendrick Health",
    denialDate: "2024-11-08",
    appealDeadline: "2024-12-08",
    daysToAppeal: -10,
    status: "Appeal Deadline Passed" as const,
    assignedReviewer: "Dr. Maria Garcia",
    appealLevel: "None" as const,
    lastAction: "2024-11-12",
    appealed: false,
    appealOutcome: null,
    recoveredAmount: 0,
  },
  {
    denialId: "DEN-2024-756",
    claimId: "CLM-2024-756",
    patientName: "Wilson, Christopher M.",
    serviceDate: "2024-10-28",
    payerName: "UnitedHealthcare",
    deniedAmount: 67300,
    denialReason: "Experimental procedure",
    category: "Coverage",
    department: "General Surgery",
    provider: "Dr. Rachel White",
    site: "Medical Center Health System",
    denialDate: "2024-11-02",
    appealDeadline: "2024-12-02",
    daysToAppeal: -5,
    status: "Appeal Deadline Passed" as const,
    assignedReviewer: "Dr. James Brown",
    appealLevel: "None" as const,
    lastAction: "2024-11-10",
    appealed: true,
    appealOutcome: "Upheld",
    recoveredAmount: 0,
  },
  {
    denialId: "DEN-2024-634",
    claimId: "CLM-2024-634",
    patientName: "Brown, Patricia K.",
    serviceDate: "2024-09-15",
    payerName: "Humana",
    deniedAmount: 22800,
    denialReason: "Insufficient documentation",
    category: "Documentation",
    department: "Radiology",
    provider: "Dr. Emily Taylor",
    site: "Hendrick Health",
    denialDate: "2024-09-18",
    appealDeadline: "2024-10-18",
    daysToAppeal: -62,
    status: "Appeal Deadline Passed" as const,
    assignedReviewer: "Dr. David Johnson",
    appealLevel: "None" as const,
    lastAction: "2024-09-25",
    appealed: true,
    appealOutcome: "Overturned",
    recoveredAmount: 22800,
  },
];

// Calculate metrics for a given dataset
const calculateMetrics = (denials: typeof mockDenialData) => {
  const totalDenials = denials.length;
  const totalDeniedAmount = denials.reduce((sum, denial) => sum + denial.deniedAmount, 0);
  const appealedDenials = denials.filter(d => d.appealed).length;
  const overturnedDenials = denials.filter(d => d.appealOutcome === "Overturned").length;
  const totalRecovered = denials.reduce((sum, denial) => sum + denial.recoveredAmount, 0);
  const appealSuccessRate = appealedDenials > 0 ? (overturnedDenials / appealedDenials) * 100 : 0;
  const avgDaysToAppeal = denials.filter(d => d.daysToAppeal > 0).reduce((sum, denial, _, arr) => 
    sum + denial.daysToAppeal / arr.length, 0);

  return {
    totalDenials,
    totalDeniedAmount,
    appealedDenials,
    overturnedDenials,
    totalRecovered,
    appealSuccessRate,
    avgDaysToAppeal: Math.round(avgDaysToAppeal * 10) / 10,
    recoveryRate: totalDeniedAmount > 0 ? (totalRecovered / totalDeniedAmount) * 100 : 0,
  };
};

// Filter denials by time period
const filterByTimePeriod = (denials: typeof mockDenialData, startDate: string, endDate: string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  return denials.filter(denial => {
    const denialDate = parseISO(denial.denialDate);
    return isWithinInterval(denialDate, { start, end });
  });
};

// Filter denials by department
const filterByDepartment = (denials: typeof mockDenialData, department: string) => {
  if (department === "All Departments") return denials;
  return denials.filter(denial => denial.department === department);
};

// Filter denials by site
const filterBySite = (denials: typeof mockDenialData, site: string) => {
  if (site === "All Sites") return denials;
  return denials.filter(denial => denial.site === site);
};

const MetricComparisonCard = ({ title, metric1, metric2, label1, label2, format = "number", icon: Icon }: any) => {
  const value1 = metric1;
  const value2 = metric2;
  const difference = value1 - value2;
  const percentChange = value2 !== 0 ? ((difference / value2) * 100) : 0;
  
  const formatValue = (value: number) => {
    if (format === "currency") {
      return `$${(value / 1000).toFixed(0)}K`;
    } else if (format === "percentage") {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(0);
  };

  const getTrendIcon = () => {
    if (Math.abs(percentChange) < 1) return <Minus className="h-4 w-4 text-gray-500" />;
    return percentChange > 0 ? 
      <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-600" />;
  };

  const getTrendColor = () => {
    if (Math.abs(percentChange) < 1) return "text-gray-500";
    return percentChange > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <Card className="healthcare-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-[#6e53a3]" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          {getTrendIcon()}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="text-xs text-gray-600 mb-1">{label1}</div>
            <div className="text-lg font-bold text-[#6e53a3]">{formatValue(value1)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">{label2}</div>
            <div className="text-lg font-bold text-[#006d9a]">{formatValue(value2)}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Difference:</span>
          <span className={`font-medium ${getTrendColor()}`}>
            {format === "currency" ? (difference >= 0 ? "+" : "") + `$${(difference / 1000).toFixed(0)}K` :
             format === "percentage" ? (difference >= 0 ? "+" : "") + `${difference.toFixed(1)}%` :
             (difference >= 0 ? "+" : "") + difference.toFixed(0)}
            {Math.abs(percentChange) >= 1 && ` (${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(1)}%)`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export function PerformanceComparisonDashboard() {
  const [comparisonType, setComparisonType] = useState<"time" | "department" | "site">("time");
  
  // Time period comparison states
  const [timePeriod1, setTimePeriod1] = useState("current-month");
  const [timePeriod2, setTimePeriod2] = useState("previous-month");
  const [customStart1, setCustomStart1] = useState("");
  const [customEnd1, setCustomEnd1] = useState("");
  const [customStart2, setCustomStart2] = useState("");
  const [customEnd2, setCustomEnd2] = useState("");
  
  // Department comparison states
  const [department1, setDepartment1] = useState("Cardiology");
  const [department2, setDepartment2] = useState("Orthopedics");

  // Site comparison states
  const [site1, setSite1] = useState("Medical Center Health System");
  const [site2, setSite2] = useState("Hendrick Health");

  // Calculate date ranges for predefined periods
  const getDateRange = (period: string) => {
    const now = new Date();
    switch (period) {
      case "current-month":
        return {
          start: format(startOfMonth(now), "yyyy-MM-dd"),
          end: format(endOfMonth(now), "yyyy-MM-dd"),
        };
      case "previous-month":
        const prevMonth = subMonths(now, 1);
        return {
          start: format(startOfMonth(prevMonth), "yyyy-MM-dd"),
          end: format(endOfMonth(prevMonth), "yyyy-MM-dd"),
        };
      case "3-months-ago":
        const threeMonthsAgo = subMonths(now, 3);
        return {
          start: format(startOfMonth(threeMonthsAgo), "yyyy-MM-dd"),
          end: format(endOfMonth(threeMonthsAgo), "yyyy-MM-dd"),
        };
      case "6-months-ago":
        const sixMonthsAgo = subMonths(now, 6);
        return {
          start: format(startOfMonth(sixMonthsAgo), "yyyy-MM-dd"),
          end: format(endOfMonth(sixMonthsAgo), "yyyy-MM-dd"),
        };
      case "custom":
        return { start: customStart1, end: customEnd1 };
      default:
        return {
          start: format(startOfMonth(now), "yyyy-MM-dd"),
          end: format(endOfMonth(now), "yyyy-MM-dd"),
        };
    }
  };

  // Get filtered data and metrics based on comparison type
  const { dataset1, dataset2, metrics1, metrics2, label1, label2 } = useMemo(() => {
    if (comparisonType === "time") {
      const range1 = timePeriod1 === "custom" ? 
        { start: customStart1, end: customEnd1 } : 
        getDateRange(timePeriod1);
      const range2 = timePeriod2 === "custom" ? 
        { start: customStart2, end: customEnd2 } : 
        getDateRange(timePeriod2);
      
      const data1 = filterByTimePeriod(mockDenialData, range1.start, range1.end);
      const data2 = filterByTimePeriod(mockDenialData, range2.start, range2.end);
      
      const periodLabels = {
        "current-month": "Current Month",
        "previous-month": "Previous Month", 
        "3-months-ago": "3 Months Ago",
        "6-months-ago": "6 Months Ago",
        "custom": `Custom (${range1.start} to ${range1.end})`
      };
      
      return {
        dataset1: data1,
        dataset2: data2,
        metrics1: calculateMetrics(data1),
        metrics2: calculateMetrics(data2),
        label1: periodLabels[timePeriod1 as keyof typeof periodLabels] || timePeriod1,
        label2: timePeriod2 === "custom" ? 
          `Custom (${range2.start} to ${range2.end})` : 
          periodLabels[timePeriod2 as keyof typeof periodLabels] || timePeriod2,
      };
    } else if (comparisonType === "department") {
      const data1 = filterByDepartment(mockDenialData, department1);
      const data2 = filterByDepartment(mockDenialData, department2);
      
      return {
        dataset1: data1,
        dataset2: data2,
        metrics1: calculateMetrics(data1),
        metrics2: calculateMetrics(data2),
        label1: department1,
        label2: department2,
      };
    } else {
      // Site comparison
      const data1 = filterBySite(mockDenialData, site1);
      const data2 = filterBySite(mockDenialData, site2);
      
      return {
        dataset1: data1,
        dataset2: data2,
        metrics1: calculateMetrics(data1),
        metrics2: calculateMetrics(data2),
        label1: site1,
        label2: site2,
      };
    }
  }, [comparisonType, timePeriod1, timePeriod2, customStart1, customEnd1, customStart2, customEnd2, department1, department2, site1, site2]);

  // Prepare chart data for side-by-side comparison
  const comparisonChartData = [
    {
      name: "Total Denials",
      [label1]: metrics1.totalDenials,
      [label2]: metrics2.totalDenials,
    },
    {
      name: "Denied Amount ($K)",
      [label1]: Math.round(metrics1.totalDeniedAmount / 1000),
      [label2]: Math.round(metrics2.totalDeniedAmount / 1000),
    },
    {
      name: "Appeals Filed",
      [label1]: metrics1.appealedDenials,
      [label2]: metrics2.appealedDenials,
    },
    {
      name: "Appeals Won",
      [label1]: metrics1.overturnedDenials,
      [label2]: metrics2.overturnedDenials,
    },
    {
      name: "Recovered ($K)",
      [label1]: Math.round(metrics1.totalRecovered / 1000),
      [label2]: Math.round(metrics2.totalRecovered / 1000),
    },
  ];

  const performanceChartData = [
    {
      name: "Appeal Success Rate (%)",
      [label1]: metrics1.appealSuccessRate,
      [label2]: metrics2.appealSuccessRate,
    },
    {
      name: "Recovery Rate (%)",
      [label1]: metrics1.recoveryRate,
      [label2]: metrics2.recoveryRate,
    },
    {
      name: "Avg Days to Appeal",
      [label1]: metrics1.avgDaysToAppeal,
      [label2]: metrics2.avgDaysToAppeal,
    },
  ];

  return (
    <div className="space-y-6" data-testid="performance-comparison-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Comparison</h2>
          <p className="text-gray-600">Compare denial management metrics across time periods, departments, or sites</p>
        </div>
        <Badge variant="outline" className="text-[#6e53a3] border-[#6e53a3]">
          Analytics Tool
        </Badge>
      </div>

      {/* Comparison Type Selection */}
      <Card className="healthcare-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-900">Compare by:</span>
            <div className="flex space-x-2">
              <Button
                variant={comparisonType === "time" ? "default" : "outline"}
                onClick={() => setComparisonType("time")}
                className="data-[state=active]:bg-[#6e53a3] data-[state=active]:text-white"
                data-testid="button-compare-time"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Time Periods
              </Button>
              <Button
                variant={comparisonType === "department" ? "default" : "outline"}
                onClick={() => setComparisonType("department")}
                className="data-[state=active]:bg-[#6e53a3] data-[state=active]:text-white"
                data-testid="button-compare-department"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Departments
              </Button>
              <Button
                variant={comparisonType === "site" ? "default" : "outline"}
                onClick={() => setComparisonType("site")}
                className="data-[state=active]:bg-[#6e53a3] data-[state=active]:text-white"
                data-testid="button-compare-site"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Sites
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Controls */}
      <Card className="healthcare-card">
        <CardContent className="p-4">
          {comparisonType === "time" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Time Period</label>
                <Select value={timePeriod1} onValueChange={setTimePeriod1}>
                  <SelectTrigger data-testid="select-time-period-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="previous-month">Previous Month</SelectItem>
                    <SelectItem value="3-months-ago">3 Months Ago</SelectItem>
                    <SelectItem value="6-months-ago">6 Months Ago</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                {timePeriod1 === "custom" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={customStart1}
                      onChange={(e) => setCustomStart1(e.target.value)}
                      placeholder="Start Date"
                      data-testid="input-custom-start-1"
                    />
                    <Input
                      type="date"
                      value={customEnd1}
                      onChange={(e) => setCustomEnd1(e.target.value)}
                      placeholder="End Date"
                      data-testid="input-custom-end-1"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Second Time Period</label>
                <Select value={timePeriod2} onValueChange={setTimePeriod2}>
                  <SelectTrigger data-testid="select-time-period-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="previous-month">Previous Month</SelectItem>
                    <SelectItem value="3-months-ago">3 Months Ago</SelectItem>
                    <SelectItem value="6-months-ago">6 Months Ago</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                {timePeriod2 === "custom" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={customStart2}
                      onChange={(e) => setCustomStart2(e.target.value)}
                      placeholder="Start Date"
                      data-testid="input-custom-start-2"
                    />
                    <Input
                      type="date"
                      value={customEnd2}
                      onChange={(e) => setCustomEnd2(e.target.value)}
                      placeholder="End Date"
                      data-testid="input-custom-end-2"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : comparisonType === "department" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Department</label>
                <Select value={department1} onValueChange={setDepartment1}>
                  <SelectTrigger data-testid="select-department-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="General Surgery">General Surgery</SelectItem>
                    <SelectItem value="Emergency Department">Emergency Department</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Second Department</label>
                <Select value={department2} onValueChange={setDepartment2}>
                  <SelectTrigger data-testid="select-department-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="General Surgery">General Surgery</SelectItem>
                    <SelectItem value="Emergency Department">Emergency Department</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Site</label>
                <Select value={site1} onValueChange={setSite1}>
                  <SelectTrigger data-testid="select-site-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medical Center Health System" disabled={site2 === "Medical Center Health System"}>Medical Center Health System</SelectItem>
                    <SelectItem value="Hendrick Health" disabled={site2 === "Hendrick Health"}>Hendrick Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Second Site</label>
                <Select value={site2} onValueChange={setSite2}>
                  <SelectTrigger data-testid="select-site-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medical Center Health System" disabled={site1 === "Medical Center Health System"}>Medical Center Health System</SelectItem>
                    <SelectItem value="Hendrick Health" disabled={site1 === "Hendrick Health"}>Hendrick Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricComparisonCard
          title="Total Denials"
          metric1={metrics1.totalDenials}
          metric2={metrics2.totalDenials}
          label1={label1}
          label2={label2}
          icon={AlertTriangle}
        />
        <MetricComparisonCard
          title="Denied Amount"
          metric1={metrics1.totalDeniedAmount}
          metric2={metrics2.totalDeniedAmount}
          label1={label1}
          label2={label2}
          format="currency"
          icon={DollarSign}
        />
        <MetricComparisonCard
          title="Appeal Success Rate"
          metric1={metrics1.appealSuccessRate}
          metric2={metrics2.appealSuccessRate}
          label1={label1}
          label2={label2}
          format="percentage"
          icon={CheckCircle}
        />
        <MetricComparisonCard
          title="Recovery Rate"
          metric1={metrics1.recoveryRate}
          metric2={metrics2.recoveryRate}
          label1={label1}
          label2={label2}
          format="percentage"
          icon={TrendingUp}
        />
        <MetricComparisonCard
          title="Avg Days to Appeal"
          metric1={metrics1.avgDaysToAppeal}
          metric2={metrics2.avgDaysToAppeal}
          label1={label1}
          label2={label2}
          icon={Clock}
        />
        <MetricComparisonCard
          title="Total Recovered"
          metric1={metrics1.totalRecovered}
          metric2={metrics2.totalRecovered}
          label1={label1}
          label2={label2}
          format="currency"
          icon={TrendingUp}
        />
      </div>

      {/* Visual Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Metrics Chart */}
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-[#6e53a3]" />
              <h3 className="text-lg font-semibold text-gray-900">Volume Metrics Comparison</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={label1} fill="#6e53a3" />
                <Bar dataKey={label2} fill="#006d9a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics Chart */}
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <LineChartIcon className="h-5 w-5 text-[#6e53a3]" />
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics Comparison</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={label1} 
                  stroke="#6e53a3" 
                  strokeWidth={3}
                  dot={{ fill: "#6e53a3", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey={label2} 
                  stroke="#006d9a" 
                  strokeWidth={3}
                  dot={{ fill: "#006d9a", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card className="healthcare-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-[#6e53a3]">{label1}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• {metrics1.totalDenials} total denials worth ${(metrics1.totalDeniedAmount / 1000).toFixed(0)}K</p>
                <p>• {metrics1.appealedDenials} appeals filed with {metrics1.appealSuccessRate.toFixed(1)}% success rate</p>
                <p>• ${(metrics1.totalRecovered / 1000).toFixed(0)}K recovered ({metrics1.recoveryRate.toFixed(1)}% of denied amount)</p>
                <p>• Average {metrics1.avgDaysToAppeal} days to file appeals</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-[#006d9a]">{label2}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• {metrics2.totalDenials} total denials worth ${(metrics2.totalDeniedAmount / 1000).toFixed(0)}K</p>
                <p>• {metrics2.appealedDenials} appeals filed with {metrics2.appealSuccessRate.toFixed(1)}% success rate</p>
                <p>• ${(metrics2.totalRecovered / 1000).toFixed(0)}K recovered ({metrics2.recoveryRate.toFixed(1)}% of denied amount)</p>
                <p>• Average {metrics2.avgDaysToAppeal} days to file appeals</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}