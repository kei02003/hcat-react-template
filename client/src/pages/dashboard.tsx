import { useState } from "react";
import { MetricsPanel } from "@/components/metrics-panel";
import { DocumentationDashboard } from "@/components/documentation-dashboard";
import { PredictiveDashboard } from "@/components/predictive-dashboard";
import { ArManagementDashboard } from "@/components/ar-management-dashboard";
import { CollectionsDashboard } from "@/components/collections-dashboard";
import { TimelyFilingDashboard } from "@/components/timely-filing-dashboard";
import { ClinicalDenialsDashboard } from "@/components/clinical-denials-dashboard";
import { PreAuthorizationDashboard } from "@/components/pre-authorization-dashboard";
import { ClinicalDecisionDashboard } from "@/components/clinical-decision-dashboard";
import { AppealGenerationDashboard } from "@/components/appeal-generation-dashboard";
import { FeasibilityDashboard } from "@/components/feasibility-dashboard";
import { ChartLine, HelpCircle } from "lucide-react";

export default function Dashboard() {
  const [activeMainTab, setActiveMainTab] = useState("Denials");
  const [activeSubTab, setActiveSubTab] = useState("Documentation Requests");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-15",
    end: "2024-12-31"
  });

  const mainTabs = ["Summary", "AR Management", "Denials", "Collections", "Feasibility", "Pre-Authorization", "RFP Modules"];
  const subTabs = ["Clinical Denials", "Timely Filing", "Documentation Requests", "Appeals Management", "Predictive Analytics"];
  const rfpSubTabs = ["Pre-Authorization", "Clinical Decision", "Appeal Generation"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="healthcare-header shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2" data-testid="logo">
              <ChartLine className="h-6 w-6" />
              <span className="text-xl font-semibold">RevenueCycle</span>
            </div>
            
            {/* Main Navigation Tabs */}
            <nav className="flex space-x-6">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMainTab(tab)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeMainTab === tab 
                      ? "bg-gray-700" 
                      : "hover:bg-gray-700"
                  }`}
                  data-testid={`main-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Date Range Selector */}
          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
              data-testid="date-input-start"
            />
            <span className="text-sm">to</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
              data-testid="date-input-end"
            />
            <HelpCircle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
        
        {/* Secondary Navigation for Denials */}
        {activeMainTab === "Denials" && (
          <div className="healthcare-secondary-header px-6 py-2">
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
        
        {/* Secondary Navigation for RFP Modules */}
        {activeMainTab === "RFP Modules" && (
          <div className="healthcare-secondary-header px-6 py-2">
            <nav className="flex space-x-6">
              {rfpSubTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    activeSubTab === tab 
                      ? "bg-gray-600" 
                      : "hover:bg-gray-600"
                  }`}
                  data-testid={`rfp-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex h-screen">
        {/* Left Sidebar with Metrics */}
        <MetricsPanel />

        {/* Main Content Area */}
        {activeMainTab === "Denials" && activeSubTab === "Documentation Requests" ? (
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
        ) : activeMainTab === "RFP Modules" && activeSubTab === "Pre-Authorization" ? (
          <PreAuthorizationDashboard />
        ) : activeMainTab === "RFP Modules" && activeSubTab === "Clinical Decision" ? (
          <ClinicalDecisionDashboard />
        ) : activeMainTab === "RFP Modules" && activeSubTab === "Appeal Generation" ? (
          <AppealGenerationDashboard />
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
