import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const financialClassData = [
  {
    payerClass: "Self-pay",
    hospitalA: 13200000,
    hospitalB: 0,
    hospitalC: 0,
    hospitalD: 0,
    total: 13200000
  },
  {
    payerClass: "Commercial",
    payerClass_short: "Comm",
    hospitalA: 6800000,
    hospitalB: 2400000,
    hospitalC: 0,
    hospitalD: 0,
    total: 9200000
  },
  {
    payerClass: "BCBS",
    hospitalA: 0,
    hospitalB: 0,
    hospitalC: 1000000,
    hospitalD: 0,
    total: 1000000
  },
  {
    payerClass: "Medicare Repl",
    payerClass_short: "Med Repl",
    hospitalA: 0,
    hospitalB: 370000,
    hospitalC: 200000,
    hospitalD: 0,
    total: 570000
  },
  {
    payerClass: "Medicare",
    hospitalA: 0,
    hospitalB: 0,
    hospitalC: 370000,
    hospitalD: 0,
    total: 370000
  },
  {
    payerClass: "Medicaid Repl KS",
    payerClass_short: "Med Repl KS",
    hospitalA: 0,
    hospitalB: 130000,
    hospitalC: 0,
    hospitalD: 0,
    total: 130000
  },
  {
    payerClass: "Medicaid OOS",
    payerClass_short: "Med OOS",
    hospitalA: 0,
    hospitalB: 0,
    hospitalC: 240000,
    hospitalD: 0,
    total: 240000
  },
  {
    payerClass: "VA",
    hospitalA: 0,
    hospitalB: 0,
    hospitalC: 70000,
    hospitalD: 0,
    total: 70000
  },
  {
    payerClass: "Worker's Comp",
    payerClass_short: "Work Comp",
    hospitalA: 0,
    hospitalB: 0,
    hospitalC: 0,
    hospitalD: 70000,
    total: 70000
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {data.hospitalA > 0 && (
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>
              Hospital A: ${data.hospitalA.toLocaleString()}
            </p>
          )}
          {data.hospitalB > 0 && (
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>
              Hospital B: ${data.hospitalB.toLocaleString()}
            </p>
          )}
          {data.hospitalC > 0 && (
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-2"></span>
              Hospital C: ${data.hospitalC.toLocaleString()}
            </p>
          )}
          {data.hospitalD > 0 && (
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-purple-500 rounded mr-2"></span>
              Hospital D: ${data.hospitalD.toLocaleString()}
            </p>
          )}
          <div className="border-t pt-1 mt-2">
            <p className="text-sm font-semibold">
              Total: ${data.total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function FinancialClassChart() {
  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={financialClassData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="payerClass"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar 
              dataKey="hospitalA" 
              stackId="a" 
              fill="#3B82F6" 
              name="Hospital A"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="hospitalB" 
              stackId="a" 
              fill="#10B981" 
              name="Hospital B"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="hospitalC" 
              stackId="a" 
              fill="#F59E0B" 
              name="Hospital C"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="hospitalD" 
              stackId="a" 
              fill="#8B5CF6" 
              name="Hospital D"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-blue-600 font-medium">Hospital A</p>
          <p className="font-semibold text-blue-900">
            ${financialClassData.reduce((sum, item) => sum + item.hospitalA, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-green-600 font-medium">Hospital B</p>
          <p className="font-semibold text-green-900">
            ${financialClassData.reduce((sum, item) => sum + item.hospitalB, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <p className="text-yellow-600 font-medium">Hospital C</p>
          <p className="font-semibold text-yellow-900">
            ${financialClassData.reduce((sum, item) => sum + item.hospitalC, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded">
          <p className="text-purple-600 font-medium">Hospital D</p>
          <p className="font-semibold text-purple-900">
            ${financialClassData.reduce((sum, item) => sum + item.hospitalD, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}