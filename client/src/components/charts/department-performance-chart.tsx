import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const departmentData = [
  {
    department: "Emergency Department",
    totalClaims: 3420,
    filedOnTime: 3180,
    expiredClaims: 45,
    avgDaysToFile: 12.3,
    successRate: 93.0,
    valueAtRisk: 890000
  },
  {
    department: "Cardiology",
    totalClaims: 2890,
    filedOnTime: 2765,
    expiredClaims: 28,
    avgDaysToFile: 8.7,
    successRate: 95.7,
    valueAtRisk: 420000
  },
  {
    department: "Orthopedics",
    totalClaims: 2156,
    filedOnTime: 2087,
    expiredClaims: 19,
    avgDaysToFile: 9.2,
    successRate: 96.8,
    valueAtRisk: 315000
  },
  {
    department: "General Surgery",
    totalClaims: 1876,
    filedOnTime: 1743,
    expiredClaims: 52,
    avgDaysToFile: 15.1,
    successRate: 92.9,
    valueAtRisk: 1240000
  },
  {
    department: "Oncology",
    totalClaims: 1654,
    filedOnTime: 1587,
    expiredClaims: 23,
    avgDaysToFile: 7.8,
    successRate: 95.9,
    valueAtRisk: 380000
  },
  {
    department: "Radiology",
    totalClaims: 1423,
    filedOnTime: 1356,
    expiredClaims: 31,
    avgDaysToFile: 11.4,
    successRate: 95.3,
    valueAtRisk: 490000
  },
  {
    department: "Laboratory",
    totalClaims: 1298,
    filedOnTime: 1189,
    expiredClaims: 67,
    avgDaysToFile: 18.6,
    successRate: 91.6,
    valueAtRisk: 1580000
  },
  {
    department: "Physical Therapy",
    totalClaims: 987,
    filedOnTime: 934,
    expiredClaims: 18,
    avgDaysToFile: 10.2,
    successRate: 94.6,
    valueAtRisk: 280000
  }
];

const riskLevelData = [
  { level: "Critical (0-3 days)", value: 89, color: "#DC2626", percentage: 18.2 },
  { level: "High (4-7 days)", value: 167, color: "#EA580C", percentage: 34.1 },
  { level: "Medium (8-14 days)", value: 143, color: "#D97706", percentage: 29.2 },
  { level: "Low (15+ days)", value: 91, color: "#16A34A", percentage: 18.5 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Total Claims:</span> {data.totalClaims.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Filed On Time:</span> {data.filedOnTime.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Expired Claims:</span> {data.expiredClaims.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Success Rate:</span> {data.successRate}%
          </p>
          <p>
            <span className="font-medium">Avg Days to File:</span> {data.avgDaysToFile} days
          </p>
          <p>
            <span className="font-medium">Value at Risk:</span> ${data.valueAtRisk.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function DepartmentPerformanceChart() {
  const sortedData = departmentData.sort((a, b) => b.successRate - a.successRate);

  return (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="horizontal"
            margin={{
              top: 20,
              right: 30,
              left: 120,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              type="number"
              domain={[85, 100]}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${value}%`}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              type="category"
              dataKey="department"
              tick={{ fontSize: 10 }}
              width={110}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="successRate" 
              radius={[0, 4, 4, 0]}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.successRate >= 95 ? "#16A34A" : 
                        entry.successRate >= 93 ? "#D97706" : "#DC2626"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded">
          <p className="text-green-600 font-medium">Top Performer</p>
          <p className="font-semibold text-green-900">
            Orthopedics (96.8%)
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded">
          <p className="text-red-600 font-medium">Needs Attention</p>
          <p className="font-semibold text-red-900">
            Laboratory (91.6%)
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-blue-600 font-medium">Total Claims</p>
          <p className="font-semibold text-blue-900">
            {departmentData.reduce((sum, dept) => sum + dept.totalClaims, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <p className="text-yellow-600 font-medium">Total at Risk</p>
          <p className="font-semibold text-yellow-900">
            ${(departmentData.reduce((sum, dept) => sum + dept.valueAtRisk, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    </div>
  );
}

export function RiskLevelDistribution() {
  return (
    <div className="space-y-4">
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskLevelData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {riskLevelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any, name: string) => [
                `${value} claims (${riskLevelData.find(d => d.value === value)?.percentage}%)`,
                'Claims'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {riskLevelData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1">{item.level}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="bg-gray-50 p-4 rounded">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Claims at Risk</p>
            <p className="text-xl font-bold text-gray-900">
              {riskLevelData.reduce((sum, item) => sum + item.value, 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Critical + High Risk</p>
            <p className="text-xl font-bold text-red-600">
              {riskLevelData.slice(0, 2).reduce((sum, item) => sum + item.value, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}