export interface TutorialStep {
  id: string;
  target?: string;
  title: string;
  content: string;
}

export const dashboardTutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to RevenueCycle",
    content: "This is your healthcare revenue cycle management dashboard."
  },
  {
    id: "main-tabs",
    target: "nav",
    title: "Navigation Tabs",
    content: "Use these tabs to navigate between different sections: Summary, AR, Denials, and Metrics."
  },
  {
    id: "persona-switcher",
    target: "[data-testid='persona-switcher']",
    title: "Demo Users",
    content: "Switch between different user roles to see how the dashboard changes for different personas."
  },
  {
    id: "help-icon",
    target: "[data-testid='help-icon']",
    title: "Help & Support",
    content: "Click here anytime you need assistance or want to replay this tutorial."
  }
];