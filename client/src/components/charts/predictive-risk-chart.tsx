import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const riskData = [
  {
    claim: "CLM-45825",
    patient: "Brown, M.",
    amount: 18500,
    riskScore: 87.4,
    department: "Orthopedics",
    payer: "BCBS",
    level: "critical"
  },
  {
    claim: "CLM-45826", 
    patient: "Taylor, L.",
    amount: 3250,
    riskScore: 52.3,
    department: "Cardiology",
    payer: "Medicare",
    level: "medium"
  },
  {
    claim: "CLM-45827",
    patient: "Anderson, D.",
    amount: 425,
    riskScore: 15.4,
    department: "Laboratory",
    payer: "Commercial",
    level: "low"
  },
  {
    claim: "CLM-45828",
    patient: "Wilson, K.",
    amount: 12750,
    riskScore: 73.2,
    department: "Surgery",
    payer: "BCBS",
    level: "high"
  },
  {
    claim: "CLM-45829",
    patient: "Johnson, P.",
    amount: 8900,
    riskScore: 41.8,
    department: "Emergency",
    payer: "Medicaid",
    level: "medium"
  }
];

const getRiskColor = (level: string) => {
  switch (level) {
    case "critical": return "#DC2626";
    case "high": return "#EA580C";
    case "medium": return "#D97706";
    case "low": return "#16A34A";
    default: return "#6B7280";
  }
};


export function PredictiveRiskChart() {
  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            data={riskData}
            margin={{
              top: 20,
              right: 30,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              type="number" 
              dataKey="amount" 
              name="Claim Amount"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              type="number" 
              dataKey="riskScore" 
              name="Risk Score"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold">{data.claim}</p>
                      <p className="text-sm text-gray-600">{data.patient}</p>
                      <p className="text-sm">Amount: ${data.amount.toLocaleString()}</p>
                      <p className="text-sm">Risk Score: {data.riskScore}%</p>
                      <p className="text-sm">Department: {data.department}</p>
                      <p className="text-sm">Payer: {data.payer}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter dataKey="riskScore">
              {riskData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getRiskColor(entry.level)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { level: "critical", label: "Critical (80-100)", color: "#DC2626" },
          { level: "high", label: "High (60-79)", color: "#EA580C" },
          { level: "medium", label: "Medium (40-59)", color: "#D97706" },
          { level: "low", label: "Low (0-39)", color: "#16A34A" }
        ].map((item) => (
          <div key={item.level} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}