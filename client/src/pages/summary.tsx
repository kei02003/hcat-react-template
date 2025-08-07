import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthcareNavbar } from "@/components/healthcare-navbar";
import { HealthcareSidebar } from "@/components/healthcare-sidebar";
import { MetricsPanel } from "@/components/metrics-panel";
// Temporary inline chart components - will be moved to separate files
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from "recharts";
import { Activity, TrendingUp, AlertTriangle, Target, BarChart3, LineChart as LineChartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MetricData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  icon: any;
}

const summaryMetrics: MetricData[] = [
  {
    id: "denial-rate",
    title: "Denial Rate",
    value: "8.2%",
    change: "-2.1%",
    trend: "down",
    status: "good",
    icon: Activity
  },
  {
    id: "ar-days",
    title: "AR Days",
    value: "42.3",
    change: "+1.8",
    trend: "up",
    status: "warning",
    icon: TrendingUp
  },
  {
    id: "appeal-success",
    title: "Appeal Success",
    value: "87.4%",
    change: "+5.2%",
    trend: "up",
    status: "good",
    icon: Target
  },
  {
    id: "timely-filing",
    title: "Timely Filing Risk",
    value: "12 claims",
    change: "-3",
    trend: "down",
    status: "warning",
    icon: AlertTriangle
  },
  {
    id: "revenue-cycle",
    title: "Revenue Cycle",
    value: "$2.1M",
    change: "+8.3%",
    trend: "up",
    status: "good",
    icon: BarChart3
  },
  {
    id: "productivity",
    title: "Staff Productivity",
    value: "94.7%",
    change: "+2.1%",
    trend: "up",
    status: "good",
    icon: LineChartIcon
  }
];

const forestPlotDimensions = [
  { id: "patient-type", label: "Patient Type" },
  { id: "discharge-location", label: "Discharge Location" },
  { id: "payer-type", label: "Payer Type" },
  { id: "department", label: "Department" },
  { id: "procedure-type", label: "Procedure Type" },
  { id: "severity-level", label: "Severity Level" }
];

// Temporary inline SPC Chart component
const SPCTimeSeriesChart = ({ data, metric, title }: { data: any, metric: string, title: string }) => {
  // Generate mock SPC data if none provided
  const mockData = data || Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 8.2 + Math.sin(i / 5) * 2 + (Math.random() - 0.5) * 1.5,
    ucl: 12.5,
    lcl: 3.9,
    centerLine: 8.2,
    isViolation: Math.random() < 0.1,
    isChangepoint: i === 15
  }));

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">SPC Analysis - {title}</h3>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p>UCL: {mockData[0]?.ucl?.toFixed(2) || '12.5'} | Center: {mockData[0]?.centerLine?.toFixed(2) || '8.2'} | LCL: {mockData[0]?.lcl?.toFixed(2) || '3.9'}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <ReferenceLine y={mockData[0]?.ucl || 12.5} stroke="red" strokeDasharray="5 5" label="UCL" />
          <ReferenceLine y={mockData[0]?.centerLine || 8.2} stroke="gray" strokeDasharray="2 2" label="Center" />
          <ReferenceLine y={mockData[0]?.lcl || 3.9} stroke="red" strokeDasharray="5 5" label="LCL" />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} 
            dot={(props: any) => {
              const { payload } = props;
              return <circle {...props} fill={payload?.isViolation ? "#ef4444" : payload?.isChangepoint ? "#8b5cf6" : "#2563eb"} r={payload?.isViolation || payload?.isChangepoint ? 6 : 3} />;
            }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Temporary inline Forest Plot component
const ForestPlotChart = ({ data, dimension, title }: { data: any, dimension: string, title: string }) => {
  const mockData = data || [
    { category: 'Category A', value: 25.4, lowerCI: 18.2, upperCI: 32.6, forecast: 28.1, riskLevel: 'medium' },
    { category: 'Category B', value: 31.8, lowerCI: 24.1, upperCI: 39.5, forecast: 29.3, riskLevel: 'high' },
    { category: 'Category C', value: 19.2, lowerCI: 12.8, upperCI: 25.6, forecast: 22.7, riskLevel: 'low' },
    { category: 'Category D', value: 42.1, lowerCI: 35.9, upperCI: 48.3, forecast: 38.4, riskLevel: 'high' },
    { category: 'Category E', value: 16.5, lowerCI: 11.2, upperCI: 21.8, forecast: 18.9, riskLevel: 'low' },
    { category: 'Category F', value: 28.7, lowerCI: 22.3, upperCI: 35.1, forecast: 31.2, riskLevel: 'medium' }
  ];

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Forest Plot - {title}</h3>
        <div className="flex gap-2 text-xs">
          <Badge variant="outline">Current Values</Badge>
          <Badge variant="secondary">Forecast</Badge>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart layout="horizontal" data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" width={80} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value: any, name: string) => [value, name === 'value' ? 'Current' : 'Forecast']} />
          <Bar dataKey="value" fill="#3b82f6" name="Current">
            {mockData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={
                entry.riskLevel === 'high' ? '#ef4444' :
                entry.riskLevel === 'medium' ? '#f97316' : '#3b82f6'
              } />
            ))}
          </Bar>
          <Bar dataKey="forecast" fill="#10b981" opacity={0.7} name="Forecast" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Low Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded opacity-70"></div>
          <span>Forecast</span>
        </div>
      </div>
    </div>
  );
};

