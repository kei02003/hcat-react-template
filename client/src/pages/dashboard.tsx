import { useState } from "react";
import { MetricsPanel } from "@/components/metrics-panel";
import { DocumentationDashboard } from "@/components/documentation-dashboard";
import { PredictiveDashboard } from "@/components/predictive-dashboard";
import { ArManagementDashboard } from "@/components/ar-management-dashboard";
import { CollectionsDashboard } from "@/components/collections-dashboard";
import { TimelyFilingDashboard } from "@/components/timely-filing-dashboard";
import { ClinicalDenialsDashboard } from "@/components/clinical-denials-dashboard";
import { PreAuthorizationDashboard } from "@/components/pre-authorization-dashboard";
import { FeasibilityDashboard } from "@/components/feasibility-dashboard";
import { SummaryDashboard } from "@/components/summary-dashboard";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { ChartLine, HelpCircle } from "lucide-react";

export default function Dashboard() {
  const [activeMainTab, setActiveMainTab] = useState("Summary");
  const [activeSubTab, setActiveSubTab] = useState("Clinical Denials");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-15",
    end: "2024-12-31"
  });

  const mainTabs = ["Summary", "AR Management", "Denials", "Collections", "Feasibility", "Pre-Authorization"];
  const subTabs = ["Clinical Denials", "Timely Filing", "Documentation Requests", "Appeals Management", "Predictive Analytics"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Health Catalyst Navbar */}
      <DashboardNavbar 
        activeMainTab={activeMainTab}
        onTabChange={setActiveMainTab}
      />
      
      {/* Secondary Navigation for Denials */}
      {activeMainTab === "Denials" && (
        <div style={{ marginTop: '53px' }} className="healthcare-secondary-header px-6 py-2">
          <nav className="flex space-x-6">
            {subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeSubTab === tab 
                    ? "bg-gray-600" 
                    : "hover:bg-gray-600"
                }`}
                data-testid={`sub-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="flex h-screen" style={{ paddingTop: activeMainTab === "Denials" ? '95px' : '53px' }}>
        {/* Only show MetricsPanel for non-Summary tabs */}
        {activeMainTab !== "Summary" && <MetricsPanel />}

        {/* Main Content Area */}
        {activeMainTab === "Summary" ? (
          <SummaryDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Documentation Requests" ? (
          <DocumentationDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Predictive Analytics" ? (
          <PredictiveDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Timely Filing" ? (
          <TimelyFilingDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Clinical Denials" ? (
          <ClinicalDenialsDashboard />
        ) : activeMainTab === "AR Management" ? (
          <ArManagementDashboard />
        ) : activeMainTab === "Collections" ? (
          <CollectionsDashboard />
        ) : activeMainTab === "Feasibility" ? (
          <FeasibilityDashboard />
        ) : activeMainTab === "Pre-Authorization" ? (
          <PreAuthorizationDashboard />
        ) : (
          <main className="flex-1 p-6 overflow-y-auto bg-white">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeMainTab} - {activeSubTab || "Overview"}
                </h2>
                <p className="text-gray-600">
                  This section is under development. Available dashboards include all major revenue cycle modules plus new RFP features: Pre-Authorization Management, Clinical Decision Support, and Appeal Generation.
                </p>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
