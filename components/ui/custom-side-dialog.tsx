import { X } from "lucide-react";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  showClose?: boolean;
  className?: string;
}

export function CustomSideDialog({
  open,
  onOpenChange,
  title,
  children,
  showClose = true,
  className = "",
}: CustomDialogProps) {
  if (!open) return null;

  return (
      <>
            <div
                className="fixed top-[68px] inset-x-0 bottom-0 bg-black/20 z-40"
                onClick={() => onOpenChange(false)}
            />
                <div className={`fixed right-0 top-[68px] bottom-0 w-[500px] bg-white shadow-2xl z-50 overflow-hidden ${className}`}>
                     <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                {title}
              </h2>
              {showClose && (
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#666666]" />
              </button>
              )}
            </div>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
        </>
  );
}


  
