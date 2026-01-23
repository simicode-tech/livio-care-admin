"use client";

import { Button } from "./button";

interface DialogFooterProps {
  showCancel?: boolean;
  showNext?: boolean;
  currentStep?: number;
  totalSteps?: number;
  onCancel?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isNextDisabled?: boolean;
}

export function DialogFooter({
  showCancel = false,
  showNext = false,
  currentStep,
  totalSteps,
  onCancel,
  onNext,
  onPrevious,
  onSubmit,
  isLoading,
  isNextDisabled = false
}: DialogFooterProps) {
  if (!showCancel && !showNext) return null;

  return (
    <div className="fixed gap-4 bottom-0 right-4 flex justify-between py-4 px-6 bg-white border-t w-[540px]">
      {showCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 1 ? onCancel : onPrevious}
          className="w-full"
        >
          {currentStep === 1 ? "Cancel" : "Previous"}
        </Button>
      )}
      {showNext && (
        <Button
          type={currentStep === totalSteps ? "submit" : "button"}
          className="w-full font-normal text-sm"
          isLoading={isLoading}
          onClick={currentStep === totalSteps ? onSubmit : onNext}
          disabled={isNextDisabled || isLoading}
        >
          {currentStep === totalSteps ? "Submit" : "Next"}
        </Button>
      )}
    </div>
  );
}