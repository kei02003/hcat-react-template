import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const payerMixData = [
  {
    payer: "Commercial",
    percentage: 28.1,
    amount: 2850000,
    accounts: 3420,
    avgDaysInAR: 42.3
  },
  {
    payer: "BCBS",
    percentage: 17.3,
    amount: 1750000,
    accounts: 2180,
    avgDaysInAR: 38.7
  },
  {
    payer: "Medicare Repl",
    percentage: 15.4,
    amount: 1560000,
    accounts: 2890,
    avgDaysInAR: 35.2
  },
  {
    payer: "Medicare",
    percentage: 14.4,
    amount: 1460000,
    accounts: 2650,
    avgDaysInAR: 33.8
  },
  {
    payer: "Medicaid Repl KS",
    percentage: 7.5,
    amount: 760000,
    accounts: 1420,
    avgDaysInAR: 48.6
  },
  {
    payer: "Self-pay",
    percentage: 5.6,
    amount: 560000,
    accounts: 890,
    avgDaysInAR: 125.4
  },
  {
    payer: "VA",
    percentage: 4.7,
    amount: 470000,
    accounts: 340,
    avgDaysInAR: 28.9
  },
  {
    payer: "Worker's Comp",
    percentage: 3.5,
    amount: 350000,
    accounts: 180,
    avgDaysInAR: 67.8
  },
  {
    payer: "Medicaid OOS",
    percentage: 3.5,
    amount: 350000,
    accounts: 520,
    avgDaysInAR: 52.1
  }
];

export function PayerMixChart() {
  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={payerMixData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="payer" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: '%', angle: -90, position: 'insideLeft' }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'percentage') {
                  return [`${Number(value).toFixed(1)}%`, 'Percentage'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Payer: ${label}`}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold">{label}</p>
                      <p className="text-sm">
                        <span className="text-blue-600">Percentage: {data.percentage}%</span>
                      </p>
                      <p className="text-sm">
                        Amount: ${data.amount.toLocaleString()}
                      </p>
                      <p className="text-sm">
                        Accounts: {data.accounts.toLocaleString()}
                      </p>
                      <p className="text-sm">
                        Avg Days in AR: {data.avgDaysInAR} days
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="percentage" 
              fill="hsl(207, 90%, 54%)" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Top Payer</p>
          <p className="font-semibold text-blue-600">Commercial (28.1%)</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Total Revenue</p>
          <p className="font-semibold">$10.15M</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Total Accounts</p>
          <p className="font-semibold">14,490</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Avg Days in AR</p>
          <p className="font-semibold">47.8 days</p>
        </div>
      </div>
      
      {/* Risk Analysis */}
      <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-800">
              <strong>High Risk:</strong> Self-pay accounts averaging 125.4 days in AR. 
              Worker's Comp at 67.8 days also needs attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}