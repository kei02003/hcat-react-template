import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const agingPercentageData = [
  { category: "0-30", percentage: 37.0, color: "#10B981" },
  { category: "31-60", percentage: 32.9, color: "#3B82F6" },
  { category: "60-90", percentage: 19.9, color: "#F59E0B" },
  { category: "120+", percentage: 6.6, color: "#EF4444" },
  { category: "90-120", percentage: 3.7, color: "#8B5CF6" }
];

const agingTotalData = [
  { category: "0-30", amount: 16970000, color: "#10B981" },
  { category: "31-60", amount: 15080000, color: "#3B82F6" },
  { category: "60-90", amount: 9130000, color: "#F59E0B" },
  { category: "120+", amount: 3020000, color: "#EF4444" },
  { category: "90-120", amount: 1710000, color: "#8B5CF6" }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const isPercentage = data.dataKey === 'percentage';
    
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold text-gray-900">{label} days</p>
        <p className="text-sm">
          {isPercentage ? (
            <>
              <span className="font-medium">Percentage:</span> {data.value}%
            </>
          ) : (
            <>
              <span className="font-medium">Amount:</span> ${data.value.toLocaleString()}
            </>
          )}
        </p>
      </div>
    );
  }
  return null;
};

export function AgingSubcategoryCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Percentage Chart */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Current Balance % by Aging Sub Category
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={agingPercentageData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="category"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 40]}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="percentage" 
                radius={[4, 4, 0, 0]}
              >
                {agingPercentageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Percentage Summary */}
        <div className="grid grid-cols-5 gap-2 text-xs">
          {agingPercentageData.map((item, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-full h-2 rounded mb-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="font-semibold">{item.percentage}%</div>
              <div className="text-gray-600">{item.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Amount Chart */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Current Balance Total by Aging Sub Category
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={agingTotalData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="category"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                radius={[4, 4, 0, 0]}
              >
                {agingTotalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Amount Labels */}
        <div className="grid grid-cols-5 gap-2 text-xs text-center">
          {agingTotalData.map((item, index) => (
            <div key={index}>
              <div className="font-semibold">
                ${(item.amount / 1000000).toFixed(2)}M
              </div>
              <div className="text-gray-600">{item.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AgingSummaryCards() {
  const totalAmount = agingTotalData.reduce((sum, item) => sum + item.amount, 0);
  const criticalAmount = agingTotalData
    .filter(item => item.category === "90-120" || item.category === "120+")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-600">Total Collections Balance</h4>
        <p className="text-2xl font-bold text-gray-900">${(totalAmount / 1000000).toFixed(1)}M</p>
        <p className="text-sm text-gray-500">All aging categories</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="text-sm font-medium text-green-600">0-30 Days (Current)</h4>
        <p className="text-2xl font-bold text-green-900">
          ${(agingTotalData[0].amount / 1000000).toFixed(1)}M
        </p>
        <p className="text-sm text-green-600">{agingPercentageData[0].percentage}% of total</p>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-600">60-90 Days</h4>
        <p className="text-2xl font-bold text-yellow-900">
          ${(agingTotalData[2].amount / 1000000).toFixed(1)}M
        </p>
        <p className="text-sm text-yellow-600">{agingPercentageData[2].percentage}% of total</p>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h4 className="text-sm font-medium text-red-600">90+ Days (Critical)</h4>
        <p className="text-2xl font-bold text-red-900">
          ${(criticalAmount / 1000000).toFixed(1)}M
        </p>
        <p className="text-sm text-red-600">
          {(agingPercentageData[3].percentage + agingPercentageData[4].percentage).toFixed(1)}% of total
        </p>
      </div>
    </div>
  );
}