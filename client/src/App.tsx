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
import { EpicIntegrationArchitecture } from "@/components/epic-integration-architecture";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  // Authentication disabled for now - direct access to dashboard
  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/demo-users" component={DemoUserSelector} />
      <Route path="/epic-architecture" component={EpicIntegrationArchitecture} />
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
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
