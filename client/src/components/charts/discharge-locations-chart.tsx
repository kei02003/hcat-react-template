import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const dischargeLocationData = [
  {
    location: "Oncology Wing",
    balance: 866724,
    target: 800000,
    performance: "above",
    shortName: "Oncology"
  },
  {
    location: "Outpatient Plaza", 
    balance: 534821,
    target: 480000,
    performance: "above",
    shortName: "Out Plaza"
  },
  {
    location: "Outpatient Center",
    balance: 423157,
    target: 420000,
    performance: "at_target",
    shortName: "Out Center"
  },
  {
    location: "Day Surgery Center",
    balance: 398235,
    target: 350000,
    performance: "above",
    shortName: "Day Surgery"
  },
  {
    location: "Main Hospital",
    balance: 312568,
    target: 340000,
    performance: "below",
    shortName: "Main Hosp"
  },
  {
    location: "Second Floor",
    balance: 287943,
    target: 250000,
    performance: "above",
    shortName: "2nd Floor"
  },
  {
    location: "Medical Floor",
    balance: 245678,
    target: 260000,
    performance: "below",
    shortName: "Med Floor"
  },
  {
    location: "North Wing",
    balance: 198457,
    target: 180000,
    performance: "above",
    shortName: "North Wing"
  },
  {
    location: "South Tower",
    balance: 156789,
    target: 155000,
    performance: "at_target",
    shortName: "South Tower"
  }
].sort((a, b) => b.balance - a.balance);

const getBarColor = (item: any) => {
  if (item.performance === "above") return "#DC2626"; // Red for above target (concerning in collections)
  if (item.performance === "below") return "#16A34A"; // Green for below target (good in collections)
  return "#F59E0B"; // Amber for at target
};

const getPerformanceIcon = (performance: string) => {
  switch (performance) {
    case "above": return <AlertTriangle className="h-3 w-3 text-red-600" />;
    case "below": return <TrendingDown className="h-3 w-3 text-green-600" />;
    case "at_target": return <TrendingUp className="h-3 w-3 text-amber-600" />;
    default: return null;
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const variance = data.balance - data.target;
    const variancePercent = ((variance / data.target) * 100).toFixed(1);
    
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{data.location}</p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Current Balance:</span> <span className="text-blue-600">${data.balance.toLocaleString()}</span>
          </p>
          <p>
            <span className="font-medium">Target:</span> <span className="text-gray-600">${data.target.toLocaleString()}</span>
          </p>
          <p className={`flex items-center space-x-1 ${
            variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-amber-600'
          }`}>
            {getPerformanceIcon(data.performance)}
            <span className="font-medium">
              {variance > 0 ? '+' : ''}${variance.toLocaleString()} ({variancePercent}%)
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function DischargeLocationsChart() {
  const averageTarget = dischargeLocationData.reduce((sum, item) => sum + item.target, 0) / dischargeLocationData.length;
  
  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dischargeLocationData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="shortName"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
              axisLine={{ stroke: '#D1D5DB' }}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              axisLine={{ stroke: '#D1D5DB' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={averageTarget} 
              stroke="#6B7280" 
              strokeDasharray="5 5" 
              label={{ value: "Average Target", fontSize: 10 }}
            />
            <Bar 
              dataKey="balance" 
              radius={[4, 4, 0, 0]}
              fill="#3B82F6"
            >
              {dischargeLocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Legend */}
      <div className="flex flex-wrap gap-6 justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-red-600" />
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span>Above Target (Needs Attention)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-green-600" />
          <TrendingDown className="h-4 w-4 text-green-600" />
          <span>Below Target (Good Performance)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <TrendingUp className="h-4 w-4 text-amber-600" />
          <span>At Target</span>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-blue-700 font-medium">Total Balance</p>
          <p className="font-bold text-blue-900">
            ${dischargeLocationData.reduce((sum, item) => sum + item.balance, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-700 font-medium">Locations</p>
          <p className="font-bold text-gray-900">{dischargeLocationData.length}</p>
        </div>
        <div className="bg-red-50 p-3 rounded">
          <p className="text-red-700 font-medium">Above Target</p>
          <p className="font-bold text-red-900">
            {dischargeLocationData.filter(item => item.performance === "above").length}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-green-700 font-medium">Below Target</p>
          <p className="font-bold text-green-900">
            {dischargeLocationData.filter(item => item.performance === "below").length}
          </p>
        </div>
      </div>
    </div>
  );
}