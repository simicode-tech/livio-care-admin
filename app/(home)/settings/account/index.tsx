// AccountSettingsPage component
"use client";

import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useCustomQuery from "@/hooks/useCustomQuery";
import useMutate from "@/hooks/useMutate";
import { ServiceTypes } from "@/lib/config";
// Import Skeleton
import { Skeleton } from "@/components/ui/skeleton";
import { removeInitialsFromName } from "@/lib/utils";
import { useUploadFile } from "@/hooks/useUploadFile";
import { ApiResponseError } from "@/interfaces/axios";
import { toast } from "sonner";
import { useSetUser, useUser } from "@/store";
import { useQueryClient } from "@tanstack/react-query";

interface AgencyResponse {
  message: string;
  data: PersonalProfile;
}
interface PersonalResponse {
  message: string;
  data: PersonalProfile;
}
export default function AccountSettingsPage() {
  const user = useUser();
  const setUser = useSetUser();
  const [personal, setPersonal] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_picture: "",
  });

  // Organization profile state
  const [organization, setOrganization] = useState({
    name: "",
    services_offered: [] as string[],
    postal_code: "",
    no_of_sites: 0,
    no_of_active_carers: 0,
    no_of_active_clients: 0,
  });

  // Fetch agency profile
  const { data: agencyRes, isPending: loadingAgency } =
    useCustomQuery<AgencyProfile>(
      {
        url: "auth/profile/agency/",
      },
      { queryKey: ["agency-profile"] }
    );

  // Fetch user profile
  const { data: userRes, isPending: loadingUser } =
    useCustomQuery<PersonalProfile>(
      {
        url: "auth/profile/user/",
      },
      { queryKey: ["profile"] }
    );
  const { mutateAsync: updateAgency, isPending: updatingAgency } = useMutate<
    AgencyResponse,
    typeof organization
  >(
    { type: "patch", url: "auth/profile/agency/" }
   
  );
  const queryClient = useQueryClient();
  const { mutateAsync: updateUser, isPending: updatingUser } = useMutate<
    PersonalResponse,
    {
      first_name?: string;
      last_name?: string;
      phone_number?: string;
      profile_picture?: string;
    }
  >({ type: "patch", url: "auth/profile/user/" });
  const { uploadFile, isPending: uploadingAvatar } = useUploadFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);

  const handleClickUpload = () => fileInputRef.current?.click();

  const isLoading = loadingAgency || loadingUser;

  // Render page skeleton when loading

  useEffect(() => {
    const agency = agencyRes;
    if (agency) {
      setOrganization({
        name: agency.name || "",
        services_offered: agency.services_offered || [],
        postal_code: agency.postal_code || "",
        no_of_sites: agency.no_of_sites || 0,
        no_of_active_carers: agency.no_of_active_carers || 0,
        no_of_active_clients: agency.no_of_active_clients || 0,
      });
    }
  }, [agencyRes]);

  useEffect(() => {
    const user = userRes
    if (user) {
      setPersonal({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        profile_picture: user.profile_picture || "",
      });
    }
  }, [userRes]);

  // Mutations

  if (isLoading) {
    return <PageSkeleton />;
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAvatarFile(file);
    setTempAvatarUrl(URL.createObjectURL(file)); // preview only
    e.target.value = ""; // allow re-selecting same file later
  };
  const handleSaveOrganization = async () => {
    try {
      const response = await updateAgency({ ...organization });
      if (response?.data) {
        queryClient.invalidateQueries({ queryKey: ["agency-profile"] });
        toast.success(
          response?.data?.message ?? "Profile update successfully."
        );
      }
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(
        err?.response?.data?.message ??
          "Profile update failed. Please try again."
      );
    }
  };

  const handleSavePersonal = async () => {
    let profileUrl: string | undefined;
    try {
      if (pendingAvatarFile) {
        const uploaded = await uploadFile(pendingAvatarFile);
        profileUrl = uploaded?.data?.url;
      }
      const response = await updateUser({
        first_name: personal.first_name,
        last_name: personal.last_name,
        phone_number: personal.phone_number,
        profile_picture: profileUrl ?? undefined,
      });

      if (response?.data) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        setUser({ ...user, ...response?.data?.data });
        toast.success(
          response?.data?.message ?? "Profile update successfully."
        );
      }

      if (profileUrl) {
        setPersonal((p) => ({ ...p, profile_picture: profileUrl ?? "" }));
        setPendingAvatarFile(null);
        setTempAvatarUrl(null);
      }
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(
        err?.response?.data?.message ??
          "Profile update failed. Please try again."
      );
    }
  };

  const toggleService = (serviceId: string) => {
    setOrganization((prev) => {
      const exists = prev.services_offered.includes(serviceId);
      const next = exists
        ? prev.services_offered.filter((s) => s !== serviceId)
        : [...prev.services_offered, serviceId];
      return { ...prev, services_offered: next };
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
        <p className="text-sm text-gray-500">
          Manage personal and organization profiles.
        </p>
      </div>

      {/* Personal Profile */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Personal Profile</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="w-24 h-24 border-primary border">
            <AvatarImage
              src={
                tempAvatarUrl ||
                personal.profile_picture ||
                `https://avatar.iran.liara.run/username?username=${removeInitialsFromName(
                  personal.first_name + personal.last_name
                )}`
              }
              alt={personal.first_name}
            />
          </Avatar>
          <div>
            <h3 className="font-medium">
              {personal.first_name} {personal.last_name}
            </h3>
            <p className="text-sm text-primary">Admin</p>
          </div>
          <div className="sm:ml-auto space-x-2">
            <Button
              disabled={uploadingAvatar}
              variant="outline"
              size="sm"
              onClick={handleClickUpload}
            >
              Upload new picture
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">First Name</Label>
            <Input
              value={personal.first_name}
              onChange={(e) =>
                setPersonal((p) => ({ ...p, first_name: e.target.value }))
              }
              className="bg-[#F9FAFB]"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Last Name</Label>
            <Input
              value={personal.last_name}
              onChange={(e) =>
                setPersonal((p) => ({ ...p, last_name: e.target.value }))
              }
              className="bg-[#F9FAFB]"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Work Email</Label>
            <Input value={personal.email} disabled className="bg-[#F9FAFB]" />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Mobile Number
            </Label>
            <Input
              value={personal.phone_number}
              onChange={(e) =>
                setPersonal((p) => ({ ...p, phone_number: e.target.value }))
              }
              className="bg-[#F9FAFB]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSavePersonal}
            isLoading={uploadingAvatar || updatingUser}
            disabled={updatingUser || loadingUser}
            className="bg-purple-100 text-primary hover:bg-purple-200"
          >
            Update profile
          </Button>
        </div>
      </div>

      {/* Organization Profile */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Agency Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Agency Name
            </Label>
            <Input
              value={organization.name}
              onChange={(e) =>
                setOrganization((o) => ({ ...o, name: e.target.value }))
              }
              className="bg-[#F9FAFB]"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Postal Code
            </Label>
            <Input
              value={organization.postal_code}
              onChange={(e) =>
                setOrganization((o) => ({ ...o, postal_code: e.target.value }))
              }
              className="bg-[#F9FAFB]"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <Label className="text-sm font-medium mb-2 block">
              Services Offered
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ServiceTypes.map((service) => (
                <label key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={organization.services_offered.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <span className="text-sm">{service.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveOrganization}
            disabled={updatingAgency || loadingAgency}
            isLoading={updatingAgency}
            className="bg-purple-100 text-primary hover:bg-purple-200"
          >
            Update Agency
          </Button>
        </div>
      </div>
    </div>
  );
}

const PageSkeleton = () => {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Personal Profile Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="ml-auto space-x-2 flex">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full col-span-2" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Organization Profile Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="col-span-2 space-y-3">
            <Skeleton className="h-4 w-36" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
    </div>
  );
};
