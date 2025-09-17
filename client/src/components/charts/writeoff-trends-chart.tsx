import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Cell,
} from "recharts";
import { format, subDays } from "date-fns";
import { useWriteOffFilters } from '../writeoff-filter-context';

const writeOffTrendsData = [
  {
    date: "2024-10-01",
    totalWriteOffs: 45000,
    badDebtAmount: 12000,
    contractualAmount: 18000,
    charityAmount: 8000,
    smallBalanceAmount: 4000,
    promptPayAmount: 3000,
    recoveryAmount: 2500,
    writeOffCount: 128,
    badDebtCount: 32,
    recoveryRate: 20.8,
  },
  {
    date: "2024-10-15",
    totalWriteOffs: 52000,
    badDebtAmount: 15000,
    contractualAmount: 20000,
    charityAmount: 9500,
    smallBalanceAmount: 4500,
    promptPayAmount: 3000,
    recoveryAmount: 3200,
    writeOffCount: 142,
    badDebtCount: 38,
    recoveryRate: 21.3,
  },
  {
    date: "2024-11-01",
    totalWriteOffs: 48000,
    badDebtAmount: 13500,
    contractualAmount: 19000,
    charityAmount: 8500,
    smallBalanceAmount: 4000,
    promptPayAmount: 3000,
    recoveryAmount: 2800,
    writeOffCount: 135,
    badDebtCount: 35,
    recoveryRate: 20.7,
  },
  {
    date: "2024-11-15",
    totalWriteOffs: 55000,
    badDebtAmount: 16000,
    contractualAmount: 22000,
    charityAmount: 10000,
    smallBalanceAmount: 4000,
    promptPayAmount: 3000,
    recoveryAmount: 3400,
    writeOffCount: 156,
    badDebtCount: 42,
    recoveryRate: 21.3,
  },
  {
    date: "2024-12-01",
    totalWriteOffs: 51000,
    badDebtAmount: 14500,
    contractualAmount: 20500,
    charityAmount: 9000,
    smallBalanceAmount: 4000,
    promptPayAmount: 3000,
    recoveryAmount: 3100,
    writeOffCount: 145,
    badDebtCount: 38,
    recoveryRate: 21.4,
  },
  {
    date: "2024-12-15",
    totalWriteOffs: 49000,
    badDebtAmount: 13000,
    contractualAmount: 19500,
    charityAmount: 9500,
    smallBalanceAmount: 4000,
    promptPayAmount: 3000,
    recoveryAmount: 2900,
    writeOffCount: 138,
    badDebtCount: 34,
    recoveryRate: 22.3,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded shadow-lg max-w-xs">
        <p className="font-semibold text-gray-900 mb-2">
          {format(new Date(label), "MMM dd, yyyy")}
        </p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="inline-block w-3 h-3 bg-red-600 rounded mr-2"></span>
            Total Write-Offs: ${(data.totalWriteOffs / 1000).toFixed(0)}K
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-orange-600 rounded mr-2"></span>
            Bad Debt: ${(data.badDebtAmount / 1000).toFixed(0)}K
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-green-600 rounded mr-2"></span>
            Recovery: ${(data.recoveryAmount / 1000).toFixed(0)}K
          </p>
          <div className="border-t pt-1 mt-2">
            <p className="font-medium">Recovery Rate: {data.recoveryRate}%</p>
            <p className="font-medium">Write-Off Count: {data.writeOffCount}</p>
            <p className="font-medium">Bad Debt Count: {data.badDebtCount}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function WriteOffTrendsChart() {
  const { filters, setFilter } = useWriteOffFilters();

  const handleDataPointClick = (data: any) => {
    // Set date filter when clicking on a data point
    const clickedDate = format(new Date(data.date), "yyyy-MM-dd");
    if (filters.dateFrom === clickedDate) {
      setFilter('dateFrom', undefined);
      setFilter('dateTo', undefined);
    } else {
      setFilter('dateFrom', clickedDate);
      setFilter('dateTo', clickedDate);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={writeOffTrendsData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onClick={handleDataPointClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => format(new Date(value), "MM/dd")}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis
              yAxisId="amount"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis
              yAxisId="rate"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />

            <Bar
              yAxisId="amount"
              dataKey="totalWriteOffs"
              fill="#DC2626"
              name="Total Write-Offs"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="amount"
              dataKey="badDebtAmount"
              fill="#EA580C"
              name="Bad Debt"
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="recoveryRate"
              stroke="#6e53a3"
              strokeWidth={3}
              name="Recovery Rate (%)"
              dot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-red-800">
                Total Write-Offs
              </h4>
              <p className="text-xl font-bold text-red-900">
                $
                {(
                  writeOffTrendsData.reduce(
                    (sum, period) => sum + period.totalWriteOffs,
                    0,
                  ) / 1000
                ).toFixed(0)}
                K
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-orange-800">
                Bad Debt %
              </h4>
              <p className="text-xl font-bold text-orange-900">
                {(
                  (writeOffTrendsData.reduce(
                    (sum, period) => sum + period.badDebtAmount,
                    0,
                  ) /
                    writeOffTrendsData.reduce(
                      (sum, period) => sum + period.totalWriteOffs,
                      0,
                    )) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-purple-800">
                Recovery Rate
              </h4>
              <p className="text-xl font-bold text-purple-900">
                {(
                  writeOffTrendsData.reduce(
                    (sum, period) => sum + period.recoveryRate,
                    0,
                  ) / writeOffTrendsData.length
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-green-800">
                Total Recovery
              </h4>
              <p className="text-xl font-bold text-green-900">
                $
                {(
                  writeOffTrendsData.reduce(
                    (sum, period) => sum + period.recoveryAmount,
                    0,
                  ) / 1000
                ).toFixed(0)}
                K
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WriteOffReasonChart() {
  const { filters, setFilter } = useWriteOffFilters();
  
  const handleBarClick = (data: any) => {
    // Toggle the filter - if clicking the same reason, clear it
    if (filters.reason === data.reason) {
      setFilter('reason', undefined);
    } else {
      setFilter('reason', data.reason);
    }
  };

  const reasonData = [
    {
      reason: "contractual",
      displayName: "Contractual",
      amount: writeOffTrendsData.reduce(
        (sum, period) => sum + period.contractualAmount,
        0,
      ),
      percentage: 38.5,
      color: "#3B82F6",
    },
    {
      reason: "bad_debt",
      displayName: "Bad Debt",
      amount: writeOffTrendsData.reduce((sum, period) => sum + period.badDebtAmount, 0),
      percentage: 28.2,
      color: "#EF4444",
    },
    {
      reason: "charity",
      displayName: "Charity Care",
      amount: writeOffTrendsData.reduce((sum, period) => sum + period.charityAmount, 0),
      percentage: 18.1,
      color: "#10B981",
    },
    {
      reason: "small_balance",
      displayName: "Small Balance",
      amount: writeOffTrendsData.reduce((sum, period) => sum + period.smallBalanceAmount, 0),
      percentage: 8.0,
      color: "#F59E0B",
    },
    {
      reason: "prompt_pay",
      displayName: "Prompt Pay",
      amount: writeOffTrendsData.reduce((sum, period) => sum + period.promptPayAmount, 0),
      percentage: 7.2,
      color: "#8B5CF6",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={reasonData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="displayName"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={{ stroke: "#E2E8F0" }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(value: any) => [`$${(value / 1000).toFixed(0)}K`, "Amount"]}
              labelStyle={{ color: "#374151" }}
            />
            <Bar 
              dataKey="amount" 
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              {reasonData.map((entry, index) => {
                const isSelected = filters.reason === entry.reason;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isSelected ? "#1D4ED8" : entry.color}
                    stroke={isSelected ? "#1D4ED8" : "none"}
                    strokeWidth={isSelected ? 2 : 0}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reason Breakdown */}
      <div className="grid grid-cols-5 gap-2 text-sm">
        {reasonData.map((reason, index) => (
          <div key={index} className="text-center">
            <div
              className="w-full h-3 rounded mb-2"
              style={{ backgroundColor: reason.color }}
            />
            <div className="font-semibold">${(reason.amount / 1000).toFixed(0)}K</div>
            <div className="text-gray-600 text-xs">{reason.displayName}</div>
            <div className="text-gray-500 text-xs">{reason.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}