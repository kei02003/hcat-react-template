import { createContext, useContext, useState, useEffect } from "react";

export interface TutorialStep {
  id: string;
  target?: string;
  title: string;
  content: string;
}

interface TutorialContextType {
  startTutorial: (steps: TutorialStep[]) => void;
  isCompleted: boolean;
  setCompleted: (completed: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType>({
  startTutorial: () => {},
  isCompleted: true,
  setCompleted: () => {},
});

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isCompleted, setIsCompleted] = useState(() => {
    // Check localStorage for tutorial completion status
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tutorial-completed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    // Save tutorial completion status to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('tutorial-completed', isCompleted.toString());
    }
  }, [isCompleted]);

  const startTutorial = (steps: TutorialStep[]) => {
    // For now, just mark as completed immediately
    // This can be enhanced later with actual tutorial logic
    console.log('Tutorial started with steps:', steps);
    setIsCompleted(true);
  };

  const setCompleted = (completed: boolean) => {
    setIsCompleted(completed);
  };

  return (
    <TutorialContext.Provider value={{ startTutorial, isCompleted, setCompleted }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}