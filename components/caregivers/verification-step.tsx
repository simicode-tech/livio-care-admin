"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CaregiverFormData } from "./schema";
import { useUploadFile } from "@/hooks/useUploadFile";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { ApiResponseError } from "@/interfaces/axios";
import { X } from "lucide-react";

interface VerificationStepProps {
  form: UseFormReturn<CaregiverFormData>;
}

export function VerificationStep({ form }: VerificationStepProps) {
  const { uploadFile, isPending } = useUploadFile();
  const certificationsInputRef = useRef<HTMLInputElement>(null);
  const dbsInputRef = useRef<HTMLInputElement>(null);
  const [certificateName, setCertificateName] = useState("");
  const [pendingFile, setPendingFile] = useState<string | null>(null);

  const handleCertificationsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await uploadFile(file);
        if (result?.data?.url) {
          setPendingFile(result.data.url);
          setCertificateName(file.name.split('.')[0]); // Pre-fill with filename, but user can edit
          toast.success("File uploaded successfully. Please enter certificate name.");
        }
      } catch (error) {
        const err = error as ApiResponseError;
        toast.error(
          err?.response?.data?.message ?? "Failed to upload certification"
        );
      }
    }
    // Reset the input
    if (certificationsInputRef.current) {
      certificationsInputRef.current.value = "";
    }
  };

  const handleAddCertification = () => {
    if (!certificateName.trim()) {
      toast.error("Please enter a certificate name");
      return;
    }
    if (!pendingFile) {
      toast.error("Please upload a file first");
      return;
    }

    const currentCertifications = form.getValues("certifications") || [];
    const newCertification = {
      certificate_name: certificateName.trim(),
      file: pendingFile
    };
    form.setValue("certifications", [...currentCertifications, newCertification]);
    toast.success("Certification added successfully");
    
    // Reset form
    setCertificateName("");
    setPendingFile(null);
  };

  const handleDbsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await uploadFile(file);
        if (result?.data?.url) {
          form.setValue("dbs_certificate", result.data.url);
          toast.success("DBS certificate uploaded successfully");
        }
      } catch (error) {
        const err = error as ApiResponseError;
        toast.error(
          err?.response?.data?.message ?? "Failed to upload DBS certificate"
        );
      }
    }
    // Reset the input
    if (dbsInputRef.current) {
      dbsInputRef.current.value = "";
    }
  };

  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      // Remove any query parameters
      return fileName.split('?')[0] || 'Unknown file';
    } catch {
      return 'Unknown file';
    }
  };

  const handleDeleteCertification = (indexToDelete: number) => {
    const currentCertifications = form.getValues("certifications") || [];
    const updatedCertifications = currentCertifications.filter((_, index) => index !== indexToDelete);
    form.setValue("certifications", updatedCertifications);
    toast.success("Certification deleted successfully");
  };

  const watchedCertifications = form.watch("certifications") || [];
  const watchedDbsCertificate = form.watch("dbs_certificate");

  return (
    <div className="space-y-6">
      {/* Background Check Status */}
      <FormField
        control={form.control}
        name="background_check_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Background Check Status
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* DBS Certificate Upload */}
      <div className="space-y-4">
        <FormLabel className="text-sm font-medium text-gray-700">
          DBS Certificate
        </FormLabel>
        <div className="flex items-center gap-4">
          <input
            ref={dbsInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleDbsUpload}
            className="hidden"
            id="dbs-upload"
            disabled={isPending}
          />
          <label
            htmlFor="dbs-upload"
            className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 inline-block"
          >
            {isPending ? "Uploading..." : "Upload DBS Certificate"}
          </label>
        </div>
        
        {/* Display uploaded DBS certificate */}
        {watchedDbsCertificate && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                📄 {getFileNameFromUrl(watchedDbsCertificate)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  form.setValue("dbs_certificate", "");
                  toast.success("DBS certificate removed");
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Certifications Upload */}
      <div className="space-y-4">
        <FormLabel className="text-sm font-medium text-gray-700">
          Professional Certifications
        </FormLabel>
        
        {/* Upload and Add Certification Form */}
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-4">
            <input
              ref={certificationsInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleCertificationsUpload}
              className="hidden"
              id="certifications-upload"
              disabled={isPending}
            />
            <label
              htmlFor="certifications-upload"
              className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 inline-block"
            >
              {isPending ? "Uploading..." : "Upload File"}
            </label>
            {pendingFile && (
              <span className="text-sm text-green-600">
                ✓ File uploaded: {getFileNameFromUrl(pendingFile)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Input
              placeholder="Enter certificate name (e.g., First Aid Certificate)"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              className="flex-1 h-11 px-4 bg-white border-gray-300 rounded-lg focus:ring-primary/20 focus:border-primary"
            />
            <Button
              type="button"
              onClick={handleAddCertification}
              disabled={!certificateName.trim() || !pendingFile}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Certificate
            </Button>
          </div>
        </div>
        
        {/* Display uploaded certifications */}
        {watchedCertifications.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Uploaded Certifications:</h4>
            {watchedCertifications.map((cert, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {cert.certificate_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      📄 {getFileNameFromUrl(cert.file)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCertification(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}