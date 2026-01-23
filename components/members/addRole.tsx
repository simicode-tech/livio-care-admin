"use client";
import React, { useState } from "react";
import { CustomSideDialog } from "@/components/ui/custom-side-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import useCustomQuery from "@/hooks/useCustomQuery";
import useMutate from "@/hooks/useMutate";
import { toast } from "sonner";
import { ApiResponseError } from "@/interfaces/axios";
// import { AxiosError } from "axios";

interface AddRoleProps {
  add: boolean;
  setAdd: (open: boolean) => void;
}

interface Priviledges {
  id: string;
  name: string;
  description: string;
}

export default function AddRole({ add, setAdd }: AddRoleProps) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const { data} = useCustomQuery<Priviledges[]>(
    {
      url: "super-admin/priviledges/",
    },
    { queryKey: ["priviledges"] }
  );
 const { mutateAsync, isPending:isCreating } = useMutate<unknown, {
    name: string;
    description: string;
    priviledge_ids: string[];
  }>({
    type: "post",
    url: "super-admin/roles/create/",
  });
  const togglePerm = (permId: string) => {
    setSelected((prev) => ({
      ...prev,
      [permId]: !prev?.[permId],
    }));
  };

  const handleSave = async () => {
    const priviledge_ids = Object.keys(selected).filter(
      (key) => selected[key]
    );

    const payload = {
      name: roleName,
      description,
      priviledge_ids,
    };
    try {
      const resp = await mutateAsync(payload);
      if(resp){
        toast.success("Role created successfully");
        setAdd(false);
    }
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data?.message || "Failed to create role");
      
    }



    
  };

  return (
    <CustomSideDialog
      title={"Create New Role"}
      open={add}
      onOpenChange={() => setAdd(false)}
      className="w-[500px]"
    >
      <div className="space-y-6">
        {/* Role Info */}
        <div className="bg-[#F4F4F4] rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-[#1A1A1A]">Role Name</Label>
            <Input
              placeholder="Enter role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="h-10 bg-white border-[#E5E7EB] rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#1A1A1A]">Description</Label>
            <Input
              placeholder="Describe this role"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10 bg-white border-[#E5E7EB] rounded-lg"
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-[#F4F4F4] rounded-xl p-6 space-y-6">
          <div className="text-base font-medium text-[#1A1A1A]">
            Set Permissions
          </div>

          <div className="space-y-3">
            {Array.isArray(data) && data.map((perm: Priviledges) => (
              <div
                key={perm.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center justify-between bg-white p-4 rounded-lg w-full border border-[#E5E7EB]">
                  <span className="text-sm text-[#1A1A1A]">{perm.name}</span>
                </div>

                <Checkbox
                  checked={!!selected[perm.id]}
                  onCheckedChange={() => togglePerm(perm.id)}
                  className="w-5 h-5 border-[#E5E7EB] bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-transparent"
          onClick={() => setAdd(false)}
        >
          Cancel
        </Button>

        <Button className="bg-primary text-white" onClick={handleSave} isLoading={isCreating}>
          Save
        </Button>
      </div>
    </CustomSideDialog>
  );
}
