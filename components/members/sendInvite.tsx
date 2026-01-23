"use client";

import React, { useState } from "react";
import { CustomSideDialog } from "@/components/ui/custom-side-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useCustomQuery from "@/hooks/useCustomQuery";
import useMutate from "@/hooks/useMutate";
import { toast } from "sonner";
import { ApiResponseError } from "@/interfaces/axios";

interface SendInviteProps {
  add: boolean;
  setAdd: (open: boolean) => void;
}

interface RoleOption { id: string; name: string; }

export default function SendInvite({ add, setAdd }: SendInviteProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");

  const { data: rolesRes, isPending: loadingRoles } = useCustomQuery<RoleOption[]>(
    { url: "super-admin/roles/" },
    { queryKey: ["invite-list"] }
  );
  const roles: RoleOption[] = (Array.isArray(rolesRes)
    ? ((rolesRes))
    : Array.isArray(rolesRes)
    ? (rolesRes)
    : []) as RoleOption[];

  const { mutateAsync: sendInvite, isPending: sending } = useMutate<unknown, {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }>({ type: "post", url: "super-admin/members/add/" });

  const handleSend = async () => {
    const parts = name.trim().split(/\s+/);
    const first_name = parts[0] ?? "";
    const last_name = parts.slice(1).join(" ");

    if (!first_name || !email || !role) {
      toast.error("Please fill name, email and role");
      return;
    }
    try {
      await sendInvite({ first_name, last_name, email, role });
      toast.success( "Invite sent successfully");
      setAdd(false);
      setName("");
      setEmail("");
      setRole("");
    } catch (err) {
      const error = err as ApiResponseError;
      toast.error(error?.response?.data?.message ?? "Failed to send invite");
    }
  };

  return (
    <CustomSideDialog
      title="Send invite"
      open={add}
      onOpenChange={() => setAdd(false)}
      className="w-[500px]"
    >
      <div className="bg-[#F4F4F4] rounded-xl p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-[#1A1A1A]">Name</Label>
          <Input
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 bg-white border-[#E5E7EB] rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#1A1A1A]">Email</Label>
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 bg-white border-[#E5E7EB] rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#1A1A1A]">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-10 bg-white border-[#E5E7EB] rounded-lg">
              <SelectValue placeholder={loadingRoles ? "Loading roles..." : "Select role"} />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-transparent"
          onClick={() => setAdd(false)}
        >
          Cancel
        </Button>
        <Button className="bg-primary text-white" onClick={handleSend} disabled={sending}>
          Send
        </Button>
      </div>
    </CustomSideDialog>
  );
}