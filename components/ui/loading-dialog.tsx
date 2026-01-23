import {
  Dialog,
  DialogContent,
//   DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoadingDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  message?: string;
}

export function LoadingDialog({ open, onOpenChange, message = "Loading..." }: LoadingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md items-center">
        {/* <DialogHeader className="text-center space-y-4">
        </DialogHeader> */}
          <DialogTitle>{message}</DialogTitle>
        <div className="flex justify-center items-center py-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-[bounce_1s_infinite_0ms]" />
            <div className="w-3 h-3 rounded-full bg-primary/40 animate-[bounce_1s_infinite_500ms]" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}