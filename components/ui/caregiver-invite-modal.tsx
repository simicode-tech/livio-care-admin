"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Share } from "lucide-react";
import { toast } from "sonner";

interface CaregiverInviteData {
  caregiver_name: string;
  email: string;
  invitation_link: string;
  invitation_code: string;
}

interface CaregiverInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteData: CaregiverInviteData | null;
}

export function CaregiverInviteModal({
  open,
  onOpenChange,
  inviteData,
}: CaregiverInviteModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyInviteCode = async () => {
    if (inviteData?.invitation_code) {
      try {
        await navigator.clipboard.writeText(inviteData.invitation_code);
        setCopied(true);
        toast.success("Invite code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.log(err)
        toast.error("Failed to copy invite code");
      }
    }
  };

  const handleShareInvite = async () => {
    if (navigator.share && inviteData) {
      try {
        await navigator.share({
          title: "Caregiver Invite Code",
          text: `Hi ${inviteData.caregiver_name}, here are your login details:\n\nEmail: ${inviteData.email}\nInvite Code: ${inviteData.invitation_code}\nPassword: 123456789`,
        });
      } catch (err) {
          console.log(err)
        // Fallback to copying
        handleCopyInviteCode();
      }
    } else {
      // Fallback to copying
      handleCopyInviteCode();
    }
  };

  if (!inviteData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Caregiver Invite Code Ready
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Copy the code below and share it with the caregiver to help them
              login.
            </p>
          </div>

          {/* Invite Details */}
          <div className="space-y-6">
            {/* Caregiver Name */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 text-sm">
                Caregiver&apos;s Name
              </span>
              <span className="font-medium text-gray-900">
                {inviteData.caregiver_name}
              </span>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 text-sm">
                Caregiver&apos;s Email
              </span>
              <span className="font-medium text-gray-900">
                {inviteData.email}
              </span>
            </div>

            {/* Invite Code */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 text-sm">Invite code</span>
              <span className="font-medium text-gray-900 font-mono">
                {inviteData.invitation_code}
              </span>
            </div>

            {/* Password */}
            {/* <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 text-sm">Password</span>
              <span className="font-semibold text-gray-900 font-mono">
                123456789
              </span>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleShareInvite} className="flex-1 ">
              <Share className="w-4 h-4 mr-2" />
              Share Invite
            </Button>
            <Button
              onClick={handleCopyInviteCode}
              variant="outline"
              className="flex-1 "
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy invite code"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}