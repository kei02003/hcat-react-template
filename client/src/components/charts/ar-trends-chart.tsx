import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

const arTrendsData = [
  { 
    date: "2022-01-31", 
    actual: 45000, 
    expected: 48000, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-02-28", 
    actual: 42000, 
    expected: 47000, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-03-31", 
    actual: 46000, 
    expected: 47500, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-04-30", 
    actual: 49000, 
    expected: 48000, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-05-31", 
    actual: 51000, 
    expected: 48500, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-06-30", 
    actual: 47000, 
    expected: 47000, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-07-31", 
    actual: 45500, 
    expected: 46500, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-08-31", 
    actual: 48000, 
    expected: 47500, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-09-30", 
    actual: 44000, 
    expected: 46000, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-10-31", 
    actual: 43000, 
    expected: 45000, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-11-30", 
    actual: 42000, 
    expected: 44000, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: false
  },
  { 
    date: "2022-12-31", 
    actual: 39000, 
    expected: 43000, 
    controlLimits: 50000,
    limitViolation: false,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-01-31", 
    actual: 75000, 
    expected: 42000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-02-28", 
    actual: 68000, 
    expected: 41000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-03-31", 
    actual: 72000, 
    expected: 40000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-04-30", 
    actual: 65000, 
    expected: 39000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-05-31", 
    actual: 70000, 
    expected: 38000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-06-30", 
    actual: 95000, 
    expected: 37000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: true,
    detectedChange: true
  },
  { 
    date: "2023-07-31", 
    actual: 150000, 
    expected: 36000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: true,
    detectedChange: true
  },
  { 
    date: "2023-08-31", 
    actual: 85000, 
    expected: 35000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-09-30", 
    actual: 92000, 
    expected: 34000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-10-31", 
    actual: 88000, 
    expected: 33000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-11-30", 
    actual: 98000, 
    expected: 32000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2023-12-31", 
    actual: 89000, 
    expected: 31000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-01-31", 
    actual: 95000, 
    expected: 30000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-02-29", 
    actual: 87000, 
    expected: 29000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-03-31", 
    actual: 92000, 
    expected: 28000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-04-30", 
    actual: 78000, 
    expected: 27000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-05-31", 
    actual: 85000, 
    expected: 26000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-06-30", 
    actual: 91000, 
    expected: 25000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-07-31", 
    actual: 83000, 
    expected: 24000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-08-31", 
    actual: 76000, 
    expected: 23000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-09-30", 
    actual: 89000, 
    expected: 22000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-10-31", 
    actual: 94000, 
    expected: 21000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: false,
    detectedChange: true
  },
  { 
    date: "2024-11-30", 
    actual: 135000, 
    expected: 20000, 
    controlLimits: 50000,
    limitViolation: true,
    runViolation: true,
    detectedChange: true
  }
];

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (payload.limitViolation) {
    return <circle cx={cx} cy={cy} r={4} fill="#DC2626" />;
  }
  if (payload.runViolation) {
    return <circle cx={cx} cy={cy} r={4} fill="#EA580C" />;
  }
  if (payload.detectedChange) {
    return <circle cx={cx} cy={cy} r={4} fill="#D97706" />;
  }
  
  return <circle cx={cx} cy={cy} r={3} fill="#1F2937" />;
};

export function ArTrendsChart() {
  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={arTrendsData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
              tickFormatter={(value) => format(new Date(value), 'MMM-yy')}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              labelFormatter={(value) => format(new Date(value), 'MMM yyyy')}
              formatter={(value: any, name: string) => [
                `$${Number(value).toLocaleString()}`,
                name === 'actual' ? 'Actual' : 
                name === 'expected' ? 'Expected (median)' : 'Control Limits'
              ]}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            
            {/* Control Limits Line */}
            <ReferenceLine 
              y={50000} 
              stroke="#9CA3AF" 
              strokeDasharray="8 8" 
              label={{ value: "Control Limits (boot 0.95)", position: "topRight", fontSize: 10 }}
            />
            
            {/* Expected (median) Line */}
            <Line 
              type="monotone" 
              dataKey="expected" 
              stroke="#6B7280" 
              strokeWidth={2}
              name="Expected (median)"
              dot={false}
            />
            
            {/* Actual Line with Custom Dots */}
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#1F2937" 
              strokeWidth={2}
              name="Actual"
              dot={<CustomDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span>Limit Violation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-600" />
          <span>Run Violation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-600" />
          <span>Detected Change</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-800" />
          <span>Normal</span>
        </div>
      </div>
      
      {/* Key Insight */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <strong>Changepoint Detected:</strong> Significant increase in AR 90+ starting July 2023. 
              Current trend shows AR aging has increased by 180% from baseline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}