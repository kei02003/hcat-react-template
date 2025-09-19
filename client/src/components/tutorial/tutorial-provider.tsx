import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TutorialOverlay, TutorialStep } from "./tutorial-overlay";

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  startTutorial: (steps: TutorialStep[]) => void;
  stopTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  isCompleted: boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

interface TutorialProviderProps {
  children: ReactNode;
}

const TUTORIAL_STORAGE_KEY = "healthcare-dashboard-tutorial-completed";

export function TutorialProvider({ children }: TutorialProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check if tutorial was previously completed
  useEffect(() => {
    const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    setIsCompleted(completed === "true");
  }, []);

  const startTutorial = (tutorialSteps: TutorialStep[]) => {
    setSteps(tutorialSteps);
    setCurrentStep(0);
    setIsActive(true);
  };

  const stopTutorial = () => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    setIsActive(false);
    setIsCompleted(true);
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    setCurrentStep(0);
    setSteps([]);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const value: TutorialContextType = {
    isActive,
    currentStep,
    startTutorial,
    stopTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    isCompleted,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
      <TutorialOverlay
        steps={steps}
        isVisible={isActive}
        currentStep={currentStep}
        onComplete={completeTutorial}
        onSkip={skipTutorial}
        onStepChange={handleStepChange}
      />
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}