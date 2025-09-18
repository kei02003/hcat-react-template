import {
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
import { format } from "date-fns";
import { useWriteOffFilters } from '../writeoff-filter-context';


// Data aggregation functions
const aggregateDataByGroup = (data: any[], groupBy: string) => {
  if (groupBy === "month") {
    // Aggregate data by month from actual filtered data
    const dateGroups = data.reduce((acc, item) => {
      const date = item.writeOffDate || item.date || new Date().toISOString().split('T')[0];
      const dateKey = date.split('T')[0].substring(0, 7); // Extract YYYY-MM for monthly grouping
      const amount = item.writeOffAmount || item.amount || 0;
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey + '-01', // Use first day of month for chart compatibility
          totalWriteOffs: 0,
          badDebtAmount: 0,
          contractualAmount: 0,
          charityAmount: 0,
          smallBalanceAmount: 0,
          promptPayAmount: 0,
          recoveryAmount: 0,
          writeOffCount: 0,
          badDebtCount: 0,
        };
      }
      
      acc[dateKey].totalWriteOffs += amount;
      acc[dateKey].writeOffCount += 1;
      acc[dateKey].recoveryAmount += item.recoveryAmount || 0;
      
      // Categorize by reason
      switch (item.reason) {
        case "bad_debt":
          acc[dateKey].badDebtAmount += amount;
          acc[dateKey].badDebtCount += 1;
          break;
        case "contractual":
          acc[dateKey].contractualAmount += amount;
          break;
        case "charity":
          acc[dateKey].charityAmount += amount;
          break;
        case "small_balance":
          acc[dateKey].smallBalanceAmount += amount;
          break;
        case "prompt_pay":
          acc[dateKey].promptPayAmount += amount;
          break;
      }
      
      return acc;
    }, {});
    
    // Convert to array, sort by date, and add recovery rate
    return Object.values(dateGroups)
      .map((group: any) => ({
        ...group,
        recoveryRate: group.totalWriteOffs > 0 ? 
          ((group.recoveryAmount / group.totalWriteOffs) * 100) : 0,
      }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const grouped = data.reduce((acc, item) => {
    let key = "";
    switch (groupBy) {
      case "site":
        key = item.site || "Unknown Site";
        break;
      case "department":
        key = item.department || "Unknown Department";
        break;
      case "payer":
        key = item.payerName || "Unknown Payer";
        break;
      default:
        key = "All";
    }

    if (!acc[key]) {
      acc[key] = {
        name: key,
        totalWriteOffs: 0,
        badDebtAmount: 0,
        contractualAmount: 0,
        charityAmount: 0,
        smallBalanceAmount: 0,
        promptPayAmount: 0,
        recoveryAmount: 0,
        writeOffCount: 0,
        badDebtCount: 0,
      };
    }

    acc[key].totalWriteOffs += item.amount || item.writeOffAmount || 0;
    acc[key].writeOffCount += 1;
    
    // Categorize by reason
    const amount = item.amount || item.writeOffAmount || 0;
    switch (item.reason) {
      case "bad_debt":
        acc[key].badDebtAmount += amount;
        acc[key].badDebtCount += 1;
        break;
      case "contractual":
        acc[key].contractualAmount += amount;
        break;
      case "charity":
        acc[key].charityAmount += amount;
        break;
      case "small_balance":
        acc[key].smallBalanceAmount += amount;
        break;
      case "prompt_pay":
        acc[key].promptPayAmount += amount;
        break;
    }

    acc[key].recoveryAmount += item.recoveryAmount || 0;

    return acc;
  }, {});

  // Convert to array and add recovery rate calculation
  return Object.values(grouped).map((group: any) => ({
    ...group,
    recoveryRate: group.totalWriteOffs > 0 ? 
      ((group.recoveryAmount / group.totalWriteOffs) * 100) : 0,
  }));
};


const CustomTooltip = ({ active, payload, label, groupBy }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded shadow-lg max-w-xs">
        <p className="font-semibold text-gray-900 mb-2">
          {groupBy === "month" ? format(new Date(label), "MMM yyyy") : label}
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

interface WriteOffTrendsChartProps {
  groupBy?: string;
  data?: any[];
}

export function WriteOffTrendsChart({ groupBy = "month", data = [] }: WriteOffTrendsChartProps) {
  const { filters, setFilter } = useWriteOffFilters();

  // Get chart data based on groupBy option
  const chartData = aggregateDataByGroup(data, groupBy);

  const handleDataPointClick = (data: any, index: number) => {
    if (groupBy === "month" && data && data.date) {
      // Set date filter for the entire month when clicking on a data point in month view
      const clickedMonth = new Date(data.date);
      const startOfMonthDate = format(new Date(clickedMonth.getFullYear(), clickedMonth.getMonth(), 1), "yyyy-MM-dd");
      const endOfMonthDate = format(new Date(clickedMonth.getFullYear(), clickedMonth.getMonth() + 1, 0), "yyyy-MM-dd");
      
      if (filters.dateFrom === startOfMonthDate && filters.dateTo === endOfMonthDate) {
        // Clear filters if clicking the same month
        setFilter('dateFrom', undefined);
        setFilter('dateTo', undefined);
      } else {
        // Set filters for the entire month
        setFilter('dateFrom', startOfMonthDate);
        setFilter('dateTo', endOfMonthDate);
      }
    } else if (data && data.name) {
      // Set appropriate filter for category groupings (site filtering handled at dashboard level)
      switch (groupBy) {
        case "department":
          setFilter('department', data.name === filters.department ? undefined : data.name);
          break;
        case "payer":
          setFilter('payer', data.name === filters.payer ? undefined : data.name);
          break;
        // Note: site filtering is handled at dashboard level, not in chart context
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: groupBy === "month" ? 5 : 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey={groupBy === "month" ? "date" : "name"}
              tick={{ fontSize: 11 }}
              tickFormatter={groupBy === "month" ? 
                (value) => format(new Date(value), "MMM yyyy") : 
                undefined
              }
              angle={groupBy === "month" ? 0 : -45}
              textAnchor={groupBy === "month" ? "middle" : "end"}
              height={groupBy === "month" ? 30 : 80}
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
            <Tooltip content={<CustomTooltip groupBy={groupBy} />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />

            <Bar
              yAxisId="amount"
              dataKey="totalWriteOffs"
              fill="#DC2626"
              name="Total Write-Offs"
              radius={[2, 2, 0, 0]}
              onClick={handleDataPointClick}
              style={{ cursor: 'pointer' }}
            />
            <Bar
              yAxisId="amount"
              dataKey="badDebtAmount"
              fill="#EA580C"
              name="Bad Debt"
              radius={[2, 2, 0, 0]}
              onClick={handleDataPointClick}
              style={{ cursor: 'pointer' }}
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
                  chartData.reduce(
                    (sum, period) => sum + (period.totalWriteOffs || 0),
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
                  (chartData.reduce(
                    (sum, period) => sum + (period.badDebtAmount || 0),
                    0,
                  ) /
                    chartData.reduce(
                      (sum, period) => sum + (period.totalWriteOffs || 0),
                      0,
                    )) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#6e53a3]/10 border-l-4 border-[#6e53a3] p-3 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#6e53a3]">
                Recovery Rate
              </h4>
              <p className="text-xl font-bold text-[#6e53a3]">
                {(
                  chartData.reduce(
                    (sum, period) => sum + (period.recoveryRate || 0),
                    0,
                  ) / (chartData.length || 1)
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
                  chartData.reduce(
                    (sum, period) => sum + (period.recoveryAmount || 0),
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

interface WriteOffReasonChartProps {
  groupBy?: string;
  data?: any[];
}

export function WriteOffReasonChart({ groupBy = "month", data = [] }: WriteOffReasonChartProps) {
  const { filters, setFilter } = useWriteOffFilters();
  
  const handleBarClick = (data: any) => {
    // Toggle the filter - if clicking the same reason, clear it
    if (filters.reason === data.reason) {
      setFilter('reason', undefined);
    } else {
      setFilter('reason', data.reason);
    }
  };

  // Aggregate data by reason from actual filtered data
  const reasonAggregation = data.reduce((acc, item) => {
    const reason = item.reason || 'unknown';
    const amount = item.writeOffAmount || item.amount || 0;
    
    if (!acc[reason]) {
      acc[reason] = {
        totalAmount: 0,
        count: 0
      };
    }
    
    acc[reason].totalAmount += amount;
    acc[reason].count += 1;
    
    return acc;
  }, {});

  const totalAmount = Object.values(reasonAggregation).reduce((sum: number, group: any) => sum + group.totalAmount, 0);

  const reasonData = [
    {
      reason: "contractual",
      displayName: "Contractual",
      amount: reasonAggregation.contractual?.totalAmount || 0,
      percentage: totalAmount > 0 ? ((reasonAggregation.contractual?.totalAmount || 0) / totalAmount * 100) : 0,
      color: "#3B82F6",
    },
    {
      reason: "bad_debt",
      displayName: "Bad Debt",
      amount: reasonAggregation.bad_debt?.totalAmount || 0,
      percentage: totalAmount > 0 ? ((reasonAggregation.bad_debt?.totalAmount || 0) / totalAmount * 100) : 0,
      color: "#EF4444",
    },
    {
      reason: "charity",
      displayName: "Charity Care",
      amount: reasonAggregation.charity?.totalAmount || 0,
      percentage: totalAmount > 0 ? ((reasonAggregation.charity?.totalAmount || 0) / totalAmount * 100) : 0,
      color: "#10B981",
    },
    {
      reason: "small_balance",
      displayName: "Small Balance",
      amount: reasonAggregation.small_balance?.totalAmount || 0,
      percentage: totalAmount > 0 ? ((reasonAggregation.small_balance?.totalAmount || 0) / totalAmount * 100) : 0,
      color: "#F59E0B",
    },
    {
      reason: "prompt_pay",
      displayName: "Prompt Pay",
      amount: reasonAggregation.prompt_pay?.totalAmount || 0,
      percentage: totalAmount > 0 ? ((reasonAggregation.prompt_pay?.totalAmount || 0) / totalAmount * 100) : 0,
      color: "#6e53a3",
    },
  ].filter(item => item.amount > 0); // Only show categories with data

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