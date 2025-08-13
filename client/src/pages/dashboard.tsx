import { useState } from "react";
import { MetricsPanel } from "@/components/metrics-panel";
import { DocumentationDashboard } from "@/components/documentation-dashboard";
import { PredictiveDashboard } from "@/components/predictive-dashboard";
import { ArManagementDashboard } from "@/components/ar-management-dashboard";
import { CollectionsDashboard } from "@/components/collections-dashboard";
import { TimelyFilingDashboard } from "@/components/timely-filing-dashboard";
import { ClinicalDenialsDashboard } from "@/components/clinical-denials-dashboard";
import { PreAuthorizationDashboard } from "@/components/pre-authorization-dashboard";
import { AppealGenerationDashboard } from "@/components/appeal-generation-dashboard";
import { FeasibilityDashboard } from "@/components/feasibility-dashboard";
import { SummaryDashboard } from "@/components/summary-dashboard";
import { PersonaSwitcher } from "@/components/persona-switcher";
import { ChartLine, HelpCircle } from "lucide-react";

export default function Dashboard() {
  const [activeMainTab, setActiveMainTab] = useState("Summary");
  const [activeSubTab, setActiveSubTab] = useState("Clinical Denials");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-15",
    end: "2024-12-31"
  });

  const mainTabs = ["Summary", "AR Management", "Pre-Authorization", "Denials", "Collections", "Opportunities"];
  const subTabs = [
    { name: "Clinical Denials", warning: false },
    { name: "Timely Filing", warning: false },
    { name: "Documentation Requests", warning: false },
    { name: "Appeals Management", warning: false },
    { name: "Predictive Analytics", warning: true }
  ];

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
            <nav className="flex items-end space-x-6">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMainTab(tab)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeMainTab === tab 
                      ? "font-bold text-white" 
                      : "font-normal text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  data-testid={`main-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          {/* User Controls */}
          <div className="flex items-center space-x-4">
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
            </div>

            {/* Persona Switcher */}
            <PersonaSwitcher />
            
            <HelpCircle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
        
        {/* Secondary Navigation for Denials */}
        {activeMainTab === "Denials" && (
          <div className="healthcare-secondary-header px-6 py-2">
            <nav className="flex space-x-6">
              {subTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveSubTab(tab.name)}
                  className={`px-3 py-1 text-sm rounded transition-colors flex items-center space-x-2 ${
                    activeSubTab === tab.name 
                      ? "bg-gray-600" 
                      : "hover:bg-gray-600"
                  }`}
                  data-testid={`sub-tab-${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span>{tab.name}</span>
                  {tab.warning && (
                    <span className="bg-yellow-500 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
                      BETA
                    </span>
                  )}
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
        {activeMainTab === "Summary" ? (
          <SummaryDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Documentation Requests" ? (
          <DocumentationDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Predictive Analytics" ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 mx-6 mt-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Development Notice:</strong> This Predictive Analytics module is in early development. Features and data models are being actively refined.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <PredictiveDashboard />
            </div>
          </div>
        ) : activeMainTab === "Denials" && activeSubTab === "Timely Filing" ? (
          <TimelyFilingDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Clinical Denials" ? (
          <ClinicalDenialsDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Appeals Management" ? (
          <AppealGenerationDashboard />
        ) : activeMainTab === "AR Management" ? (
          <ArManagementDashboard />
        ) : activeMainTab === "Collections" ? (
          <CollectionsDashboard />
        ) : activeMainTab === "Opportunities" ? (
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
