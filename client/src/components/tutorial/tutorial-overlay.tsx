import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right";
  action?: "click" | "hover" | "scroll";
  optional?: boolean;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function TutorialOverlay({
  steps,
  isVisible,
  onComplete,
  onSkip,
  currentStep,
  onStepChange,
}: TutorialOverlayProps) {
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];

  // Update highlighted element and tooltip position when step changes
  useEffect(() => {
    if (!isVisible || !currentStepData) return;

    const targetElement = document.querySelector(currentStepData.target) as HTMLElement;
    if (targetElement) {
      setHighlightedElement(targetElement);
      updateTooltipPosition(targetElement, currentStepData.position);
      
      // Scroll element into view
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [currentStep, currentStepData, isVisible]);

  const updateTooltipPosition = (element: HTMLElement, position: string) => {
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const offset = 16;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top - tooltipHeight - offset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - offset;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + offset;
        break;
    }

    // Ensure tooltip stays within viewport
    const maxLeft = window.innerWidth - tooltipWidth - 16;
    const maxTop = window.innerHeight - tooltipHeight - 16;
    
    left = Math.max(16, Math.min(left, maxLeft));
    top = Math.max(16, Math.min(top, maxTop));

    setTooltipPosition({ top, left });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!isVisible || !currentStepData) return null;

  const overlay = (
    <>
      {/* Dark overlay with cutout for highlighted element */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        style={{
          clipPath: highlightedElement
            ? `polygon(0% 0%, 0% 100%, ${
                highlightedElement.getBoundingClientRect().left - 4
              }px 100%, ${highlightedElement.getBoundingClientRect().left - 4}px ${
                highlightedElement.getBoundingClientRect().top - 4
              }px, ${highlightedElement.getBoundingClientRect().right + 4}px ${
                highlightedElement.getBoundingClientRect().top - 4
              }px, ${highlightedElement.getBoundingClientRect().right + 4}px ${
                highlightedElement.getBoundingClientRect().bottom + 4
              }px, ${highlightedElement.getBoundingClientRect().left - 4}px ${
                highlightedElement.getBoundingClientRect().bottom + 4
              }px, ${highlightedElement.getBoundingClientRect().left - 4}px 100%, 100% 100%, 100% 0%)`
            : "none",
        }}
      />

      {/* Highlighted element border */}
      {highlightedElement && (
        <div
          className="fixed border-2 border-blue-500 rounded-lg pointer-events-none z-[9999]"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
          }}
        />
      )}

      {/* Tutorial tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] w-80"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <Card className="shadow-xl border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {currentStep + 1} / {steps.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-6 w-6 p-0"
                data-testid="tutorial-close-button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {currentStepData.content}
            </p>
            
            {currentStepData.action && (
              <div className="mb-4 p-2 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-700 font-medium">
                  Action: {currentStepData.action === "click" ? "Click the highlighted element" : 
                          currentStepData.action === "hover" ? "Hover over the highlighted element" :
                          "Scroll to view the highlighted element"}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-1"
                data-testid="tutorial-previous-button"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  data-testid="tutorial-skip-button"
                >
                  Skip Tutorial
                </Button>
                <Button
                  onClick={handleNext}
                  size="sm"
                  className="flex items-center space-x-1"
                  data-testid="tutorial-next-button"
                >
                  <span>{currentStep === steps.length - 1 ? "Complete" : "Next"}</span>
                  {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return createPortal(overlay, document.body);
}