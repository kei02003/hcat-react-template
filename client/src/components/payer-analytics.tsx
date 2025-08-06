interface PayerCard {
  name: string;
  redundantRate: number;
  topRequest: string;
  avgResponse: string;
  successRate: number;
  revenueImpact: string;
  isWorstOffender?: boolean;
}

const payerData: PayerCard[] = [
  {
    name: "Medicare",
    redundantRate: 31,
    topRequest: "Lab Results",
    avgResponse: "5.2 days",
    successRate: 78,
    revenueImpact: "$23.4K",
  },
  {
    name: "Medicaid",
    redundantRate: 42,
    topRequest: "Medical Records",
    avgResponse: "7.1 days",
    successRate: 65,
    revenueImpact: "$31.7K",
  },
  {
    name: "BCBS",
    redundantRate: 73,
    topRequest: "Operative Reports",
    avgResponse: "8.9 days",
    successRate: 52,
    revenueImpact: "$45.1K",
    isWorstOffender: true,
  },
  {
    name: "Commercial",
    redundantRate: 22,
    topRequest: "Prior Auth",
    avgResponse: "3.8 days",
    successRate: 89,
    revenueImpact: "$12.3K",
  },
];

function getRedundantRateColor(rate: number) {
  if (rate >= 60) return "bg-red-200 text-red-900";
  if (rate >= 40) return "bg-red-100 text-red-800";
  if (rate >= 30) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

function getSuccessRateColor(rate: number) {
  if (rate >= 80) return "text-green-600";
  if (rate >= 65) return "text-yellow-600";
  return "text-red-600";
}

export function PayerAnalytics() {
  return (
    <div className="healthcare-card rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payer Behavior Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {payerData.map((payer, index) => (
          <div 
            key={index}
            className={`border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md ${
              payer.isWorstOffender ? 'payer-card-worst' : ''
            }`}
            data-testid={`payer-card-${payer.name.toLowerCase()}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{payer.name}</h4>
              <span className={`text-xs px-2 py-1 rounded ${getRedundantRateColor(payer.redundantRate)}`}>
                {payer.redundantRate}% Redundant
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Top Request:</span>
                <span className="font-medium">{payer.topRequest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span className="font-medium">{payer.avgResponse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span className={`font-medium ${getSuccessRateColor(payer.successRate)}`}>
                  {payer.successRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Impact:</span>
                <span className="font-medium text-red-600">{payer.revenueImpact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
