import { DashboardGrid } from "./dashboard-grid";

export function CustomMetricsDashboard() {
  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white">
      <DashboardGrid
        title="Custom Metrics Dashboard"
        subtitle="Build your personalized healthcare analytics dashboard with canonical metrics"
        allowCustomization={true}
        maxMetrics={20}
        showGlobalFilters={true}
        className="w-full"
      />
    </main>
  );
}