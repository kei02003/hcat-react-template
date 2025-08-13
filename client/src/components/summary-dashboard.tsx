import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Users,
  Calendar,
  Target,
  Activity,
  HeartHandshake,
  Shield,
  Brain,
  Zap,
} from "lucide-react";

interface SummaryMetrics {
  totalRevenue: string;
  revenueChange: number;
  denialRate: number;
  denialChange: number;
  appealSuccessRate: number;
  appealChange: number;
  arDays: number;
  arChange: number;
  timelyFilingRate: number;
  timelyFilingChange: number;
}

interface QuickStats {
  activeDenials: number;
  pendingAppeals: number;
  criticalClaims: number;
  overdueFilings: number;
}

interface RecentActivity {
  id: string;
  type: "denial" | "appeal" | "filing" | "collection";
  message: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  status: "completed" | "pending" | "overdue";
}

export function SummaryDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Fetch summary metrics
  const { data: metrics } = useQuery({
    queryKey: ["/api/summary-metrics", selectedPeriod],
    queryFn: async () => {
      const response = await fetch(
        `/api/summary-metrics?period=${selectedPeriod}`,
      );
      if (!response.ok) throw new Error("Failed to fetch summary metrics");
      return response.json();
    },
  });

  // Fetch recent activity
  const { data: activities = [] } = useQuery({
    queryKey: ["/api/recent-activity"],
    queryFn: async () => {
      const response = await fetch("/api/recent-activity");
      if (!response.ok) throw new Error("Failed to fetch recent activity");
      return response.json();
    },
  });

  const mockMetrics: SummaryMetrics = {
    totalRevenue: "$2.4M",
    revenueChange: 8.2,
    denialRate: 12.3,
    denialChange: -2.1,
    appealSuccessRate: 87.5,
    appealChange: 5.3,
    arDays: 42.1,
    arChange: -3.4,
    timelyFilingRate: 94.7,
    timelyFilingChange: 2.8,
  };

  const mockQuickStats: QuickStats = {
    activeDenials: 34,
    pendingAppeals: 12,
    criticalClaims: 8,
    overdueFilings: 3,
  };

  const mockActivities: RecentActivity[] = [
    {
      id: "1",
      type: "appeal",
      message: "Elena Martinez appeal approved - $12,450 recovered",
      timestamp: "2025-01-08 14:30",
      priority: "high",
      status: "completed",
    },
    {
      id: "2",
      type: "denial",
      message: "New denial received: Johnson, Michael R. - Medical necessity",
      timestamp: "2025-01-08 13:15",
      priority: "medium",
      status: "pending",
    },
    {
      id: "3",
      type: "filing",
      message: "Critical: Thompson, Robert K. filing deadline in 5 days",
      timestamp: "2025-01-08 12:45",
      priority: "high",
      status: "overdue",
    },
    {
      id: "4",
      type: "collection",
      message: "Payment received: $8,750 - Wilson, Sarah M.",
      timestamp: "2025-01-08 11:20",
      priority: "low",
      status: "completed",
    },
  ];

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (change: number, isReverse = false) => {
    const positive = isReverse ? change < 0 : change > 0;
    return positive ? "text-green-600" : "text-red-600";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "denial":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "appeal":
        return <HeartHandshake className="h-4 w-4 text-blue-500" />;
      case "filing":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "collection":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Summary</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your organization's revenue cycle
            performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("7d")}
          >
            7 Days
          </Button>
          <Button
            variant={selectedPeriod === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("30d")}
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("90d")}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalRevenue}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(mockMetrics.revenueChange)}
              <span className={getTrendColor(mockMetrics.revenueChange)}>
                {mockMetrics.revenueChange > 0 ? "+" : ""}
                {mockMetrics.revenueChange}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denial Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.denialRate}%</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(mockMetrics.denialChange)}
              <span className={getTrendColor(mockMetrics.denialChange, true)}>
                {mockMetrics.denialChange > 0 ? "+" : ""}
                {mockMetrics.denialChange}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appeal Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMetrics.appealSuccessRate}%
            </div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(mockMetrics.appealChange)}
              <span className={getTrendColor(mockMetrics.appealChange)}>
                {mockMetrics.appealChange > 0 ? "+" : ""}
                {mockMetrics.appealChange}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AR Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.arDays}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(mockMetrics.arChange)}
              <span className={getTrendColor(mockMetrics.arChange, true)}>
                {mockMetrics.arChange > 0 ? "+" : ""}
                {mockMetrics.arChange}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timely Filing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMetrics.timelyFilingRate}%
            </div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(mockMetrics.timelyFilingChange)}
              <span className={getTrendColor(mockMetrics.timelyFilingChange)}>
                {mockMetrics.timelyFilingChange > 0 ? "+" : ""}
                {mockMetrics.timelyFilingChange}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Current items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Denials</span>
              <Badge variant="destructive">
                {mockQuickStats.activeDenials}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pending Appeals</span>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {mockQuickStats.pendingAppeals}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Critical Claims</span>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">
                {mockQuickStats.criticalClaims}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overdue Filings</span>
              <Badge variant="destructive">
                {mockQuickStats.overdueFilings}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across all modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {activity.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </p>
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  </div>
                  {index < mockActivities.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Module Performance</CardTitle>
          <CardDescription>
            Performance indicators for each system module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clinical Denials</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Review completion rate
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Appeal Generation</span>
                <span className="font-medium">91%</span>
              </div>
              <Progress value={91} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Success rate for appeals &gt;70% probability
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Timely Filing</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Claims filed within deadline
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pre-Authorization</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Completion 3+ days before procedure
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
