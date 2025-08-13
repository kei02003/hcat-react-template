import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const topDenialReasons = [
  {
    reasonCode: "N386",
    description: "This decision was based on a National Coverage Determination",
    category: "Medical Necessity",
    frequency: 89,
    deniedAmount: 2340000,
    appealSuccessRate: 45.2,
    preventionTips: "Review NCD guidelines before service authorization"
  },
  {
    reasonCode: "N387",
    description: "This decision was based on a Local Coverage Determination",
    category: "Medical Necessity", 
    frequency: 76,
    deniedAmount: 1980000,
    appealSuccessRate: 38.7,
    preventionTips: "Verify LCD requirements with local MAC"
  },
  {
    reasonCode: "N432",
    description: "Not covered unless the patient meets the coverage criteria outlined in the LCD",
    category: "Coverage",
    frequency: 65,
    deniedAmount: 1650000,
    appealSuccessRate: 52.3,
    preventionTips: "Document all LCD coverage criteria met"
  },
  {
    reasonCode: "N428",
    description: "Not covered when performed during the same session/date as a previously processed service",
    category: "Coding",
    frequency: 58,
    deniedAmount: 890000,
    appealSuccessRate: 28.9,
    preventionTips: "Review bundling rules and modifier usage"
  },
  {
    reasonCode: "N425",
    description: "These services are not covered when performed within this time frame",
    category: "Authorization",
    frequency: 47,
    deniedAmount: 1120000,
    appealSuccessRate: 41.6,
    preventionTips: "Verify frequency limitations and timing restrictions"
  },
  {
    reasonCode: "N393",
    description: "This procedure/service is not covered when performed with other services on the same day",
    category: "Coding",
    frequency: 42,
    deniedAmount: 780000,
    appealSuccessRate: 35.4,
    preventionTips: "Check same-day service restrictions and NCCI edits"
  },
  {
    reasonCode: "M80",
    description: "Not covered unless information showing medical necessity is submitted",
    category: "Documentation",
    frequency: 38,
    deniedAmount: 950000,
    appealSuccessRate: 67.8,
    preventionTips: "Include comprehensive clinical documentation"
  },
  {
    reasonCode: "N394",
    description: "This procedure/service is not covered for this diagnosis",
    category: "Medical Necessity",
    frequency: 34,
    deniedAmount: 640000,
    appealSuccessRate: 44.1,
    preventionTips: "Ensure diagnosis supports medical necessity"
  }
];

const payerDenialPatterns = [
  { payer: "Medicare", denials: 234, rate: 8.2, topReason: "Medical Necessity", color: "#DC2626" },
  { payer: "Medicaid", denials: 189, rate: 12.4, topReason: "Authorization", color: "#EA580C" },
  { payer: "Blue Cross", denials: 156, rate: 6.8, topReason: "Coverage", color: "#2563EB" },
  { payer: "Aetna", denials: 143, rate: 7.3, topReason: "Medical Necessity", color: "#7C3AED" },
  { payer: "UnitedHealth", denials: 138, rate: 5.9, topReason: "Authorization", color: "#059669" },
  { payer: "Humana", denials: 94, rate: 9.1, topReason: "Coverage", color: "#D97706" },
  { payer: "Cigna", denials: 87, rate: 6.4, topReason: "Coding", color: "#DC2626" },
  { payer: "Others", denials: 245, rate: 8.7, topReason: "Mixed", color: "#6B7280" }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded shadow-lg max-w-sm">
        <p className="font-semibold text-gray-900 mb-2">{data.reasonCode}</p>
        <p className="text-sm text-gray-700 mb-2">{data.description}</p>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Frequency:</span> {data.frequency} denials</p>
          <p><span className="font-medium">Denied Amount:</span> ${data.deniedAmount.toLocaleString()}</p>
          <p><span className="font-medium">Appeal Success:</span> {data.appealSuccessRate}%</p>
          <p><span className="font-medium">Category:</span> {data.category}</p>
        </div>
        {data.preventionTips && (
          <div className="mt-2 p-2 bg-blue-50 rounded">
            <p className="text-xs text-blue-800 font-medium">Prevention Tip:</p>
            <p className="text-xs text-blue-700">{data.preventionTips}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function DenialReasonAnalysis() {
  return (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topDenialReasons}
            layout="horizontal"
            margin={{
              top: 20,
              right: 30,
              left: 80,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              type="number"
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              type="category"
              dataKey="reasonCode"
              tick={{ fontSize: 10 }}
              width={70}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="frequency" 
              radius={[0, 4, 4, 0]}
            >
              {topDenialReasons.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.category === "Medical Necessity" ? "#DC2626" :
                    entry.category === "Authorization" ? "#EA580C" :
                    entry.category === "Coverage" ? "#2563EB" :
                    entry.category === "Coding" ? "#D97706" : "#059669"
                  } 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600 text-sm">Most Common</p>
          <p className="font-semibold text-gray-900">{topDenialReasons[0].reasonCode}</p>
          <p className="text-xs text-gray-500">{topDenialReasons[0].frequency} cases</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-green-600 text-sm">Highest Appeal Success</p>
          <p className="font-semibold text-green-900">
            {topDenialReasons.reduce((max, reason) => reason.appealSuccessRate > max.appealSuccessRate ? reason : max).reasonCode}
          </p>
          <p className="text-xs text-green-500">
            {Math.max(...topDenialReasons.map(r => r.appealSuccessRate))}% success
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded">
          <p className="text-red-600 text-sm">Highest Value</p>
          <p className="font-semibold text-red-900">
            {topDenialReasons.reduce((max, reason) => reason.deniedAmount > max.deniedAmount ? reason : max).reasonCode}
          </p>
          <p className="text-xs text-red-500">
            ${(Math.max(...topDenialReasons.map(r => r.deniedAmount)) / 1000000).toFixed(1)}M denied
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-blue-600 text-sm">Total Reasons</p>
          <p className="font-semibold text-blue-900">{topDenialReasons.length}</p>
          <p className="text-xs text-blue-500">Top denial codes</p>
        </div>
      </div>
    </div>
  );
}

export function PayerDenialPatterns() {
  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={payerDenialPatterns}
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
              height={80}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'denials' ? `${value} denials` : `${value}%`,
                name === 'denials' ? 'Total Denials' : 'Denial Rate'
              ]}
              labelStyle={{ color: '#374151' }}
            />
            <Bar 
              dataKey="denials" 
              radius={[4, 4, 0, 0]}
            >
              {payerDenialPatterns.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payer Details Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Denials
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Denial Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Top Reason
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payerDenialPatterns.map((payer, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-3"
                      style={{ backgroundColor: payer.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{payer.payer}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payer.denials}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    payer.rate > 10 ? 'text-red-600' : 
                    payer.rate > 8 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {payer.rate}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payer.topReason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}