import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Medicare',
    totalRequests: 85,
    redundantRequests: 26,
  },
  {
    name: 'Medicaid',
    totalRequests: 94,
    redundantRequests: 39,
  },
  {
    name: 'BCBS',
    totalRequests: 117,
    redundantRequests: 85,
  },
  {
    name: 'Commercial',
    totalRequests: 46,
    redundantRequests: 10,
  },
];

export function PayerVolumeChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
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
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Bar 
            dataKey="totalRequests" 
            fill="hsl(207, 90%, 54%)" 
            name="Total Requests"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="redundantRequests" 
            fill="hsl(0, 84%, 60%)" 
            name="Redundant Requests"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
