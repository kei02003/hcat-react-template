import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Scatter,
  ComposedChart,
  Area
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Target, Zap } from "lucide-react";

interface SPCDataPoint {
  date: string;
  value: number;
  expectedValue?: number;
  isViolation?: boolean;
  violationType?: 'control' | 'run' | 'trend';
  isChangepoint?: boolean;
  changepointProbability?: number;
}

interface SPCChartProps {
  data?: SPCDataPoint[];
  metric: string;
  title: string;
}

interface ControlLimits {
  ucl: number; // Upper Control Limit
  lcl: number; // Lower Control Limit
  centerLine: number;
  usl?: number; // Upper Specification Limit
  lsl?: number; // Lower Specification Limit
}

// Mock data generator for SPC analysis
const generateSPCData = (metric: string): { data: SPCDataPoint[], limits: ControlLimits } => {
  const baseValue = {
    'denial-rate': 8.2,
    'ar-days': 42.3,
    'appeal-success': 87.4,
    'timely-filing': 12,
    'revenue-cycle': 2100000,
    'productivity': 94.7
  }[metric] || 50;

  const data: SPCDataPoint[] = [];
  const dates = [];
  
  // Generate last 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Generate data with realistic variations, changepoints, and violations
  let currentLevel = baseValue;
  
  dates.forEach((date, index) => {
    // Introduce changepoint at day 15
    if (index === 15) {
      currentLevel = baseValue * (metric === 'denial-rate' ? 0.85 : 1.15);
    }
    
    // Add random variation
    const variation = (Math.random() - 0.5) * 0.2 * baseValue;
    const value = currentLevel + variation;
    
    // Calculate expected value based on trend
    const expectedValue = currentLevel;
    
    // Detect violations
    let isViolation = false;
    let violationType: 'control' | 'run' | 'trend' | undefined;
    
    // Control limit violations (beyond 3 sigma)
    const sigma = baseValue * 0.1;
    if (Math.abs(value - currentLevel) > 3 * sigma) {
      isViolation = true;
      violationType = 'control';
    }
    
    // Run violations (7+ consecutive points on same side)
    if (index >= 6) {
      const recentData = data.slice(-6);
      const allAbove = recentData.every(d => d.value > currentLevel);
      const allBelow = recentData.every(d => d.value < currentLevel);
      if ((allAbove || allBelow) && (value > currentLevel === allAbove)) {
        isViolation = true;
        violationType = 'run';
      }
    }
    
    // Trend violations (6+ consecutive increasing/decreasing)
    if (index >= 5) {
      const recentData = data.slice(-5);
      const isIncreasing = recentData.every((d, i) => i === 0 || d.value > recentData[i-1].value);
      const isDecreasing = recentData.every((d, i) => i === 0 || d.value < recentData[i-1].value);
      if ((isIncreasing && value > data[data.length - 1]?.value) || 
          (isDecreasing && value < data[data.length - 1]?.value)) {
        isViolation = true;
        violationType = 'trend';
      }
    }
    
    data.push({
      date,
      value: parseFloat(value.toFixed(2)),
      expectedValue: parseFloat(expectedValue.toFixed(2)),
      isViolation,
      violationType,
      isChangepoint: index === 15,
      changepointProbability: index === 15 ? 0.95 : Math.random() * 0.3
    });
  });

  // Calculate control limits
  const sigma = baseValue * 0.1;
  const limits: ControlLimits = {
    ucl: baseValue + 3 * sigma,
    lcl: Math.max(0, baseValue - 3 * sigma),
    centerLine: baseValue,
    usl: metric === 'denial-rate' ? baseValue + 2 * sigma : undefined,
    lsl: metric === 'denial-rate' ? Math.max(0, baseValue - 2 * sigma) : undefined
  };

  return { data, limits };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{`Date: ${label}`}</p>
        <p className="text-blue-600 dark:text-blue-400">
          {`Actual: ${payload[0].value}`}
        </p>
        {data.expectedValue && (
          <p className="text-green-600 dark:text-green-400">
            {`Expected: ${data.expectedValue}`}
          </p>
        )}
        {data.isViolation && (
          <p className="text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {`${data.violationType?.toUpperCase()} Violation`}
          </p>
        )}
        {data.isChangepoint && (
          <p className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {`Changepoint (${(data.changepointProbability * 100).toFixed(1)}%)`}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const ViolationIndicator = ({ data, xAxisDataKey, yAxisDataKey }: any) => {
  const violations = data.filter((point: SPCDataPoint) => point.isViolation);
  
  return (
    <>
      {violations.map((point: SPCDataPoint, index: number) => (
        <Scatter
          key={`violation-${index}`}
          data={[point]}
          fill={
            point.violationType === 'control' ? '#ef4444' :
            point.violationType === 'run' ? '#f97316' :
            '#eab308'
          }
          shape="triangle"
        />
      ))}
    </>
  );
};

export function SPCTimeSeriesChart({ data: externalData, metric, title }: SPCChartProps) {
  const { data, limits } = useMemo(() => {
    if (externalData) {
      // Use external data if provided
      const sigma = externalData.reduce((sum, d) => sum + d.value, 0) / externalData.length * 0.1;
      const mean = externalData.reduce((sum, d) => sum + d.value, 0) / externalData.length;
      
      return {
        data: externalData,
        limits: {
          ucl: mean + 3 * sigma,
          lcl: Math.max(0, mean - 3 * sigma),
          centerLine: mean
        }
      };
    }
    return generateSPCData(metric);
  }, [externalData, metric]);

  const violations = data.filter(d => d.isViolation);
  const changepoints = data.filter(d => d.isChangepoint);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart Header with Statistics */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {title} SPC Analysis
          </h3>
          <div className="flex gap-2">
            {violations.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {violations.length} Violations
              </Badge>
            )}
            {changepoints.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {changepoints.length} Changepoint{changepoints.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-slate-600 dark:text-slate-400">
          <p>UCL: {limits.ucl.toFixed(2)}</p>
          <p>Center: {limits.centerLine.toFixed(2)}</p>
          <p>LCL: {limits.lcl.toFixed(2)}</p>
        </div>
      </div>

      {/* Main Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Control Limits */}
          <ReferenceLine 
            y={limits.ucl} 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            label={{ value: "UCL", position: "right" }}
          />
          <ReferenceLine 
            y={limits.centerLine} 
            stroke="#64748b" 
            strokeDasharray="2 2"
            label={{ value: "Center", position: "right" }}
          />
          <ReferenceLine 
            y={limits.lcl} 
            stroke="#ef4444" 
            strokeDasharray="5 5"
            label={{ value: "LCL", position: "right" }}
          />

          {/* Specification Limits */}
          {limits.usl && (
            <ReferenceLine 
              y={limits.usl} 
              stroke="#f97316" 
              strokeDasharray="3 3"
              label={{ value: "USL", position: "right" }}
            />
          )}
          {limits.lsl && (
            <ReferenceLine 
              y={limits.lsl} 
              stroke="#f97316" 
              strokeDasharray="3 3"
              label={{ value: "LSL", position: "right" }}
            />
          )}

          {/* Changepoint Highlighting */}
          {changepoints.map((point, index) => {
            const pointIndex = data.findIndex(d => d.date === point.date);
            return (
              <ReferenceArea
                key={`changepoint-${index}`}
                x1={data[Math.max(0, pointIndex - 1)]?.date}
                x2={data[Math.min(data.length - 1, pointIndex + 1)]?.date}
                fill="#8b5cf6"
                fillOpacity={0.1}
                stroke="#8b5cf6"
                strokeWidth={2}
              />
            );
          })}

          {/* Expected Values (Confidence Interval) */}
          <Area
            dataKey="expectedValue"
            fill="#10b981"
            fillOpacity={0.1}
            stroke="none"
            name="Expected Range"
          />

          {/* Actual Values Line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={(props) => {
              const { payload } = props;
              if (payload?.isViolation) {
                const color = 
                  payload.violationType === 'control' ? '#ef4444' :
                  payload.violationType === 'run' ? '#f97316' :
                  '#eab308';
                return <circle {...props} fill={color} stroke={color} r={6} />;
              }
              if (payload?.isChangepoint) {
                return <circle {...props} fill="#8b5cf6" stroke="#8b5cf6" r={5} />;
              }
              return <circle {...props} fill="#2563eb" r={3} />;
            }}
            name="Actual Values"
          />

          {/* Expected Values Line */}
          <Line
            type="monotone"
            dataKey="expectedValue"
            stroke="#10b981"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            name="Expected Values"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend for Violations */}
      <div className="flex justify-center gap-6 mt-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Control Violation</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Run Violation</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Trend Violation</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Changepoint</span>
        </div>
      </div>
    </div>
  );
}