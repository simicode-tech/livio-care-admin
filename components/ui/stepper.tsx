"use client";

import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="relative mb-8 mt-8">
      <div className="flex justify-between items-center">
        <div className="absolute h-[2px] bg-[#E5E7EB] left-12 right-12 top-2.5" />
        <div
          className="absolute h-[2px] left-8 top-2.5 transition-all duration-300 bg-primary"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 96px)",
          }}
        />
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex flex-col items-center relative",
              currentStep >= step.id ? "text-primary" : "text-[#9CA3AF]"
            )}
          >
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
                "ring-[1px] ring-[#979797] bg-white relative z-10",
                currentStep >= step.id
                  ? "bg-primary text-white ring-primary"
                  : "text-[#979797]"
              )}
            >
              {step.id}
            </div>
            <span
              className={cn(
                "text-[11px] text-center whitespace-pre-line mt-2.5",
                "max-w-[85px]",
                currentStep >= step.id ? "font-medium" : "font-normal"
              )}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}