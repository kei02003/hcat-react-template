import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, Clock, AlertTriangle, BarChart3, Network } from "lucide-react";
import { ArTrendsChart } from "./charts/ar-trends-chart";
import { PayerMixChart } from "./charts/payer-mix-chart";

const arMetrics = [
  {
    name: "Total AR",
    value: "$8.2M",
    previousValue: "$7.8M",
    changePercentage: "+5.1",
    status: "negative" as const,
    target: "$7.5M"
  },
  {
    name: "AR > 90 Days",
    value: "$2.1M",
    previousValue: "$1.8M", 
    changePercentage: "+16.7",
    status: "negative" as const,
    target: "$1.5M"
  },
  {
    name: "Days Sales Outstanding",
    value: "47.8",
    previousValue: "44.2",
    changePercentage: "+8.1",
    status: "negative" as const,
    target: "40.0"
  },
  {
    name: "Collection Rate",
    value: "94.2%",
    previousValue: "95.1%",
    changePercentage: "-0.9",
    status: "negative" as const,
    target: "96.0%"
  },
  {
    name: "Net Collection Rate",
    value: "96.8%",
    previousValue: "97.2%",
    changePercentage: "-0.4",
    status: "negative" as const,
    target: "98.0%"
  },
  {
    name: "Charge Lag Days",
    value: "3.2",
    previousValue: "2.8",
    changePercentage: "+14.3",
    status: "negative" as const,
    target: "2.0"
  }
];

const arAgingData = [
  { category: "0-30 days", amount: 3200000, percentage: 39.0, accounts: 5680, color: "#16A34A" },
  { category: "31-60 days", amount: 1850000, percentage: 22.6, accounts: 3420, color: "#D97706" },
  { category: "61-90 days", amount: 1250000, percentage: 15.2, accounts: 2890, color: "#EA580C" },
  { category: "90+ days", amount: 1900000, percentage: 23.2, accounts: 2500, color: "#DC2626" }
];

const financialTrendsData = [
  { month: "Jan 2024", netCollections: 1250000, grossCharges: 1580000, adjustments: 180000, dso: 45.2 },
  { month: "Feb 2024", netCollections: 1180000, grossCharges: 1620000, adjustments: 195000, dso: 46.8 },
  { month: "Mar 2024", netCollections: 1320000, grossCharges: 1650000, adjustments: 168000, dso: 44.1 },
  { month: "Apr 2024", netCollections: 1290000, grossCharges: 1680000, adjustments: 185000, dso: 47.3 },
  { month: "May 2024", netCollections: 1410000, grossCharges: 1720000, adjustments: 172000, dso: 46.9 },
  { month: "Jun 2024", netCollections: 1360000, grossCharges: 1750000, adjustments: 190000, dso: 48.1 }
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

export function ArManagementDashboard() {
  const [selectedMeasure, setSelectedMeasure] = useState("AR 90+");
  const [activeTab, setActiveTab] = useState("trends");

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">AR Management</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/epic-architecture">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 text-sm"
                data-testid="button-epic-architecture"
              >
                <Network className="h-4 w-4" />
                <span>Epic Integration Architecture</span>
              </Button>
            </Link>
            <Button variant="outline" data-testid="button-export-ar">
              Export Report
            </Button>
          </div>
        </div>

        {/* Key AR Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {arMetrics.map((metric, index) => (
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
            <TabsTrigger value="trends">
              AR Trends
            </TabsTrigger>
            <TabsTrigger value="aging">
              AR Aging
            </TabsTrigger>
            <TabsTrigger value="financial">
              Financial Trends
            </TabsTrigger>
          </TabsList>

          {/* AR Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    AR 90+ SPC I-chart with changepoint detection
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Select measure:</label>
                      <Select value={selectedMeasure} onValueChange={setSelectedMeasure}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AR 90+">AR 90+</SelectItem>
                          <SelectItem value="AR 60+">AR 60+</SelectItem>
                          <SelectItem value="AR 120+">AR 120+</SelectItem>
                          <SelectItem value="Total AR">Total AR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <ArTrendsChart />
              </CardContent>
            </Card>

            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payer Mix by Financial Class
                </h3>
                <PayerMixChart />
              </CardContent>
            </Card>
          </TabsContent>

          {/* AR Aging Tab */}
          <TabsContent value="aging" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    AR Aging Distribution
                  </h3>
                  <div className="space-y-4">
                    {arAgingData.map((age, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{age.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold">
                              ${(age.amount / 1000000).toFixed(1)}M
                            </span>
                            <Badge 
                              className="text-white"
                              style={{ backgroundColor: age.color }}
                            >
                              {age.percentage}%
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${age.percentage}%`,
                              backgroundColor: age.color 
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {age.accounts.toLocaleString()} accounts
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    AR Aging Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-red-800">Critical Issues</span>
                      </div>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• 23.2% of AR is over 90 days ($1.9M)</li>
                        <li>• 38.4% of AR is over 60 days ($3.15M)</li>
                        <li>• Significant increase since July 2023</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Recommendations</span>
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Focus collection efforts on 90+ day accounts</li>
                        <li>• Implement automated follow-up for 60+ days</li>
                        <li>• Review denial management processes</li>
                        <li>• Analyze payer-specific AR patterns</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Performance Metrics</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-blue-600 font-medium">Average Age</p>
                          <p className="text-blue-900 font-bold">52.4 days</p>
                        </div>
                        <div>
                          <p className="text-blue-600 font-medium">Collection Priority</p>
                          <p className="text-blue-900 font-bold">2,500 accounts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Trends Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Monthly Financial Performance
                  </h3>
                  <div className="space-y-4">
                    {financialTrendsData.map((month, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{month.month}</span>
                          <span className="text-sm text-gray-600">
                            DSO: {month.dso} days
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Net Collections</p>
                            <p className="font-semibold text-green-600">
                              ${(month.netCollections / 1000000).toFixed(2)}M
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Gross Charges</p>
                            <p className="font-semibold">
                              ${(month.grossCharges / 1000000).toFixed(2)}M
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Adjustments</p>
                            <p className="font-semibold text-red-600">
                              ${(month.adjustments / 1000).toFixed(0)}K
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="healthcare-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Financial Indicators
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">YTD Net Collection Rate</span>
                        <span className="font-bold text-green-600">96.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="w-[97%] bg-green-500 h-2 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Gross Collection Rate</span>
                        <span className="font-bold text-blue-600">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="w-[94%] bg-blue-500 h-2 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Adjustment Rate</span>
                        <span className="font-bold text-orange-600">10.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="w-[11%] bg-orange-500 h-2 rounded-full" />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-gray-900">Trending Analysis</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• DSO trending upward (+8.1% vs target)</li>
                        <li>• Net collections stable at 96.8%</li>
                        <li>• Adjustment rates within normal range</li>
                        <li>• Focus needed on AR aging improvement</li>
                      </ul>
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