import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { CanonicalResult, CanonicalMetricVersion } from "@shared/schema";

interface MetricCardProps {
  metricVersionKey: string;
  entityId?: string;
  showTrend?: boolean;
  className?: string;
  onRemove?: () => void;
}

interface MetricSummary {
  metricVersion: CanonicalMetricVersion;
  latestResult: CanonicalResult | null;
  trendData: CanonicalResult[];
}

export function DynamicMetricCard({ 
  metricVersionKey, 
  entityId, 
  showTrend = false,
  className = "",
  onRemove 
}: MetricCardProps) {
  // Fetch metric version details
  const { data: metricVersions = [] } = useQuery<CanonicalMetricVersion[]>({
    queryKey: ["/api/canonical-metric-versions/active"],
  });

  // Fetch latest result for this metric
  const { data: latestResults = [], isLoading: isLoadingLatest } = useQuery<CanonicalResult[]>({
    queryKey: ["/api/canonical-results/latest", metricVersionKey, entityId || "default"],
    queryFn: async () => {
      const url = `/api/canonical-results/latest/${metricVersionKey}${entityId ? `?entityId=${entityId}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch latest results");
      return response.json();
    },
    enabled: !!metricVersionKey,
    staleTime: 30000, // Keep data fresh for 30 seconds
    gcTime: 300000 // Cache for 5 minutes
  });

  // Fetch trend data if requested
  const { data: trendResults = [] } = useQuery<CanonicalResult[]>({
    queryKey: ["/api/canonical-results", metricVersionKey, entityId || "default"],
    queryFn: async () => {
      const params = new URLSearchParams({ metricVersionKey });
      if (entityId) params.append("entityId", entityId);
      
      const response = await fetch(`/api/canonical-results?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch trend results");
      return response.json();
    },
    enabled: showTrend && !!metricVersionKey,
    staleTime: 30000, // Keep data fresh for 30 seconds
    gcTime: 300000 // Cache for 5 minutes
  });

  const metricVersion = useMemo(() => 
    metricVersions.find(v => v.metric_version_key === metricVersionKey),
    [metricVersions, metricVersionKey]
  );

  const latestResult = latestResults[0] || null;

  // Extract the appropriate value based on result type
  const getValue = (result: CanonicalResult | null) => {
    if (!result) return null;
    
    if (result.result_value_numeric !== null) return Number(result.result_value_numeric);
    if (result.result_value_text !== null) return result.result_value_text;
    if (result.result_value_boolean !== null) return result.result_value_boolean;
    if (result.result_value_datetime !== null) return new Date(result.result_value_datetime);
    if (result.result_value_json !== null) return result.result_value_json;
    
    return null;
  };

  const formatValue = (value: any, resultType?: string, resultUnit?: string) => {
    if (value === null || value === undefined) return "N/A";
    
    switch (resultType) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(value));
        
      case "percentage":
        return `${Number(value).toFixed(1)}%`;
        
      case "numeric":
      case "count":
      case "ratio":
        const num = Number(value);
        if (num >= 1000000) {
          return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
          return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toLocaleString();
        
      case "boolean":
        return value ? "Yes" : "No";
        
      case "datetime":
        return new Date(value).toLocaleDateString();
        
      default:
        return String(value);
    }
  };

  const getValueColor = (value: any, resultType?: string) => {
    if (resultType === "boolean") {
      return value ? "text-green-600" : "text-red-600";
    }
    return "text-gray-900";
  };

  const getStatusIcon = (resultType?: string, value?: any) => {
    switch (resultType) {
      case "boolean":
        return value ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        );
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  // Calculate trend direction for numeric values
  const getTrendDirection = () => {
    if (!showTrend || trendResults.length < 2) return null;
    
    const current = getValue(trendResults[0]);
    const previous = getValue(trendResults[1]);
    
    if (current === null || previous === null) return null;
    if (typeof current !== "number" || typeof previous !== "number") return null;
    
    const change = ((current - previous) / previous) * 100;
    
    if (Math.abs(change) < 0.1) return { direction: "stable", change: 0 };
    return {
      direction: change > 0 ? "up" : "down",
      change: Math.abs(change)
    };
  };

  const trend = getTrendDirection();

  // Prepare chart data for trend visualization
  const chartData = useMemo(() => {
    if (!showTrend || !trendResults.length) return [];
    
    return trendResults
      .slice(0, 10) // Last 10 data points
      .reverse()
      .map((result, index) => ({
        index,
        value: getValue(result),
        date: result.calculated_at ? new Date(result.calculated_at).toLocaleDateString() : `Point ${index + 1}`
      }))
      .filter(item => typeof item.value === "number");
  }, [trendResults, showTrend]);

  if (!metricVersion) {
    return (
      <Card className={`${className}`} data-testid={`metric-card-error-${metricVersionKey}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">Metric version not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingLatest) {
    return (
      <Card className={`${className}`} data-testid={`metric-card-loading-${metricVersionKey}`}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentValue = getValue(latestResult);

  return (
    <Card 
      className={`${className} transition-all hover:shadow-md`}
      data-testid={`metric-card-${metricVersionKey}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium text-gray-700 line-clamp-2">
              {metricVersion.metric_version_name}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant="secondary" 
                className="text-xs"
                data-testid={`metric-badge-${metricVersionKey}`}
              >
                {metricVersion.domain}
              </Badge>
              {metricVersion.is_regulatory && (
                <Badge variant="outline" className="text-xs border-amber-400 text-amber-700">
                  Regulatory
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {getStatusIcon(metricVersion.result_type ?? undefined, currentValue)}
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                data-testid={`button-remove-${metricVersionKey}`}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Main Value Display */}
        <div className="space-y-1">
          <div className="flex items-end space-x-2">
            <span 
              className={`text-2xl font-bold ${getValueColor(currentValue, metricVersion.result_type ?? undefined)}`}
              data-testid={`metric-value-${metricVersionKey}`}
            >
              {formatValue(currentValue, metricVersion.result_type ?? undefined, metricVersion.result_unit ?? undefined)}
            </span>
            
            {trend && (
              <div className="flex items-center space-x-1 text-sm">
                {trend.direction === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                {trend.direction === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                {trend.direction === "stable" && <Minus className="h-4 w-4 text-gray-600" />}
                <span className={trend.direction === "up" ? "text-green-600" : trend.direction === "down" ? "text-red-600" : "text-gray-600"}>
                  {trend.change > 0 && `${trend.change.toFixed(1)}%`}
                </span>
              </div>
            )}
          </div>
          
          {metricVersion.result_unit && (
            <p className="text-xs text-gray-500">{metricVersion.result_unit}</p>
          )}
        </div>

        {/* Progress Bar for Percentages */}
        {metricVersion.result_type === "percentage" && typeof currentValue === "number" && (
          <Progress 
            value={Math.min(currentValue, 100)} 
            className="h-2"
            data-testid={`progress-${metricVersionKey}`}
          />
        )}

        {/* Trend Chart */}
        {showTrend && chartData.length > 1 && (
          <div className="h-16" data-testid={`trend-chart-${metricVersionKey}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00aeff" 
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs">
                          <p>{formatValue(payload[0].value, metricVersion.result_type ?? undefined)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-gray-500 space-y-1">
          {latestResult?.calculated_at && (
            <p>Updated: {new Date(latestResult.calculated_at).toLocaleString()}</p>
          )}
          <p>Frequency: {metricVersion.frequency || "Unknown"}</p>
          {metricVersion.steward && (
            <p>Steward: {metricVersion.steward}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}