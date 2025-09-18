import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, X, ChevronDown, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { CanonicalMetricVersion } from "@shared/schema";

interface MetricPickerProps {
  selectedMetrics: string[];
  onMetricsChange: (metricVersionKeys: string[]) => void;
  maxSelections?: number;
}

interface MetricFilters {
  domain: string;
  frequency: string;
  resultType: string;
  search: string;
  isRegulatory: boolean | null;
  tags: string[];
}

export function MetricPicker({ selectedMetrics, onMetricsChange, maxSelections = 20 }: MetricPickerProps) {
  const [filters, setFilters] = useState<MetricFilters>({
    domain: "all",
    frequency: "all", 
    resultType: "all",
    search: "",
    isRegulatory: null,
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch active metric versions
  const { data: metricVersions = [], isLoading, error } = useQuery<CanonicalMetricVersion[]>({
    queryKey: ["/api/canonical-metric-versions/active"],
    queryFn: async () => {
      const response = await fetch("/api/canonical-metric-versions/active");
      if (!response.ok) throw new Error("Failed to fetch metric versions");
      return response.json();
    }
  });

  // Filter and search metrics
  const filteredMetrics = useMemo(() => {
    return metricVersions.filter(metric => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          metric.metric_version_name.toLowerCase().includes(searchTerm) ||
          metric.metric_version_description.toLowerCase().includes(searchTerm) ||
          metric.steward.toLowerCase().includes(searchTerm) ||
          metric.developer.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Domain filter
      if (filters.domain !== "all" && metric.domain !== filters.domain) return false;

      // Frequency filter  
      if (filters.frequency !== "all" && metric.frequency !== filters.frequency) return false;

      // Result type filter
      if (filters.resultType !== "all" && metric.result_type !== filters.resultType) return false;

      // Regulatory filter
      if (filters.isRegulatory !== null && metric.is_regulatory !== filters.isRegulatory) return false;

      // Tags filter - disabled for now since tags field doesn't exist in schema
      // if (filters.tags.length > 0) {
      //   const metricTags = metric.tags || [];
      //   const hasMatchingTag = filters.tags.some(tag => metricTags.includes(tag));
      //   if (!hasMatchingTag) return false;
      // }

      return true;
    });
  }, [metricVersions, filters]);

  // Group metrics by domain for better organization
  const groupedMetrics = useMemo(() => {
    const groups: Record<string, CanonicalMetricVersion[]> = {};
    filteredMetrics.forEach(metric => {
      if (!groups[metric.domain]) {
        groups[metric.domain] = [];
      }
      groups[metric.domain].push(metric);
    });
    return groups;
  }, [filteredMetrics]);

  // Get unique values for filters
  const uniqueDomains = Array.from(new Set(metricVersions.map(m => m.domain).filter(Boolean)));
  const uniqueFrequencies = Array.from(new Set(metricVersions.map(m => m.frequency).filter(Boolean)));
  const uniqueResultTypes = Array.from(new Set(metricVersions.map(m => m.result_type).filter(Boolean)));
  const uniqueTags: string[] = []; // Simplified for now - tags not included in current data model

  const handleMetricToggle = (metricVersionKey: string) => {
    const isCurrentlySelected = selectedMetrics.includes(metricVersionKey);
    
    if (isCurrentlySelected) {
      // Remove metric
      onMetricsChange(selectedMetrics.filter(key => key !== metricVersionKey));
    } else {
      // Add metric if under limit
      if (selectedMetrics.length < maxSelections) {
        onMetricsChange([...selectedMetrics, metricVersionKey]);
      }
    }
  };

  const clearSelection = () => {
    onMetricsChange([]);
  };

  const clearFilters = () => {
    setFilters({
      domain: "all",
      frequency: "all",
      resultType: "all", 
      search: "",
      isRegulatory: null,
      tags: []
    });
  };

  const getResultTypeColor = (resultType: string) => {
    switch (resultType) {
      case "percentage": return "bg-blue-100 text-blue-800";
      case "currency": return "bg-green-100 text-green-800";
      case "numeric": return "bg-purple-100 text-purple-800";
      case "count": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card data-testid="metric-picker-loading">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="metric-picker-error">
        <CardContent className="p-6">
          <p className="text-red-600">Failed to load metrics. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="metric-picker">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Select Metrics</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" data-testid="selection-count">
              {selectedMetrics.length} / {maxSelections} selected
            </Badge>
            {selectedMetrics.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSelection}
                data-testid="button-clear-selection"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search metrics by name, description, or owner..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
              data-testid="input-metric-search"
            />
          </div>

          <div className="flex items-center justify-between">
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-toggle-filters">
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={filters.domain} onValueChange={(value) => setFilters(prev => ({ ...prev, domain: value }))}>
                    <SelectTrigger data-testid="select-domain-filter">
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      <SelectItem value="Clinical">Clinical</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Regulatory">Regulatory</SelectItem>
                      <SelectItem value="Quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.frequency} onValueChange={(value) => setFilters(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger data-testid="select-frequency-filter">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Frequencies</SelectItem>
                      <SelectItem value="real-time">Real-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.resultType} onValueChange={(value) => setFilters(prev => ({ ...prev, resultType: value }))}>
                    <SelectTrigger data-testid="select-result-type-filter">
                      <SelectValue placeholder="Result Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="numeric">Numeric</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="currency">Currency</SelectItem>
                      <SelectItem value="count">Count</SelectItem>
                      <SelectItem value="ratio">Ratio</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Tags Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                      {uniqueTags.length > 0 ? (
                        uniqueTags.map(tag => (
                          <div key={tag} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`tag-${tag}`}
                              checked={filters.tags.includes(tag)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setFilters(prev => ({
                                  ...prev,
                                  tags: isChecked 
                                    ? [...prev.tags, tag]
                                    : prev.tags.filter(t => t !== tag)
                                }));
                              }}
                              className="rounded"
                              data-testid={`checkbox-tag-${tag}`}
                            />
                            <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                              {tag}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No tags available</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Metrics List */}
        <ScrollArea className="h-96" data-testid="metrics-list">
          <div className="space-y-4">
            {Object.entries(groupedMetrics).map(([domain, metrics]) => (
              <div key={domain} className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
                  {domain} ({metrics.length})
                </h4>
                <div className="space-y-2">
                  {metrics.map((metric) => {
                    const isSelected = selectedMetrics.includes(metric.metric_version_key);
                    return (
                    <div
                      key={metric.metric_version_key}
                      className={`border rounded-lg p-3 transition-all hover:shadow-sm ${
                        isSelected
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      data-testid={`metric-item-${metric.metric_version_key}`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleMetricToggle(metric.metric_version_key)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          data-testid={`checkbox-${metric.metric_version_key}`}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm text-gray-900 truncate">
                                {metric.metric_version_name}
                              </h5>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {metric.metric_version_description}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-1 ml-2">
                              {metric.result_type && (
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getResultTypeColor(metric.result_type)}`}
                                >
                                  {metric.result_type}
                                </Badge>
                              )}
                              {metric.is_regulatory && (
                                <Badge variant="outline" className="text-xs border-amber-400 text-amber-700">
                                  Regulatory
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>Steward: {metric.steward}</span>
                            {metric.frequency && (
                              <span className="capitalize">{metric.frequency}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {filteredMetrics.length === 0 && (
            <div className="text-center py-8 text-gray-500" data-testid="no-metrics-message">
              <p>No metrics found matching your criteria.</p>
              <Button 
                variant="link" 
                size="sm" 
                onClick={clearFilters}
                className="mt-2"
              >
                Clear filters to see all metrics
              </Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}