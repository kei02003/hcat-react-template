import { Check, X, AlertTriangle, ArrowRight, FileText, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackerItem {
  claimId: string;
  patient: string;
  payer: string;
  requestDate: string;
  documentType: string;
  originalSubmission: string;
  status: "already_submitted" | "new_required" | "partial_match" | "auto_response";
}

const trackerData: TrackerItem[] = [
  {
    claimId: "CLM-45821",
    patient: "Smith, John",
    payer: "BCBS",
    requestDate: "2024-12-20",
    documentType: "Operative Report",
    originalSubmission: "2024-11-15",
    status: "already_submitted",
  },
  {
    claimId: "CLM-45822",
    patient: "Johnson, Mary",
    payer: "Medicare",
    requestDate: "2024-12-19",
    documentType: "Lab Results",
    originalSubmission: "-",
    status: "new_required",
  },
  {
    claimId: "CLM-45823",
    patient: "Davis, Robert",
    payer: "Medicaid",
    requestDate: "2024-12-18",
    documentType: "Physician Notes",
    originalSubmission: "2024-12-01",
    status: "partial_match",
  },
  {
    claimId: "CLM-45824",
    patient: "Wilson, Sarah",
    payer: "Commercial",
    requestDate: "2024-12-17",
    documentType: "Prior Auth",
    originalSubmission: "2024-11-28",
    status: "auto_response",
  },
];

function getStatusDisplay(status: string) {
  switch (status) {
    case "already_submitted":
      return {
        icon: <Check className="h-3 w-3" />,
        text: "Already Submitted",
        className: "status-indicator-green",
      };
    case "new_required":
      return {
        icon: <X className="h-3 w-3" />,
        text: "New Required",
        className: "status-indicator-red",
      };
    case "partial_match":
      return {
        icon: <AlertTriangle className="h-3 w-3" />,
        text: "Partial Match",
        className: "status-indicator-yellow",
      };
    case "auto_response":
      return {
        icon: <ArrowRight className="h-3 w-3" />,
        text: "Auto-Response",
        className: "status-indicator-blue",
      };
    default:
      return {
        icon: <AlertTriangle className="h-3 w-3" />,
        text: "Unknown",
        className: "bg-gray-100 text-gray-800",
      };
  }
}

function getActionIcon(status: string) {
  switch (status) {
    case "already_submitted":
      return <FileText className="h-4 w-4 text-blue-600 hover:text-blue-800" />;
    case "new_required":
      return <Edit className="h-4 w-4 text-yellow-600 hover:text-yellow-800" />;
    case "partial_match":
      return <Search className="h-4 w-4 text-gray-500 hover:text-gray-700" />;
    case "auto_response":
      return <Check className="h-4 w-4 text-green-600 hover:text-green-800" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
}

export function DocumentationTracker() {
  return (
    <div className="healthcare-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Smart Documentation Tracker</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            data-testid="button-generate-proof-report"
          >
            <FileText className="h-4 w-4 mr-1" />
            Generate Proof Report
          </Button>
          <Button 
            size="sm"
            data-testid="button-auto-respond"
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Auto-Respond
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            data-testid="button-export-appeals"
          >
            <FileText className="h-4 w-4 mr-1" />
            Export for Appeals
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Claim ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payer
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Date
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original Submission
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trackerData.map((item, index) => {
              const statusDisplay = getStatusDisplay(item.status);
              return (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  data-testid={`tracker-row-${item.claimId}`}
                >
                  <td className="px-3 py-4 text-sm text-gray-900">{item.claimId}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{item.patient}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{item.payer}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{item.requestDate}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{item.documentType}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{item.originalSubmission}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.className}`}>
                      {statusDisplay.icon}
                      <span className="ml-1">{statusDisplay.text}</span>
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <button 
                      className="transition-colors"
                      data-testid={`action-button-${item.claimId}`}
                    >
                      {getActionIcon(item.status)}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
