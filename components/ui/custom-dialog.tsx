"use client";

import { Button } from "./button";
import { X } from "lucide-react";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  showClose?: boolean;
}

export function CustomDialog({
  open,
  onOpenChange,
  title,
  children,
  showClose = true,
}: CustomDialogProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed right-4 top-[40px] bottom-0 h-[calc(100vh-60px)] w-[540px] bg-white border-l z-50 rounded-2xl shadow-lg">
        <header className="sticky top-0 z-50 bg-white px-6 py-4 border-b rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">{title}</h2>
            {showClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="hover:bg-transparent p-0 h-auto"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
        </header>

        <div className="flex flex-col h-full">
          <div className="px-6 flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
