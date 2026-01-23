import { CustomDialog } from "./custom-dialog";
import { Button } from "./button";
import { Share } from "lucide-react";
import { useEffect, useRef } from "react";

interface CaregiverSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caregiverData: {
    caregiver_name: string;
    email: string;
    invitation_code: string;
  };
}

export function CaregiverSuccessModal({
  open,
  onOpenChange,
  caregiverData,
}: CaregiverSuccessModalProps) {
  const lottieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && lottieRef.current) {
      // Load and play Lottie animation
      import("@lottiefiles/lottie-player").then(() => {
        if (lottieRef.current) {
          lottieRef.current.innerHTML = `
            <lottie-player
              src="/assets/success.json"
              background="transparent"
              speed="1"
              style="width: 200px; height: 200px;"
              autoplay
            ></lottie-player>
          `;
        }
      });
    }
  }, [open]);

  const handleShareInvite = () => {
    // Copy invitation details to clipboard or open share dialog
    const inviteText = `Caregiver Account Created\n\nName: ${caregiverData.caregiver_name}\nEmail: ${caregiverData.email}\nPassword: ${caregiverData.invitation_code}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Caregiver Account Details",
        text: inviteText,
      });
    } else {
      navigator.clipboard.writeText(inviteText);
      // You could add a toast notification here
    }
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title=""
      //   className="max-w-md"
    >
      <div className="flex flex-col items-center text-center space-y-6 py-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900">
          Caregiver Account Created successfully!
        </h2>

        {/* Lottie Animation Container */}
        <div
          ref={lottieRef}
          className="w-[200px] h-[200px] border border-gray-300 flex items-center justify-center bg-gray-50"
        />

        {/* Description */}
        <p className="text-gray-600 text-sm max-w-xs">
          Congratulations! A new caregiver account has been successfully
          created. Below are the details:
        </p>

        {/* Caregiver Details */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Caregiver&apos;s Name</span>
            <span className="font-medium text-gray-900">
              {caregiverData.caregiver_name}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Caregiver&apos;s Email</span>
            <span className="font-medium text-gray-900">
              {caregiverData.email}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Password</span>
            <span className="font-medium text-gray-900">
              {caregiverData.invitation_code}
            </span>
          </div>
        </div>

        {/* Share Button */}
        <Button
          onClick={handleShareInvite}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 mt-6"
        >
          <Share className="w-4 h-4" />
          Share Invite
        </Button>
      </div>
    </CustomDialog>
  );
}