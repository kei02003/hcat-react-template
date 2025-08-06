import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const forecastData = [
  { 
    period: "Current Week", 
    actual: 18, 
    predicted: null,
    confidence: null
  },
  { 
    period: "Next Week", 
    actual: null, 
    predicted: 23,
    confidence: 82.3
  },
  { 
    period: "Week 3", 
    actual: null, 
    predicted: 19,
    confidence: 78.1
  },
  { 
    period: "Week 4", 
    actual: null, 
    predicted: 26,
    confidence: 75.4
  },
  { 
    period: "Next Month Total", 
    actual: null, 
    predicted: 98,
    confidence: 78.6
  }
];

const departmentForecast = [
  { department: "Orthopedics", predicted: 38, current: 32, trend: "up" },
  { department: "Surgery", predicted: 28, current: 24, trend: "up" },
  { department: "Cardiology", predicted: 22, current: 19, trend: "up" },
  { department: "Emergency", predicted: 10, current: 12, trend: "down" }
];

export function DenialForecastChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Denial Forecast Timeline */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Denial Forecast Timeline</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-semibold">{label}</p>
                        {payload.map((entry, index) => {
                          if (entry.value !== null) {
                            const data = entry.payload;
                            return (
                              <div key={index}>
                                <p className="text-sm" style={{ color: entry.color }}>
                                  {entry.name}: {entry.value}
                                </p>
                                {data.confidence && (
                                  <p className="text-xs text-gray-500">
                                    Confidence: {data.confidence}%
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#16A34A" 
                name="Actual Denials"
                strokeWidth={2}
                dot={{ fill: '#16A34A', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#DC2626" 
                strokeDasharray="5 5"
                name="Predicted Denials"
                strokeWidth={2}
                dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Forecast */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Department Forecast (Next Month)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="department" 
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="current" 
                fill="hsl(207, 90%, 54%)" 
                name="Current Month"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="predicted" 
                fill="hsl(0, 84%, 60%)" 
                name="Predicted"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Trend Indicators */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {departmentForecast.map((dept, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">{dept.department}</span>
              <div className="flex items-center space-x-1">
                <span className={dept.trend === 'up' ? 'text-red-600' : 'text-green-600'}>
                  {dept.trend === 'up' ? '↗' : '↘'}
                </span>
                <span className="text-xs">
                  {dept.trend === 'up' ? '+' : ''}{dept.predicted - dept.current}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}