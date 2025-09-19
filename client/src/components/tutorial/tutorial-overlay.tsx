import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
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
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState<"top" | "bottom" | "left" | "right">("bottom");
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];

  // Smart positioning with flip logic and dynamic measurement
  const updateTooltipPosition = useCallback(() => {
    if (!highlightedElement || !tooltipRef.current) return;

    const targetRect = highlightedElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const offset = 16;
    const padding = 16;

    // Calculate available space in each direction
    const spaceAbove = targetRect.top;
    const spaceBelow = viewportHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = viewportWidth - targetRect.right;

    // Determine best position with flip logic
    let finalPosition = currentStepData.position;
    let top = 0;
    let left = 0;

    // Check if preferred position has enough space, otherwise flip
    switch (currentStepData.position) {
      case "top":
        if (spaceAbove < tooltipRect.height + offset && spaceBelow > spaceAbove) {
          finalPosition = "bottom";
        }
        break;
      case "bottom":
        if (spaceBelow < tooltipRect.height + offset && spaceAbove > spaceBelow) {
          finalPosition = "top";
        }
        break;
      case "left":
        if (spaceLeft < tooltipRect.width + offset && spaceRight > spaceLeft) {
          finalPosition = "right";
        }
        break;
      case "right":
        if (spaceRight < tooltipRect.width + offset && spaceLeft > spaceRight) {
          finalPosition = "left";
        }
        break;
    }

    // Calculate position based on final placement
    switch (finalPosition) {
      case "top":
        top = targetRect.top - tooltipRect.height - offset;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = targetRect.bottom + offset;
        left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.left - tooltipRect.width - offset;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.right + offset;
        break;
    }

    // Clamp within viewport with padding
    const maxLeft = viewportWidth - tooltipRect.width - padding;
    const maxTop = viewportHeight - tooltipRect.height - padding;
    
    left = Math.max(padding, Math.min(left, maxLeft));
    top = Math.max(padding, Math.min(top, maxTop));

    setTooltipPosition({ top, left });
    setActualPosition(finalPosition);
    setHighlightRect(targetRect);
  }, [highlightedElement, currentStepData]);

  // Handle missing targets gracefully
  const findTargetElement = useCallback(() => {
    if (!currentStepData) return null;
    
    const targetElement = document.querySelector(currentStepData.target) as HTMLElement;
    
    // If target not found and step is optional, auto-skip
    if (!targetElement && currentStepData.optional) {
      if (currentStep < steps.length - 1) {
        onStepChange(currentStep + 1);
      } else {
        onComplete();
      }
      return null;
    }
    
    // For required steps with missing targets, center the tooltip
    if (!targetElement) {
      setHighlightedElement(null);
      setHighlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 160
      });
      setActualPosition("bottom");
      return null;
    }
    
    return targetElement;
  }, [currentStepData, currentStep, steps.length, onStepChange, onComplete]);

  // Update highlighted element and tooltip position when step changes
  useEffect(() => {
    if (!isVisible || !currentStepData) return;

    const targetElement = findTargetElement();
    if (targetElement) {
      setHighlightedElement(targetElement);
      
      // Scroll element into view
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      
      // Update position after a brief delay to allow for DOM updates
      setTimeout(() => {
        updateTooltipPosition();
      }, 100);
    }
  }, [currentStep, currentStepData, isVisible, findTargetElement, updateTooltipPosition]);

  // Reactive positioning on scroll and resize
  useLayoutEffect(() => {
    if (!isVisible || !highlightedElement) return;

    const handleUpdate = () => {
      requestAnimationFrame(() => {
        updateTooltipPosition();
      });
    };

    const throttledUpdate = (() => {
      let ticking = false;
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleUpdate();
            ticking = false;
          });
          ticking = true;
        }
      };
    })();

    window.addEventListener("scroll", throttledUpdate, { passive: true });
    window.addEventListener("resize", throttledUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledUpdate);
      window.removeEventListener("resize", throttledUpdate);
    };
  }, [isVisible, highlightedElement, updateTooltipPosition]);

  // Remeasure when tooltip content changes
  useLayoutEffect(() => {
    if (tooltipRef.current && highlightedElement) {
      requestAnimationFrame(() => {
        updateTooltipPosition();
      });
    }
  }, [currentStepData?.content, currentStepData?.title, updateTooltipPosition, highlightedElement]);

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
          clipPath: highlightRect
            ? `polygon(0% 0%, 0% 100%, ${
                highlightRect.left - 4
              }px 100%, ${highlightRect.left - 4}px ${
                highlightRect.top - 4
              }px, ${highlightRect.right + 4}px ${
                highlightRect.top - 4
              }px, ${highlightRect.right + 4}px ${
                highlightRect.bottom + 4
              }px, ${highlightRect.left - 4}px ${
                highlightRect.bottom + 4
              }px, ${highlightRect.left - 4}px 100%, 100% 100%, 100% 0%)`
            : "none",
        }}
      />

      {/* Highlighted element border */}
      {highlightRect && (
        <div
          className="fixed border-2 border-blue-500 rounded-lg pointer-events-none z-[9999]"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
          }}
        />
      )}

      {/* Tutorial tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000]"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: "min(90vw, 20rem)",
          maxHeight: "80vh",
        }}
      >
        <Card className="shadow-xl border-blue-200 max-h-full flex flex-col overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg line-clamp-2">{currentStepData.title}</CardTitle>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {currentStep + 1} / {steps.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-6 w-6 p-0 flex-shrink-0"
                data-testid="tutorial-close-button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex-1 overflow-y-auto">
            {!highlightedElement && !highlightRect && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-xs text-amber-700 font-medium">
                  ⚠️ Target element not found. This step may not be available in the current view.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentStepData.content}
              </p>
              
              {currentStepData.action && highlightedElement && (
                <div className="p-2 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700 font-medium">
                    Action: {currentStepData.action === "click" ? "Click the highlighted element" : 
                            currentStepData.action === "hover" ? "Hover over the highlighted element" :
                            "Scroll to view the highlighted element"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 pt-2 border-t flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-1"
                data-testid="tutorial-previous-button"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  data-testid="tutorial-skip-button"
                  className="hidden sm:inline-flex"
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
            
            {/* Mobile skip button */}
            <div className="sm:hidden mt-2 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                data-testid="tutorial-skip-button-mobile"
                className="text-xs"
              >
                Skip Tutorial
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );

  return createPortal(overlay, document.body);
}