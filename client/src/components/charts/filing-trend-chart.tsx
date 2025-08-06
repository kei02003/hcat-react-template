import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';

const filingTrendData = [
  { 
    date: "2024-11-01", 
    totalClaims: 1240, 
    claimsAtRisk: 186, 
    criticalClaims: 45, 
    expiredClaims: 8,
    successRate: 94.2,
    valueAtRisk: 3200000
  },
  { 
    date: "2024-11-02", 
    totalClaims: 1185, 
    claimsAtRisk: 198, 
    criticalClaims: 52, 
    expiredClaims: 12,
    successRate: 93.8,
    valueAtRisk: 3450000
  },
  { 
    date: "2024-11-03", 
    totalClaims: 1320, 
    claimsAtRisk: 165, 
    criticalClaims: 38, 
    expiredClaims: 6,
    successRate: 95.1,
    valueAtRisk: 2890000
  },
  { 
    date: "2024-11-04", 
    totalClaims: 1298, 
    claimsAtRisk: 203, 
    criticalClaims: 61, 
    expiredClaims: 15,
    successRate: 92.9,
    valueAtRisk: 3780000
  },
  { 
    date: "2024-11-05", 
    totalClaims: 1156, 
    claimsAtRisk: 178, 
    criticalClaims: 42, 
    expiredClaims: 9,
    successRate: 94.6,
    valueAtRisk: 3150000
  },
  { 
    date: "2024-11-06", 
    totalClaims: 1275, 
    claimsAtRisk: 212, 
    criticalClaims: 58, 
    expiredClaims: 18,
    successRate: 92.1,
    valueAtRisk: 4120000
  },
  { 
    date: "2024-11-07", 
    totalClaims: 1389, 
    claimsAtRisk: 195, 
    criticalClaims: 47, 
    expiredClaims: 11,
    successRate: 94.8,
    valueAtRisk: 3560000
  },
  { 
    date: "2024-11-08", 
    totalClaims: 1425, 
    claimsAtRisk: 234, 
    criticalClaims: 72, 
    expiredClaims: 22,
    successRate: 91.5,
    valueAtRisk: 4890000
  },
  { 
    date: "2024-11-09", 
    totalClaims: 1368, 
    claimsAtRisk: 189, 
    criticalClaims: 51, 
    expiredClaims: 14,
    successRate: 93.7,
    valueAtRisk: 3720000
  },
  { 
    date: "2024-11-10", 
    totalClaims: 1412, 
    claimsAtRisk: 256, 
    criticalClaims: 89, 
    expiredClaims: 31,
    successRate: 89.2,
    valueAtRisk: 5650000
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">
          {format(new Date(label), 'MMM dd, yyyy')}
        </p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>
            Total Claims: {data.totalClaims.toLocaleString()}
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-2"></span>
            Claims at Risk: {data.claimsAtRisk.toLocaleString()}
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>
            Critical Claims: {data.criticalClaims.toLocaleString()}
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-gray-500 rounded mr-2"></span>
            Expired Claims: {data.expiredClaims.toLocaleString()}
          </p>
          <div className="border-t pt-1 mt-2">
            <p className="font-medium">
              Success Rate: {data.successRate}%
            </p>
            <p className="font-medium">
              Value at Risk: ${(data.valueAtRisk / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function FilingTrendChart() {
  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filingTrendData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => format(new Date(value), 'MM/dd')}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            
            <Line 
              type="monotone" 
              dataKey="totalClaims" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Total Claims"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="claimsAtRisk" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Claims at Risk"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="criticalClaims" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Critical Claims"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="expiredClaims" 
              stroke="#6B7280" 
              strokeWidth={2}
              name="Expired Claims"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
          <div className="flex">
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-red-800">Critical Alert</h4>
              <p className="text-sm text-red-700">
                89 claims with less than 3 days to file. Immediate action required.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <div className="flex">
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-yellow-800">At Risk</h4>
              <p className="text-sm text-yellow-700">
                $5.7M in claims value at risk of missing filing deadlines.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <div className="flex">
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-800">Success Rate</h4>
              <p className="text-sm text-blue-700">
                Current 7-day average: 92.8% on-time filing rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FilingVolumeChart() {
  const volumeData = filingTrendData.slice(-7); // Last 7 days

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={volumeData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => format(new Date(value), 'MM/dd')}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: any, name: string) => [
                value.toLocaleString(),
                name === 'totalClaims' ? 'Total Claims' :
                name === 'claimsAtRisk' ? 'Claims at Risk' : name
              ]}
              labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
            />
            <Bar 
              dataKey="totalClaims" 
              fill="#3B82F6" 
              name="Total Claims"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="claimsAtRisk" 
              fill="#F59E0B" 
              name="Claims at Risk"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}