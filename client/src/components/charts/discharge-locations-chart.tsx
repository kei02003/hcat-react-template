import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, Users } from 'lucide-react';

const dischargeLocationData = [
  {
    location: "Oncology Wing",
    systemPoint: "System Point",
    balance: 866724.94,
    worse: false,
    better: true,
    directionOfGood: true,
    forecast: 900000,
    cluster: "A"
  },
  {
    location: "Outpatient Plaza", 
    systemPoint: "System Point",
    balance: 534821.45,
    worse: true,
    better: false,
    directionOfGood: false,
    forecast: 480000,
    cluster: "B"
  },
  {
    location: "Outpatient Center",
    systemPoint: "System Point", 
    balance: 423156.78,
    worse: false,
    better: false,
    directionOfGood: true,
    forecast: 420000,
    cluster: "B"
  },
  {
    location: "Day Surgery Center",
    systemPoint: "System Point",
    balance: 398234.56,
    worse: true,
    better: false,
    directionOfGood: false,
    forecast: 350000,
    cluster: "C"
  },
  {
    location: "Main Hospital",
    systemPoint: "System Point",
    balance: 312567.89,
    worse: false,
    better: true,
    directionOfGood: true,
    forecast: 340000,
    cluster: "A"
  },
  {
    location: "Second Floor",
    systemPoint: "System Point",
    balance: 287943.12,
    worse: true,
    better: false,
    directionOfGood: false,
    forecast: 250000,
    cluster: "C"
  },
  {
    location: "Medical Floor",
    systemPoint: "System Point",
    balance: 245678.34,
    worse: false,
    better: true,
    directionOfGood: true,
    forecast: 260000,
    cluster: "B"
  },
  {
    location: "North Wing",
    systemPoint: "System Point",
    balance: 198456.78,
    worse: true,
    better: false,
    directionOfGood: false,
    forecast: 180000,
    cluster: "C"
  },
  {
    location: "South Tower",
    systemPoint: "System Point",
    balance: 156789.23,
    worse: false,
    better: false,
    directionOfGood: true,
    forecast: 155000,
    cluster: "B"
  }
];

const getBarColor = (item: any) => {
  if (item.worse) return "#DC2626"; // Red for worse performance
  if (item.better) return "#16A34A"; // Green for better performance
  return "#6B7280"; // Gray for neutral
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{data.systemPoint}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm">
            <span className="font-medium">Current Balance:</span> ${data.balance.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Forecast:</span> ${data.forecast.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Cluster:</span> {data.cluster}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            {data.worse && (
              <div className="flex items-center space-x-1 text-red-600">
                <TrendingDown className="h-3 w-3" />
                <span className="text-xs">Worse</span>
              </div>
            )}
            {data.better && (
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">Better</span>
              </div>
            )}
            {data.directionOfGood && (
              <div className="flex items-center space-x-1 text-blue-600">
                <Target className="h-3 w-3" />
                <span className="text-xs">Direction of Good</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function DischargeLocationsChart() {
  // Debug: Log the data to ensure it's properly loaded
  console.log('DischargeLocationsChart data:', dischargeLocationData);
  
  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dischargeLocationData}
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
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              axisLine={{ stroke: '#E2E8F0' }}
              domain={[0, 'dataMax']}
            />
            <YAxis 
              type="category"
              dataKey="location"
              tick={{ fontSize: 10 }}
              width={110}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="balance" 
              radius={[0, 2, 2, 0]}
              minPointSize={5}
              fill="#8884d8"
            >
              {dischargeLocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-red-600" />
          <TrendingDown className="h-4 w-4 text-red-600" />
          <span>Worse</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-green-600" />
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span>Better</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <Target className="h-4 w-4 text-blue-600" />
          <span>Direction of Good</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-gray-600" />
          <span>Forecast</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-purple-600" />
          <span>Cluster</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Total Balance</p>
          <p className="font-semibold text-blue-600">
            ${dischargeLocationData.reduce((sum, item) => sum + item.balance, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Locations</p>
          <p className="font-semibold">{dischargeLocationData.length}</p>
        </div>
        <div className="bg-red-50 p-3 rounded">
          <p className="text-red-600">Worse Performing</p>
          <p className="font-semibold text-red-600">
            {dischargeLocationData.filter(item => item.worse).length}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-green-600">Better Performing</p>
          <p className="font-semibold text-green-600">
            {dischargeLocationData.filter(item => item.better).length}
          </p>
        </div>
      </div>
    </div>
  );
}