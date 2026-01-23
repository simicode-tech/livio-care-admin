"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CaregiverFormData } from "./schema";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ApiResponseError } from "@/interfaces/axios";

interface PersonalInfoStepProps {
  form: UseFormReturn<CaregiverFormData>;
  profilePicture?: string | null;
}

export function PersonalInfoStep({ form, profilePicture }: PersonalInfoStepProps) {
  const [profileImage, setProfileImage] = useState<string | null>(
    profilePicture ?? null
  );
  const { uploadFile, isPending } = useUploadFile();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await uploadFile(file);
      if (result?.data?.url) {
        setProfileImage(result?.data?.url);
        form.setValue("profile_picture", result.data?.url);
        toast.success("Profile picture uploaded successfully");
      }
      } catch (error) {
          const err = error as ApiResponseError;
        toast.error(
          err?.response?.data?.message ?? "Failed to upload profile picture"
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-[80px] h-[80px] rounded-full bg-[#F3F4F6] flex items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full h-20 w-20 object-cover"
                unoptimized
              />
            ) : (
              <svg
                className="w-8 h-8 text-[#9CA3AF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>
          <label className="absolute bottom-1 right-1 bg-primary w-5 h-5 rounded-full cursor-pointer flex items-center justify-center">
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
              disabled={isPending}
            />
            {isPending ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
            {/* <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg> */}
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full name"
                  {...field}
                  className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Gender
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Date of Birth
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="DD-MM-YYYY"
                    {...field}
                    className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Contact Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter contact number"
                    {...field}
                    className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter address"
                  {...field}
                  className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 pt-6">
        <h3 className="text-base font-medium text-gray-900">
          Emergency Contact
        </h3>
        <FormField
          control={form.control}
          name="emergency_contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full name"
                  {...field}
                  className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergency_contact_relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Relationship
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="daughter">Daughter</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emergency_contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergency_contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Contact Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter contact number"
                    {...field}
                    className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="emergency_contact_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter address"
                  {...field}
                  className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}