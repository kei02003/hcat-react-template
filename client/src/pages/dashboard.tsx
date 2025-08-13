import { useState } from "react";
import { useLocation } from "wouter";
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
// Using TriFlame SVG from Health Catalyst
const triFlameLogoUrl = "https://cashmere.healthcatalyst.net/assets/TriFlame.svg";

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
    end: "2024-12-31"
  });

  const handleUserProfileClick = () => {
    setLocation('/profile');
  };

  const handlePersonaChange = (persona: DemoUser) => {
    setCurrentPersona(persona);
  };

  const mainTabs = ["Summary", "AR", "Pre-Auth", "Denials", "Collections", "Opportunities"];
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
      <header className="healthcare-header shadow-lg relative">
        <div className="flex items-center justify-between pl-4 pr-6" style={{ height: '60px' }}>
          {/* Brand Logo - 40px x 40px with blue background */}
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#00aeff',
                borderRadius: '4px'
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
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2" data-testid="logo">
              <ChartLine className="h-6 w-6" />
              <span className="text-xl font-semibold">RevenueCycle</span>
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
                    data-testid={`main-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {tab}
                  </button>
                  {/* Blue underline bar for active tab - positioned at bottom of navbar */}
                  {activeMainTab === tab && (
                    <div 
                      className="absolute h-1 transition-all duration-200"
                      style={{ 
                        backgroundColor: '#00aeff',
                        left: 0,
                        right: 0,
                        bottom: '-12px'
                      }}
                    />
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* User Controls */}
          <div className="flex items-center space-x-6">
            {/* Globe Icon */}
            <svg className="h-5 w-5 text-white hover:text-white cursor-pointer" data-testid="globe-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            
            {/* Help Icon */}
            <HelpCircle className="h-5 w-5 text-white hover:text-white cursor-pointer" data-testid="help-icon" />
            
            {/* Pipe Separator */}
            <div className="h-6 w-0.5 bg-white"></div>
            
            {/* Demo User Switcher */}
            <PersonaSwitcher 
              currentPersona={currentPersona} 
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
                        ? "text-white" 
                        : "text-white/80 hover:text-white"
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
                  {/* Blue underline bar for active sub-tab - positioned at bottom of secondary navbar */}
                  {activeSubTab === tab.name && (
                    <div 
                      className="absolute h-0.5 transition-all duration-200"
                      style={{ 
                        backgroundColor: '#00aeff',
                        left: 0,
                        right: 0,
                        bottom: '-8px'
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
        ) : activeMainTab === "AR" ? (
          <ArManagementDashboard />
        ) : activeMainTab === "Collections" ? (
          <CollectionsDashboard />
        ) : activeMainTab === "Opportunities" ? (
          <FeasibilityDashboard />
        ) : activeMainTab === "Pre-Auth" ? (
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
