import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Bot } from "lucide-react";
import { PayerVolumeChart } from "./charts/payer-volume-chart";
import { RedundancyMatrix } from "./charts/redundancy-matrix";
import { DocumentationTracker } from "./documentation-tracker";
import { PayerAnalytics } from "./payer-analytics";

export function DocumentationDashboard() {
  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white">
      <div className="space-y-6">
        {/* Dashboard Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Additional Documentation Request Analysis & Automation
          </h1>
          <div className="flex space-x-2">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-export-report"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-auto-process"
            >
              <Bot className="h-4 w-4 mr-2" />
              Auto-Process
            </Button>
          </div>
        </div>

        {/* Documentation Request Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Stats */}
          <div className="lg:col-span-1">
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center" data-testid="summary-total-requests">
                    <span className="text-sm text-gray-600">Total Requests:</span>
                    <span className="font-semibold">342</span>
                  </div>
                  <div className="flex justify-between items-center" data-testid="summary-redundant">
                    <span className="text-sm text-gray-600">Redundant:</span>
                    <span className="font-semibold text-red-600">128 (37%)</span>
                  </div>
                  <div className="flex justify-between items-center" data-testid="summary-auto-resolved">
                    <span className="text-sm text-gray-600">Auto-Resolved:</span>
                    <span className="font-semibold text-green-600">89 (26%)</span>
                  </div>
                  <div className="flex justify-between items-center" data-testid="summary-pending">
                    <span className="text-sm text-gray-600">Pending Review:</span>
                    <span className="font-semibold text-yellow-600">125 (37%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Volume Chart */}
          <div className="lg:col-span-2">
            <Card className="healthcare-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Documentation Requests by Payer
                </h3>
                <PayerVolumeChart />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Redundant Request Detection Matrix */}
        <Card className="healthcare-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Redundant Request Detection Matrix
            </h3>
            <RedundancyMatrix />
          </CardContent>
        </Card>

        {/* Smart Documentation Tracker */}
        <DocumentationTracker />

        {/* Payer Behavior Analytics */}
        <PayerAnalytics />
      </div>
    </main>
  );
}
