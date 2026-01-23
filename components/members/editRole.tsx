"use client";
import React, { useState, useEffect } from "react";
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
import { useQueryClient } from "@tanstack/react-query";

interface EditRoleProps {
  edit: boolean;
  setEdit: (open: boolean) => void;
  roleId: string;
}

interface Priviledges {
  id: string;
  name: string;
  description: string;
}
interface Role {
  id: string;
  name: string;
  description: string;
  priviledge_ids: string[];
}

export default function EditRole({ edit, setEdit, roleId }: EditRoleProps) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const { data } = useCustomQuery(
    {
      url: "super-admin/priviledges/",
    },
    { queryKey: ["priviledges"] }
  );
  const { data: roleData } = useCustomQuery<Role>(
    {
      url: `super-admin/roles/${roleId}/`,
    },
    { queryKey: ["roles", roleId] }
  );
  useEffect(() => {
    const raw = roleData;
    const role = raw as Role;
    const ids = Array.isArray(role?.priviledge_ids)
      ? role.priviledge_ids.map((x) => String(x))
      : [];
    setSelected(ids.reduce((acc: Record<string, boolean>, id: string) => { acc[id] = true; return acc; }, {}));
    setRoleName(role?.name ?? "");
    setDescription(role?.description ?? "");
  }, [roleData]);
  
 const { mutateAsync, isPending:isCreating } = useMutate<unknown, {
    name: string;
    description: string;
    priviledge_ids: string[];
  }>({
    type: "patch",
    url: `super-admin/roles/${roleId}/edit/`,
  },

);
  const togglePerm = (permId: string) => {
    setSelected((prev) => ({
      ...prev,
      [permId]: !prev?.[permId],
    }));
  };

  

  const queryClient = useQueryClient();

  const handleSave = async () => {
    const priviledge_ids = Object.keys(selected).filter((key) => selected[key]);

    const payload = {
      name: roleName,
      description,
      priviledge_ids,
    };
    
    try {
      const resp = await mutateAsync(payload);
      if (resp) {
        toast.success(`Role updated.`);
        setSelected(priviledge_ids.reduce((acc: Record<string, boolean>, id: string) => { acc[id] = true; return acc; }, {}));
        setDescription(description);
        queryClient.invalidateQueries({ queryKey: ["roles", roleId] });
        queryClient.invalidateQueries({ queryKey: ["priviledges"] });
        setEdit(false);
      }
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <CustomSideDialog
      title={"Edit Role"}
      open={edit}
      onOpenChange={() => setEdit(false)} 
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
              disabled
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
          onClick={() => setEdit(false)} 
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