export default function Summary() {
  const [selectedMetric, setSelectedMetric] = useState("denial-rate");
  const [selectedDimension, setSelectedDimension] = useState("patient-type");

  // Query for SPC data based on selected metric
  const { data: spcData, isLoading: spcLoading } = useQuery({
    queryKey: ["/api/summary/spc", selectedMetric],
    enabled: !!selectedMetric
  });

  // Query for forest plot data based on selected dimension
  const { data: forestData, isLoading: forestLoading } = useQuery({
    queryKey: ["/api/summary/forest-plot", selectedDimension],
    enabled: !!selectedDimension
  });

  const handleMetricClick = (metricId: string) => {
    setSelectedMetric(metricId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <HealthcareNavbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <HealthcareSidebar open={true} onItemClick={() => {}} />
        <main className="flex-1 flex gap-6 p-6 overflow-auto">
          {/* Left Panel - Interactive Metrics */}
          <div className="w-80 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Key Performance Metrics
                </CardTitle>
                <CardDescription>
                  Click metrics to update the SPC chart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {summaryMetrics.map((metric) => {
                  const Icon = metric.icon;
                  const isSelected = selectedMetric === metric.id;
                  
                  return (
                    <Button
                      key={metric.id}
                      variant={isSelected ? "default" : "ghost"}
                      className={`w-full p-4 h-auto justify-start ${
                        isSelected ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => handleMetricClick(metric.id)}
                      data-testid={`metric-${metric.id}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-md ${
                            metric.status === 'good' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                            metric.status === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">{metric.title}</p>
                            <p className="text-lg font-bold">{metric.value}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={metric.trend === 'up' ? 
                              (metric.status === 'good' ? 'default' : 'destructive') : 
                              (metric.status === 'good' ? 'default' : 'secondary')
                            }
                            className="text-xs"
                          >
                            {metric.change}
                          </Badge>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Charts */}
          <div className="flex-1 flex flex-col gap-6">
            {/* SPC Time Series Chart */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Statistical Process Control Analysis
                </CardTitle>
                <CardDescription>
                  Time-series with changepoint detection, control limits, and violation indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {spcLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <SPCTimeSeriesChart 
                    data={spcData} 
                    metric={selectedMetric}
                    title={summaryMetrics.find(m => m.id === selectedMetric)?.title || ""}
                  />
                )}
              </CardContent>
            </Card>

            {/* Forest Plot with Forecast */}
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Forest Plot Analysis with Forecast
                  </CardTitle>
                  <CardDescription>
                    Comparative analysis by dimensions with predictive modeling
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select 
                    value={selectedDimension} 
                    onValueChange={setSelectedDimension}
                  >
                    <SelectTrigger className="w-[180px]" data-testid="dimension-selector">
                      <SelectValue placeholder="Select dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      {forestPlotDimensions.map((dimension) => (
                        <SelectItem 
                          key={dimension.id} 
                          value={dimension.id}
                          data-testid={`dimension-${dimension.id}`}
                        >
                          {dimension.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                {forestLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ForestPlotChart 
                    data={forestData}
                    dimension={selectedDimension}
                    title={forestPlotDimensions.find(d => d.id === selectedDimension)?.label || ""}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}