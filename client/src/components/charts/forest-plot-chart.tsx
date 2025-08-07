import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  ErrorBar,
  ComposedChart,
  Line,
  Area
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, Target, Calendar } from "lucide-react";

interface ForestPlotDataPoint {
  category: string;
  value: number;
  lowerCI: number;
  upperCI: number;
  n: number;
  pValue: number;
  forecast?: number;
  forecastLower?: number;
  forecastUpper?: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
}

interface ForestPlotProps {
  data?: ForestPlotDataPoint[];
  dimension: string;
  title: string;
}

// Mock data generator for forest plots by dimension
const generateForestPlotData = (dimension: string): ForestPlotDataPoint[] => {
  const categories = {
    'patient-type': [
      'Inpatient', 'Outpatient', 'Emergency', 'Observation', 'Surgery', 'ICU'
    ],
    'discharge-location': [
      'Home', 'SNF', 'Home Health', 'Rehab', 'Hospice', 'Transfer'
    ],
    'payer-type': [
      'Medicare', 'Commercial', 'Medicaid', 'Self-Pay', 'Workers Comp', 'Other'
    ],
    'department': [
      'Cardiology', 'Emergency', 'Surgery', 'Medicine', 'ICU', 'Orthopedics'
    ],
    'procedure-type': [
      'Diagnostic', 'Therapeutic', 'Surgical', 'Interventional', 'Preventive', 'Emergency'
    ],
    'severity-level': [
      'Low Risk', 'Moderate Risk', 'High Risk', 'Critical', 'Complex', 'Routine'
    ]
  }[dimension] || ['Category A', 'Category B', 'Category C'];

  return categories.map((category, index) => {
    // Base values vary by dimension type
    const baseValue = dimension === 'patient-type' ? 
      15 + Math.random() * 20 : // Denial rates 15-35%
      dimension === 'discharge-location' ?
      25 + Math.random() * 30 : // AR days 25-55
      50 + Math.random() * 40; // Other metrics 50-90
    
    const value = baseValue + (Math.random() - 0.5) * 10;
    const stdError = 2 + Math.random() * 3;
    const n = 50 + Math.floor(Math.random() * 200);
    
    // Calculate confidence intervals
    const lowerCI = value - 1.96 * stdError;
    const upperCI = value + 1.96 * stdError;
    
    // Generate forecast (3 months ahead)
    const trendFactor = (Math.random() - 0.5) * 0.2; // ±20% trend
    const forecast = value * (1 + trendFactor);
    const forecastError = stdError * 1.2; // Wider confidence for forecast
    const forecastLower = forecast - 1.96 * forecastError;
    const forecastUpper = forecast + 1.96 * forecastError;
    
    // Determine risk level based on value and confidence interval width
    const ciWidth = upperCI - lowerCI;
    const riskLevel: 'low' | 'medium' | 'high' = 
      value > 30 && ciWidth > 10 ? 'high' :
      value > 20 || ciWidth > 6 ? 'medium' : 'low';
    
    // Determine trend
    const trend: 'up' | 'down' | 'stable' = 
      trendFactor > 0.05 ? 'up' :
      trendFactor < -0.05 ? 'down' : 'stable';
    
    return {
      category,
      value: parseFloat(value.toFixed(2)),
      lowerCI: parseFloat(lowerCI.toFixed(2)),
      upperCI: parseFloat(upperCI.toFixed(2)),
      n,
      pValue: Math.random() * 0.1,
      forecast: parseFloat(forecast.toFixed(2)),
      forecastLower: parseFloat(forecastLower.toFixed(2)),
      forecastUpper: parseFloat(forecastUpper.toFixed(2)),
      riskLevel,
      trend
    };
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg shadow-lg min-w-[250px]">
        <p className="font-medium text-lg mb-2">{label}</p>
        
        <div className="space-y-1 text-sm">
          <p className="text-blue-600 dark:text-blue-400">
            <span className="font-medium">Current Value:</span> {data.value}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">95% CI:</span> [{data.lowerCI.toFixed(2)}, {data.upperCI.toFixed(2)}]
          </p>
          <p className="text-green-600 dark:text-green-400">
            <span className="font-medium">Forecast:</span> {data.forecast?.toFixed(2)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Forecast CI:</span> [{data.forecastLower?.toFixed(2)}, {data.forecastUpper?.toFixed(2)}]
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Sample Size:</span> {data.n}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">p-value:</span> {data.pValue.toFixed(4)}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant={
                data.riskLevel === 'high' ? 'destructive' :
                data.riskLevel === 'medium' ? 'secondary' : 'default'
              }
              className="text-xs"
            >
              {data.riskLevel.toUpperCase()} RISK
            </Badge>
            <Badge 
              variant={
                data.trend === 'up' ? 'destructive' :
                data.trend === 'down' ? 'default' : 'secondary'
              }
              className="text-xs flex items-center gap-1"
            >
              {data.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
               data.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
               <Target className="w-3 h-3" />}
              {data.trend.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ErrorBarCustom = (props: any) => {
  const { payload, x, y, width, height } = props;
  const centerX = x + width / 2;
  
  // Current value error bars
  const currentLower = y + height * ((payload.upperCI - payload.value) / (payload.upperCI - payload.lowerCI));
  const currentUpper = y + height * ((payload.upperCI - payload.lowerCI) / (payload.upperCI - payload.lowerCI));
  
  return (
    <g>
      {/* Current CI error bars */}
      <line
        x1={centerX - 10}
        y1={currentLower}
        x2={centerX + 10}
        y2={currentLower}
        stroke="#64748b"
        strokeWidth={2}
      />
      <line
        x1={centerX - 10}
        y1={currentUpper}
        x2={centerX + 10}
        y2={currentUpper}
        stroke="#64748b"
        strokeWidth={2}
      />
      <line
        x1={centerX}
        y1={currentLower}
        x2={centerX}
        y2={currentUpper}
        stroke="#64748b"
        strokeWidth={1}
      />
    </g>
  );
};

export function ForestPlotChart({ data: externalData, dimension, title }: ForestPlotProps) {
  const data = useMemo(() => {
    return externalData || generateForestPlotData(dimension);
  }, [externalData, dimension]);

  // Calculate overall effect and statistics
  const overallEffect = data.reduce((sum, d) => sum + d.value * d.n, 0) / 
                       data.reduce((sum, d) => sum + d.n, 0);
  
  const highRiskCount = data.filter(d => d.riskLevel === 'high').length;
  const significantCount = data.filter(d => d.pValue < 0.05).length;

  // Prepare combined data for current and forecast
  const combinedData = data.flatMap(d => [
    {
      ...d,
      category: d.category,
      type: 'current',
      displayValue: d.value,
      lower: d.lowerCI,
      upper: d.upperCI
    },
    {
      ...d,
      category: `${d.category} (Forecast)`,
      type: 'forecast',
      displayValue: d.forecast,
      lower: d.forecastLower,
      upper: d.forecastUpper,
      value: d.forecast // For proper display
    }
  ]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {title} Forest Plot Analysis
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Overall: {overallEffect.toFixed(2)}
            </Badge>
            {highRiskCount > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {highRiskCount} High Risk
              </Badge>
            )}
            {significantCount > 0 && (
              <Badge variant="default" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {significantCount} Significant
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-slate-600 dark:text-slate-400">
          <p>95% Confidence Intervals</p>
          <p className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            3-Month Forecast
          </p>
        </div>
      </div>

      {/* Forest Plot */}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          layout="horizontal"
          data={combinedData}
          margin={{ top: 20, right: 30, bottom: 20, left: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis 
            dataKey="category" 
            type="category" 
            width={100}
            tick={{ fontSize: 10 }}
            interval={0}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Overall effect line */}
          <ReferenceLine 
            x={overallEffect} 
            stroke="#64748b" 
            strokeDasharray="5 5"
            label={{ value: "Overall Effect", position: "top" }}
          />

          {/* Bars for current values */}
          <Bar 
            dataKey="displayValue" 
            fill="#3b82f6"
            name="Current & Forecast Values"
          >
            {combinedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  entry.type === 'forecast' ? '#10b981' :
                  entry.riskLevel === 'high' ? '#ef4444' :
                  entry.riskLevel === 'medium' ? '#f97316' : '#3b82f6'
                }
                opacity={entry.type === 'forecast' ? 0.7 : 1}
              />
            ))}
          </Bar>

          {/* Error bars component would go here if supported */}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Confidence Interval Details */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Current Analysis</h4>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            {data.slice(0, 3).map((item) => (
              <div key={item.category} className="flex justify-between">
                <span>{item.category}:</span>
                <span>{item.value} [{item.lowerCI.toFixed(1)}, {item.upperCI.toFixed(1)}]</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Forecast (3 months)</h4>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            {data.slice(0, 3).map((item) => (
              <div key={item.category} className="flex justify-between">
                <span>{item.category}:</span>
                <span className="text-green-600 dark:text-green-400">
                  {item.forecast?.toFixed(1)} [{item.forecastLower?.toFixed(1)}, {item.forecastUpper?.toFixed(1)}]
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
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
}