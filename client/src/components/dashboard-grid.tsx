import { useState, useEffect } from "react";
import { Plus, Settings, Filter, Download, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MetricPicker } from "./metric-picker";
import { DynamicMetricCard } from "./dynamic-metric-card";

interface DashboardGridProps {
  title?: string;
  subtitle?: string;
  allowCustomization?: boolean;
  defaultMetrics?: string[];
  maxMetrics?: number;
  showGlobalFilters?: boolean;
  className?: string;
}

interface GlobalFilters {
  entityId: string;
  dateRange: string;
  showTrends: boolean;
}

const STORAGE_KEY = "healthcare-dashboard-config";

interface DashboardConfig {
  selectedMetrics: string[];
  globalFilters: GlobalFilters;
  gridLayout: "compact" | "comfortable" | "spacious";
}

export function DashboardGrid({
  title = "Custom Dashboard",
  subtitle = "Configure your personalized healthcare metrics dashboard",
  allowCustomization = true,
  defaultMetrics = [],
  maxMetrics = 12,
  showGlobalFilters = true,
  className = ""
}: DashboardGridProps) {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          selectedMetrics: parsed.selectedMetrics ?? defaultMetrics,
          globalFilters: {
            entityId: parsed.globalFilters?.entityId ?? 'all',
            dateRange: parsed.globalFilters?.dateRange ?? '30d',
            showTrends: Boolean(parsed.globalFilters?.showTrends),
          },
          gridLayout: parsed.gridLayout ?? 'comfortable',
        } as DashboardConfig;
      }
    } catch (error) {
      console.warn("Failed to parse saved dashboard config:", error);
    }
    return {
      selectedMetrics: defaultMetrics,
      globalFilters: { entityId: 'all', dateRange: '30d', showTrends: false },
      gridLayout: 'comfortable',
    } as DashboardConfig;
  });
  const [showMetricPicker, setShowMetricPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const handleMetricsChange = (selectedMetrics: string[]) => {
    setConfig(prev => ({ ...prev, selectedMetrics }));
  };

  const handleRemoveMetric = (metricVersionKey: string) => {
    setConfig(prev => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.filter(key => key !== metricVersionKey)
    }));
  };

  const handleGlobalFilterChange = (key: keyof GlobalFilters, value: any) => {
    setConfig(prev => ({
      ...prev,
      globalFilters: {
        ...prev.globalFilters,
        [key]: value
      }
    }));
  };

  const resetDashboard = () => {
    setConfig({
      selectedMetrics: defaultMetrics,
      globalFilters: {
        entityId: "all",
        dateRange: "30d",
        showTrends: false
      },
      gridLayout: "comfortable"
    } as DashboardConfig);
  };

  const exportConfiguration = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getGridClasses = () => {
    const baseClasses = "grid gap-4 w-full";
    switch (config.gridLayout) {
      case "compact":
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6`;
      case "comfortable":
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      case "spacious":
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
    }
  };

  return (
    <div className={`space-y-6 ${className}`} data-testid="dashboard-grid">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" data-testid="metrics-count">
            {config.selectedMetrics.length} / {maxMetrics} metrics
          </Badge>
          
          {allowCustomization && (
            <>
              <Dialog open={showMetricPicker} onOpenChange={setShowMetricPicker}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-add-metrics">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Metrics
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Select Metrics for Dashboard</DialogTitle>
                  </DialogHeader>
                  <MetricPicker
                    selectedMetrics={config.selectedMetrics}
                    onMetricsChange={handleMetricsChange}
                    maxSelections={maxMetrics}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-dashboard-settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dashboard Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Grid Layout</label>
                      <Select 
                        value={config.gridLayout} 
                        onValueChange={(value: "compact" | "comfortable" | "spacious") => 
                          setConfig(prev => ({ ...prev, gridLayout: value }))
                        }
                      >
                        <SelectTrigger data-testid="select-grid-layout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact (6 columns)</SelectItem>
                          <SelectItem value="comfortable">Comfortable (4 columns)</SelectItem>
                          <SelectItem value="spacious">Spacious (3 columns)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={exportConfiguration}
                        data-testid="button-export-config"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Config
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetDashboard}
                        data-testid="button-reset-dashboard"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Global Filters */}
      {showGlobalFilters && (
        <Card data-testid="global-filters">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Global Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Entity</label>
                <Select 
                  value={config.globalFilters.entityId} 
                  onValueChange={(value) => handleGlobalFilterChange("entityId", value)}
                >
                  <SelectTrigger data-testid="select-entity-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="ENT-HC001-001">Medical Center</SelectItem>
                    <SelectItem value="ENT-HC001-002">Surgery Center</SelectItem>
                    <SelectItem value="ENT-HC001-003">Outpatient Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Select 
                  value={config.globalFilters.dateRange} 
                  onValueChange={(value) => handleGlobalFilterChange("dateRange", value)}
                >
                  <SelectTrigger data-testid="select-date-range-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Show Trends</label>
                <Select 
                  value={config.globalFilters.showTrends ? "true" : "false"} 
                  onValueChange={(value: "true" | "false") => handleGlobalFilterChange("showTrends", value === "true")}
                >
                  <SelectTrigger data-testid="select-trends-toggle">
                    <SelectValue placeholder="Values Only" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Values Only</SelectItem>
                    <SelectItem value="true">With Trends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      {config.selectedMetrics.length > 0 ? (
        <div className={getGridClasses()} data-testid="metrics-grid">
          {config.selectedMetrics.map((metricVersionKey) => (
            <DynamicMetricCard
              key={metricVersionKey}
              metricVersionKey={metricVersionKey}
              entityId={config.globalFilters.entityId !== "all" ? config.globalFilters.entityId : undefined}
              showTrend={config.globalFilters.showTrends}
              onRemove={allowCustomization ? () => handleRemoveMetric(metricVersionKey) : undefined}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300" data-testid="empty-dashboard">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-700">No metrics selected</h3>
              <p className="text-gray-500 mt-1">
                Choose metrics from the catalog to build your personalized dashboard
              </p>
            </div>
            
            {allowCustomization && (
              <Button
                onClick={() => setShowMetricPicker(true)}
                className="mt-4"
                data-testid="button-add-first-metrics"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Metrics
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      {config.selectedMetrics.length > 0 && (
        <div className="text-xs text-gray-500 text-center" data-testid="dashboard-footer">
          <p>
            Dashboard automatically saves your configuration. 
            {allowCustomization && " Use settings to export or reset your layout."}
          </p>
        </div>
      )}
    </div>
  );
}