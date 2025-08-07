import { useState } from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { ClaimsModal } from "@/components/claims-modal";

interface MatrixData {
  documentType: string;
  medicare: { count: number; rate: number };
  medicaid: { count: number; rate: number };
  bcbs: { count: number; rate: number };
  commercial: { count: number; rate: number };
}

const matrixData: MatrixData[] = [
  {
    documentType: "Medical Records",
    medicare: { count: 23, rate: 45 },
    medicaid: { count: 18, rate: 32 },
    bcbs: { count: 31, rate: 67 },
    commercial: { count: 12, rate: 15 },
  },
  {
    documentType: "Prior Authorization",
    medicare: { count: 15, rate: 28 },
    medicaid: { count: 22, rate: 41 },
    bcbs: { count: 8, rate: 18 },
    commercial: { count: 19, rate: 35 },
  },
  {
    documentType: "Physician Notes",
    medicare: { count: 9, rate: 12 },
    medicaid: { count: 14, rate: 29 },
    bcbs: { count: 27, rate: 52 },
    commercial: { count: 11, rate: 21 },
  },
  {
    documentType: "Lab Results",
    medicare: { count: 17, rate: 31 },
    medicaid: { count: 35, rate: 58 },
    bcbs: { count: 16, rate: 34 },
    commercial: { count: 7, rate: 19 },
  },
  {
    documentType: "Imaging",
    medicare: { count: 5, rate: 11 },
    medicaid: { count: 12, rate: 26 },
    bcbs: { count: 14, rate: 31 },
    commercial: { count: 8, rate: 17 },
  },
  {
    documentType: "Operative Reports",
    medicare: { count: 13, rate: 29 },
    medicaid: { count: 6, rate: 14 },
    bcbs: { count: 42, rate: 73 },
    commercial: { count: 15, rate: 28 },
  },
];

function getCellStyle(rate: number) {
  if (rate >= 60) return "heat-map-cell-high";
  if (rate >= 30) return "heat-map-cell-medium";
  return "heat-map-cell-low";
}

function MatrixCell({ 
  count, 
  rate, 
  documentType, 
  payer, 
  onClick 
}: { 
  count: number; 
  rate: number; 
  documentType: string; 
  payer: string; 
  onClick: () => void; 
}) {
  return (
    <td 
      className={`px-3 py-2 text-center text-sm ${getCellStyle(rate)} cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 hover:shadow-md relative group`}
      data-testid={`matrix-cell-${count}-${rate}`}
      onClick={onClick}
      title={`Click to view ${count} ${documentType} claims for ${payer}`}
    >
      <div className="relative">
        {count} ({rate}%)
        <div className="absolute inset-0 bg-white bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded"></div>
      </div>
    </td>
  );
}

export function RedundancyMatrix() {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    documentType: string;
    payer: string;
    count: number;
    rate: number;
  }>({
    isOpen: false,
    documentType: "",
    payer: "",
    count: 0,
    rate: 0
  });

  const handleCellClick = (documentType: string, payer: string, count: number, rate: number) => {
    setModalConfig({
      isOpen: true,
      documentType,
      payer,
      count,
      rate
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Heat Map */}
        <div className="lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicare
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicaid
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BCBS
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commercial
                </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matrixData.map((row, index) => (
                  <tr key={index}>
                  <td className="px-3 py-2 text-sm font-medium text-gray-900">
                    {row.documentType}
                  </td>
                  <MatrixCell 
                    count={row.medicare.count} 
                    rate={row.medicare.rate} 
                    documentType={row.documentType}
                    payer="Medicare"
                    onClick={() => handleCellClick(row.documentType, "Medicare", row.medicare.count, row.medicare.rate)}
                  />
                  <MatrixCell 
                    count={row.medicaid.count} 
                    rate={row.medicaid.rate} 
                    documentType={row.documentType}
                    payer="Medicaid"
                    onClick={() => handleCellClick(row.documentType, "Medicaid", row.medicaid.count, row.medicaid.rate)}
                  />
                  <MatrixCell 
                    count={row.bcbs.count} 
                    rate={row.bcbs.rate} 
                    documentType={row.documentType}
                    payer="BCBS"
                    onClick={() => handleCellClick(row.documentType, "BCBS", row.bcbs.count, row.bcbs.rate)}
                  />
                  <MatrixCell 
                    count={row.commercial.count} 
                    rate={row.commercial.rate} 
                    documentType={row.documentType}
                    payer="Commercial"
                    onClick={() => handleCellClick(row.documentType, "Commercial", row.commercial.count, row.commercial.rate)}
                  />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pattern Analysis Panel */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-3" data-testid="pattern-alert">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">PATTERN ALERT</p>
                <p className="text-xs text-red-700 mt-1">
                  BCBS requesting operative reports 73% already submitted
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3" data-testid="trend-alert">
            <div className="flex items-start">
              <TrendingUp className="h-4 w-4 text-yellow-400 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">TREND</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Medicaid lab result requests up 45% this month
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Claims Modal */}
      <ClaimsModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        documentType={modalConfig.documentType}
        payer={modalConfig.payer}
        count={modalConfig.count}
        rate={modalConfig.rate}
      />
    </>
  );
}
