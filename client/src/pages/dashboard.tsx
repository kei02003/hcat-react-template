import { useState } from "react";
import { useLocation } from "wouter";
import { DocumentationDashboard } from "@/components/documentation-dashboard";
import { PredictiveDashboard } from "@/components/predictive-dashboard";
import { ArManagementDashboard } from "@/components/ar-management-dashboard";
import { TimelyFilingDashboard } from "@/components/timely-filing-dashboard";
import { ClinicalDenialsDashboard } from "@/components/clinical-denials-dashboard";
import { WriteOffAnalyticsDashboard } from "@/components/writeoff-analytics-dashboard";
import { AppealGenerationDashboard } from "@/components/appeal-generation-dashboard";
import { FeasibilityDashboard } from "@/components/feasibility-dashboard";
import { SummaryDashboard } from "@/components/summary-dashboard";
import { CustomMetricsDashboard } from "@/components/custom-metrics-dashboard";
import { PersonaSwitcher } from "@/components/persona-switcher";
import { HelpCircle } from "lucide-react";
// Using TriFlame SVG from Health Catalyst
const triFlameLogoUrl =
  "https://cashmere.healthcatalyst.net/assets/TriFlame.svg";

interface DemoUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  employeeId: string;
  department: string;
  jobTitle: string;
  phoneNumber: string;
  roles: string[];
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [activeMainTab, setActiveMainTab] = useState("Summary");
  const [activeSubTab, setActiveSubTab] = useState("Clinical Denials");
  const [currentPersona, setCurrentPersona] = useState<DemoUser | null>(null);
  const [dateRange, setDateRange] = useState({
    start: "2024-01-15",
    end: "2024-12-31",
  });

  const handleUserProfileClick = () => {
    setLocation("/profile");
  };

  const handlePersonaChange = (persona: DemoUser) => {
    setCurrentPersona(persona);
  };

  const mainTabs = [
    "Summary",
    "AR",
    "Denials",
    "Metrics",
  ];
  const subTabs = [
    { name: "Clinical Denials", warning: false },
    { name: "Timely Filing", warning: false },
    { name: "Write-Off Analytics", warning: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="healthcare-header shadow-lg relative">
        <div
          className="flex items-left justify-between pr-7"
          style={{ height: "60px" }}
        >
          {/* Brand Logo - 40px x 40px with blue background */}
          <div className="flex items-left">
            <div
              className="flex items-center justify-center"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#00aeff",
                borderRadius: "0px",
              }}
            >
              <img
                src={triFlameLogoUrl}
                alt="TriFlame Logo"
                className="w-8 h-8 object-contain"
                data-testid="brand-logo"
              />
            </div>
          </div>

          <div className="flex items-center space-x-8 flex-1">
            <div className="flex items-center space-x-2" data-testid="logo">
              <span className="text-xl font-semibold ml-2.5">
                {" "}
                RevenueCycle
              </span>
            </div>

            {/* Main Navigation Tabs */}
            <nav className="flex items-end space-x-6 relative">
              {mainTabs.map((tab, index) => (
                <div key={tab} className="relative">
                  <button
                    onClick={() => setActiveMainTab(tab)}
                    className={`px-4 py-2 transition-all relative ${
                      activeMainTab === tab
                        ? "font-bold text-white"
                        : "font-normal text-white/80 hover:text-white"
                    }`}
                    data-testid={`main-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {tab}
                  </button>
                  {/* Blue underline bar for active tab - positioned at bottom of navbar */}
                  {activeMainTab === tab && (
                    <div
                      className="absolute h-1 transition-all duration-200"
                      style={{
                        backgroundColor: "#00aeff",
                        left: 0,
                        right: 0,
                        bottom: "-12px",
                      }}
                    />
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-6">
            {/* Help Icon */}
            <HelpCircle
              className="h-5 w-5 text-white hover:text-white cursor-pointer"
              data-testid="help-icon"
            />

            {/* Pipe Separator */}
            <div className="h-6 w-0.5 bg-white"></div>

            {/* Demo User Switcher */}
            <PersonaSwitcher
              currentPersona={currentPersona || undefined}
              onPersonaChange={handlePersonaChange}
            />
          </div>
        </div>

        {/* Secondary Navigation for Denials */}
        {activeMainTab === "Denials" && (
          <div className="healthcare-secondary-header px-6 py-2 relative">
            <nav className="flex space-x-6">
              {subTabs.map((tab) => (
                <div key={tab.name} className="relative">
                  <button
                    onClick={() => setActiveSubTab(tab.name)}
                    className={`px-3 py-1 text-sm transition-colors flex items-center space-x-2 ${
                      activeSubTab === tab.name
                        ? "text-healthcare-gray-800 font-bold"
                        : "text-healthcare-gray-800/80 hover:text-healthcare-gray-800"
                    }`}
                    data-testid={`sub-tab-${tab.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span>{tab.name}</span>
                    {tab.warning && (
                      <span className="bg-yellow-500 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
                        BETA
                      </span>
                    )}
                  </button>
                  {/* Blue underline bar for active sub-tab - positioned at bottom of secondary navbar */}
                  {activeSubTab === tab.name && (
                    <div
                      className="absolute h-0.5 transition-all duration-200"
                      style={{
                        backgroundColor: "#00aeff",
                        left: 0,
                        right: 0,
                        bottom: "-8px",
                      }}
                    />
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex h-screen">
        {/* Main Content Area */}
        {activeMainTab === "Summary" ? (
          <SummaryDashboard />
        ) : activeMainTab === "Denials" && activeSubTab === "Timely Filing" ? (
          <TimelyFilingDashboard />
        ) : activeMainTab === "Denials" &&
          activeSubTab === "Clinical Denials" ? (
          <ClinicalDenialsDashboard />
        ) : activeMainTab === "Denials" &&
          activeSubTab === "Write-Off Analytics" ? (
          <WriteOffAnalyticsDashboard />
        ) : activeMainTab === "AR" ? (
          <ArManagementDashboard />
        ) : activeMainTab === "Metrics" ? (
          <CustomMetricsDashboard />
        ) : activeMainTab === "Opportunities" ? (
          <FeasibilityDashboard />
        ) : (
          <main className="flex-1 p-6 overflow-y-auto bg-white">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeMainTab} - {activeSubTab || "Overview"}
                </h2>
                <p className="text-gray-600">
                  This section is under development. Available dashboards
                  include all major revenue cycle modules plus new features:
                  Clinical Decision Support and Appeal Generation.
                </p>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
