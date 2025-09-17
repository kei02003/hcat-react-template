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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  DollarSign,
  Target,
  Clock,
  BarChart3,
  PieChart,
  Users,
  AlertCircle,
  CheckCircle,
  ArrowUpDown,
} from "lucide-react";

interface PayerAnalysis {
  payerId: string;
  payerName: string;
  payerType: string;
  totalClaims: number;
  appealOpportunities: {
    totalDenials: number;
    appealableCount: number;
    appealRate: number;
    averageAppealValue: number;
    totalAppealValue: number;
    highProbabilityAppeals: number;
    estimatedRecovery: number;
    roi: number;
  };
  redundantRequestOpportunities: {
    totalRequests: number;
    redundantCount: number;
    redundancyRate: number;
    totalWastedCost: number;
    estimatedSavings: number;
    implementationCost: number;
    paybackPeriod: number;
  };
  performanceMetrics: {
    denialTrend: number;
    appealSuccessTrend: number;
    redundancyTrend: number;
    averageResolutionTime: number;
  };
}

interface FeasibilityMetrics {
  totalAnalysis: any;
  financialImpact: any;
  operationalImpact: any;
  payerComparison: any;
  recommendedPrioritization: any[];
}

export function FeasibilityDashboard() {
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null);

  // Fetch feasibility analysis data
  const { data: analysisData, isLoading } = useQuery({
    queryKey: ["/api/feasibility-analysis"],
  });

  const payerAnalysis: PayerAnalysis[] = analysisData?.payerAnalysis || [];
  const feasibilityMetrics: FeasibilityMetrics =
    analysisData?.feasibilityMetrics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend < 0) {
      return (
        <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
      );
    } else {
      return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: number) => {
    const colors = [
      "",
      "bg-red-100 text-red-800",
      "bg-orange-100 text-orange-800",
      "bg-yellow-100 text-yellow-800",
      "bg-blue-100 text-blue-800",
      "bg-gray-100 text-gray-800",
    ];
    const labels = ["", "High", "High", "Medium", "Medium", "Low"];
    return (
      <Badge className={colors[priority]}>{labels[priority]} Priority</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Opportunities</h2>
        <p className="text-muted-foreground">
          Comprehensive analysis of appeal opportunities and redundant request
          optimization by payer
        </p>
      </div>

      {/* Overview Metrics */}
      {feasibilityMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Financial Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  feasibilityMetrics.financialImpact.netFinancialBenefit,
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recovery potential minus implementation costs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Appeal Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {feasibilityMetrics.totalAnalysis.totalAppealOpportunities.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {feasibilityMetrics.totalAnalysis.totalPayers} major
                payers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Redundant Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {feasibilityMetrics.totalAnalysis.totalRedundantRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(
                  feasibilityMetrics.totalAnalysis.overallRedundancyRate,
                )}{" "}
                redundancy rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#6e53a3]">
                {feasibilityMetrics.financialImpact.overallROI.toLocaleString()}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Return on automation investment
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="by-payer" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-payer">Analysis by Payer</TabsTrigger>
          <TabsTrigger value="prioritization">
            Implementation Priority
          </TabsTrigger>
          <TabsTrigger value="comparison">Payer Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="by-payer" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {payerAnalysis.map((payer: PayerAnalysis) => (
              <Card
                key={payer.payerId}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{payer.payerName}</CardTitle>
                    <Badge variant="outline">{payer.payerType}</Badge>
                  </div>
                  <CardDescription>
                    {payer.totalClaims.toLocaleString()} total claims analyzed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Appeal Opportunities */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Appeal Opportunities
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {payer.appealOpportunities.appealableCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatPercentage(payer.appealOpportunities.appealRate)}{" "}
                      of denials appealable
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {formatCurrency(
                        payer.appealOpportunities.estimatedRecovery,
                      )}{" "}
                      potential recovery
                    </div>
                    <Progress
                      value={payer.appealOpportunities.appealRate}
                      className="h-2"
                    />
                  </div>

                  {/* Redundant Requests */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Redundant Requests
                      </span>
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {payer.redundantRequestOpportunities.redundantCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatPercentage(
                        payer.redundantRequestOpportunities.redundancyRate,
                      )}{" "}
                      redundancy rate
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {formatCurrency(
                        payer.redundantRequestOpportunities.automationPotential
                          .estimatedSavings,
                      )}{" "}
                      potential savings
                    </div>
                    <Progress
                      value={payer.redundantRequestOpportunities.redundancyRate}
                      className="h-2"
                    />
                  </div>

                  {/* Performance Trends */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(payer.performanceMetrics.denialTrend)}
                        <span className="text-sm font-medium">Denials</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPercentage(
                          Math.abs(payer.performanceMetrics.denialTrend),
                        )}
                        {payer.performanceMetrics.denialTrend < 0
                          ? " decrease"
                          : " increase"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-[#6e53a3]/80" />
                        <span className="text-sm font-medium">Resolution</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payer.performanceMetrics.averageResolutionTime} days
                        avg
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setSelectedPayer(payer.payerId)}
                    data-testid={`button-view-payer-${payer.payerId}`}
                  >
                    View Detailed Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prioritization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Priority Recommendations</CardTitle>
              <CardDescription>
                Payers ranked by implementation priority based on ROI,
                complexity, and potential impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              {feasibilityMetrics?.recommendedPrioritization && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Payer</TableHead>
                      <TableHead>Estimated Impact</TableHead>
                      <TableHead>Key Metrics</TableHead>
                      <TableHead>Implementation Reasoning</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feasibilityMetrics.recommendedPrioritization.map(
                      (item: any) => {
                        const payerData = payerAnalysis.find(
                          (p) => p.payerName === item.payer,
                        );
                        return (
                          <TableRow key={item.payer}>
                            <TableCell>
                              {getPriorityBadge(item.priority)}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>
                                <div>{item.payer}</div>
                                {payerData && (
                                  <div className="text-sm text-muted-foreground">
                                    {payerData.totalClaims.toLocaleString()}{" "}
                                    claims
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-green-600 font-medium">
                                {formatCurrency(item.estimatedImpact)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {payerData && (
                                <div className="space-y-1">
                                  <div className="text-sm">
                                    Appeal Rate:{" "}
                                    {formatPercentage(
                                      payerData.appealOpportunities.appealRate,
                                    )}
                                  </div>
                                  <div className="text-sm">
                                    ROI:{" "}
                                    {formatPercentage(
                                      payerData.appealOpportunities.roi,
                                    )}
                                  </div>
                                  <div className="text-sm">
                                    Redundancy:{" "}
                                    {formatPercentage(
                                      payerData.redundantRequestOpportunities
                                        .redundancyRate,
                                    )}
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="text-sm">{item.reasoning}</div>
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appeal Opportunity Comparison</CardTitle>
                <CardDescription>
                  Appeal rates and recovery potential by payer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payer</TableHead>
                      <TableHead>Appeal Rate</TableHead>
                      <TableHead>Recovery Potential</TableHead>
                      <TableHead>ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payerAnalysis
                      .sort(
                        (a, b) =>
                          b.appealOpportunities.appealRate -
                          a.appealOpportunities.appealRate,
                      )
                      .map((payer: PayerAnalysis) => (
                        <TableRow key={payer.payerId}>
                          <TableCell className="font-medium">
                            {payer.payerName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={payer.appealOpportunities.appealRate}
                                className="h-2 flex-1"
                              />
                              <span className="text-sm">
                                {formatPercentage(
                                  payer.appealOpportunities.appealRate,
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {formatCurrency(
                              payer.appealOpportunities.estimatedRecovery,
                            )}
                          </TableCell>
                          <TableCell className="text-primary font-medium">
                            {formatPercentage(payer.appealOpportunities.roi)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redundancy Optimization Potential</CardTitle>
                <CardDescription>
                  Cost savings opportunities from automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payer</TableHead>
                      <TableHead>Redundancy Rate</TableHead>
                      <TableHead>Savings Potential</TableHead>
                      <TableHead>Payback Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payerAnalysis
                      .sort(
                        (a, b) =>
                          b.redundantRequestOpportunities.redundancyRate -
                          a.redundantRequestOpportunities.redundancyRate,
                      )
                      .map((payer: PayerAnalysis) => (
                        <TableRow key={payer.payerId}>
                          <TableCell className="font-medium">
                            {payer.payerName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={
                                  payer.redundantRequestOpportunities
                                    .redundancyRate
                                }
                                className="h-2 flex-1"
                              />
                              <span className="text-sm">
                                {formatPercentage(
                                  payer.redundantRequestOpportunities
                                    .redundancyRate,
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {formatCurrency(
                              payer.redundantRequestOpportunities
                                .automationPotential.estimatedSavings,
                            )}
                          </TableCell>
                          <TableCell className="text-[#6e53a3] font-medium">
                            {
                              payer.redundantRequestOpportunities
                                .automationPotential.paybackPeriod
                            }{" "}
                            months
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
