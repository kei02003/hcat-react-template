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
} from "recharts";
import { format, subDays } from "date-fns";

const denialTrendsData = [
  {
    date: "2024-11-01",
    totalDenials: 145,
    deniedAmount: 2850000,
    appealedDenials: 89,
    overturnedDenials: 34,
    recoveredAmount: 890000,
    overturnRate: 38.2,
    medicalNecessity: 52,
    authorization: 31,
    coverage: 28,
    coding: 19,
    documentation: 15,
  },
  {
    date: "2024-11-02",
    totalDenials: 132,
    deniedAmount: 2650000,
    appealedDenials: 78,
    overturnedDenials: 31,
    recoveredAmount: 820000,
    overturnRate: 39.7,
    medicalNecessity: 48,
    authorization: 29,
    coverage: 25,
    coding: 18,
    documentation: 12,
  },
  {
    date: "2024-11-03",
    totalDenials: 159,
    deniedAmount: 3120000,
    appealedDenials: 95,
    overturnedDenials: 41,
    recoveredAmount: 1050000,
    overturnRate: 43.2,
    medicalNecessity: 58,
    authorization: 35,
    coverage: 31,
    coding: 22,
    documentation: 13,
  },
  {
    date: "2024-11-04",
    totalDenials: 168,
    deniedAmount: 3380000,
    appealedDenials: 102,
    overturnedDenials: 38,
    recoveredAmount: 980000,
    overturnRate: 37.3,
    medicalNecessity: 63,
    authorization: 37,
    coverage: 33,
    coding: 21,
    documentation: 14,
  },
  {
    date: "2024-11-05",
    totalDenials: 143,
    deniedAmount: 2890000,
    appealedDenials: 86,
    overturnedDenials: 36,
    recoveredAmount: 920000,
    overturnRate: 41.9,
    medicalNecessity: 51,
    authorization: 32,
    coverage: 27,
    coding: 20,
    documentation: 13,
  },
  {
    date: "2024-11-06",
    totalDenials: 177,
    deniedAmount: 3560000,
    appealedDenials: 108,
    overturnedDenials: 45,
    recoveredAmount: 1180000,
    overturnRate: 41.7,
    medicalNecessity: 66,
    authorization: 39,
    coverage: 34,
    coding: 23,
    documentation: 15,
  },
  {
    date: "2024-11-07",
    totalDenials: 154,
    deniedAmount: 3020000,
    appealedDenials: 92,
    overturnedDenials: 40,
    recoveredAmount: 1020000,
    overturnRate: 43.5,
    medicalNecessity: 55,
    authorization: 34,
    coverage: 29,
    coding: 21,
    documentation: 15,
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
            <span className="inline-block w-3 h-3 bg-primary rounded mr-2"></span>
            Total Denials: {data.totalDenials}
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-healthcare-primary rounded mr-2"></span>
            Appealed: {data.appealedDenials}
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-healthcare-success rounded mr-2"></span>
            Overturned: {data.overturnedDenials}
          </p>
          <div className="border-t pt-1 mt-2">
            <p className="font-medium">Overturn Rate: {data.overturnRate}%</p>
            <p className="font-medium">
              Denied Amount: ${(data.deniedAmount / 1000000).toFixed(1)}M
            </p>
            <p className="font-medium">
              Recovered: ${(data.recoveredAmount / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function DenialTrendsChart() {
  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={denialTrendsData}
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
              tickFormatter={(value) => format(new Date(value), "MM/dd")}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis
              yAxisId="count"
              tick={{ fontSize: 12 }}
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
              yAxisId="count"
              dataKey="totalDenials"
              fill="#DC2626"
              name="Total Denials"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="count"
              dataKey="appealedDenials"
              fill="#00aeff"
              name="Appealed Denials"
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="overturnRate"
              stroke="#6e53a3"
              strokeWidth={3}
              name="Overturn Rate (%)"
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
                Daily Average Denials
              </h4>
              <p className="text-xl font-bold text-red-900">
                {Math.round(
                  denialTrendsData.reduce(
                    (sum, day) => sum + day.totalDenials,
                    0,
                  ) / denialTrendsData.length,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-blue-800">
                Appeal Rate
              </h4>
              <p className="text-xl font-bold text-blue-900">
                {(
                  (denialTrendsData.reduce(
                    (sum, day) => sum + day.appealedDenials,
                    0,
                  ) /
                    denialTrendsData.reduce(
                      (sum, day) => sum + day.totalDenials,
                      0,
                    )) *
                  100
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
                Average Overturn Rate
              </h4>
              <p className="text-xl font-bold text-green-900">
                {(
                  denialTrendsData.reduce(
                    (sum, day) => sum + day.overturnRate,
                    0,
                  ) / denialTrendsData.length
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-yellow-800">
                Total Recovered
              </h4>
              <p className="text-xl font-bold text-yellow-900">
                $
                {(
                  denialTrendsData.reduce(
                    (sum, day) => sum + day.recoveredAmount,
                    0,
                  ) / 1000000
                ).toFixed(1)}
                M
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DenialCategoryChart() {
  const categoryData = [
    {
      category: "Medical Necessity",
      count: denialTrendsData.reduce(
        (sum, day) => sum + day.medicalNecessity,
        0,
      ),
      percentage: 40.2,
      color: "#DC2626",
    },
    {
      category: "Authorization",
      count: denialTrendsData.reduce((sum, day) => sum + day.authorization, 0),
      percentage: 24.8,
      color: "#EA580C",
    },
    {
      category: "Coverage",
      count: denialTrendsData.reduce((sum, day) => sum + day.coverage, 0),
      percentage: 19.6,
      color: "#D97706",
    },
    {
      category: "Coding",
      count: denialTrendsData.reduce((sum, day) => sum + day.coding, 0),
      percentage: 14.1,
      color: "#CA8A04",
    },
    {
      category: "Documentation",
      count: denialTrendsData.reduce((sum, day) => sum + day.documentation, 0),
      percentage: 9.3,
      color: "#65A30D",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
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
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
              axisLine={{ stroke: "#E2E8F0" }}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#E2E8F0" }} />
            <Tooltip
              formatter={(value: any, name: string) => [value, "Count"]}
              labelStyle={{ color: "#374151" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#8884d8">
              {categoryData.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-5 gap-2 text-sm">
        {categoryData.map((category, index) => (
          <div key={index} className="text-center">
            <div
              className="w-full h-3 rounded mb-2"
              style={{ backgroundColor: category.color }}
            />
            <div className="font-semibold">{category.count}</div>
            <div className="text-gray-600 text-xs">{category.category}</div>
            <div className="text-gray-500 text-xs">{category.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
