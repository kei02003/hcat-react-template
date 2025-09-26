import { useState, useEffect } from "react";
import { useTutorial } from "@/components/tutorial/tutorial-provider";
import { dashboardTutorialSteps } from "@/components/tutorial/dashboard-tutorial-steps";
import { PersonaSwitcher, type DemoUser } from "@/components/persona-switcher";
import { HelpCircle } from "lucide-react";

// Using TriFlame SVG from Health Catalyst
const brandLogoUrl = "https://cashmere.healthcatalyst.net/assets/TriFlame.svg";

// === TEMPLATE CONFIGURATION ===
const APP_TITLE = "Ignite"; // App name

const MAIN_TABS = ["Home", "Reports"];

// If no subtabs are needed, just leave this object empty or omit keys
const SUB_TABS: Record<string, { name: string; warning?: boolean }[]> = {
  SubNav: [
    { name: "Subnav1", warning: false },
    { name: "Subnav2", warning: false },
    { name: "Subnav3", warning: false },
  ],
};
// === END CONFIGURATION ===

export default function Dashboard() {
  const [activeMainTab, setActiveMainTab] = useState(MAIN_TABS[0]);
  const [activeSubTab, setActiveSubTab] = useState("Home");
  const [currentPersona, setCurrentPersona] = useState<DemoUser | null>(null);
  const { startTutorial, isCompleted } = useTutorial();

  useEffect(() => {
    if (!isCompleted) {
      const timer = setTimeout(() => {
        startTutorial(dashboardTutorialSteps);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, startTutorial]);

  const handlePersonaChange = (persona: DemoUser) => {
    setCurrentPersona(persona);
  };

  const currentSubTabs = SUB_TABS[activeMainTab] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="healthcare-header shadow-lg relative">
        <div
          className="flex items-left justify-between pr-7"
          style={{ height: "60px" }}
        >
          {/* Logo */}
          <div className="flex items-left">
            <div
              className="flex items-center justify-center"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#00aeff",
              }}
            >
              <img
                src={brandLogoUrl}
                alt="TriFlame Logo"
                className="w-8 h-8 object-contain"
                data-testid="brand-logo"
              />
            </div>
          </div>

          {/* Title + Tabs */}
          <div className="flex items-center space-x-8 flex-1">
            <div className="flex items-center space-x-2" data-testid="logo">
              <span className="text-xl font-semibold ml-2.5">{APP_TITLE}</span>
            </div>

            <nav className="flex items-end space-x-6 relative">
              {MAIN_TABS.map((tab) => (
                <div key={tab} className="relative">
                  <button
                    onClick={() => {
                      setActiveMainTab(tab);
                      // Reset subtab when changing main tabs
                      if (SUB_TABS[tab] && SUB_TABS[tab].length > 0) {
                        setActiveSubTab(SUB_TABS[tab][0].name);
                      } else {
                        setActiveSubTab("");
                      }
                    }}
                    className={`px-4 py-2 transition-all relative ${
                      activeMainTab === tab
                        ? "font-bold text-white"
                        : "font-normal text-white/80 hover:text-white"
                    }`}
                    data-testid={`main-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {tab}
                  </button>
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
            <HelpCircle
              className="h-5 w-5 text-white hover:text-white cursor-pointer"
              data-testid="help-icon"
            />
            <div className="h-6 w-0.5 bg-white"></div>
            <PersonaSwitcher
              currentPersona={currentPersona || undefined}
              onPersonaChange={handlePersonaChange}
            />
          </div>
        </div>

        {/* Secondary Navigation for tabs with subtabs */}
        {currentSubTabs.length > 0 && (
          <div className="healthcare-secondary-header px-6 py-2 relative">
            <nav className="flex space-x-6">
              {currentSubTabs.map((tab) => (
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
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  {activeSubTab === tab.name && (
                    <div
                      className="absolute h-0.5 bg-healthcare-blue-600 transition-all duration-200"
                      style={{
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

      {/* Main Content Area */}
      <div className="flex h-screen">
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {activeSubTab || activeMainTab}
              </h2>
              <p className="text-gray-600">
                Replace this section with the dashboard or content for{" "}
                <strong>{activeSubTab || activeMainTab}</strong>.
              </p>
              {currentPersona && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Currently viewing as:{" "}
                    <strong>
                      {currentPersona.firstName} {currentPersona.lastName}
                    </strong>
                    ({currentPersona.jobTitle})
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
