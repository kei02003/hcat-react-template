import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import { UserProfile } from "@/components/user-profile";
import { DemoUserSelector } from "@/components/demo-user-selector";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CSVImportPage } from "@/pages/csv-import";
import DatabaseMigration from "./pages/DatabaseMigration";

function Router() {
  // Authentication disabled for now - direct access to dashboard
  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/demo-users" component={DemoUserSelector} />
      <Route path="/csv-import" component={CSVImportPage} />
      <Route path="/database-migration" component={DatabaseMigration} />
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
