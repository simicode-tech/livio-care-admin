import { ApiResponseError } from "@/interfaces/axios";
import { toast } from "sonner";
import useMutate from "./useMutate";
// import { ApiResponseError } from "../types";
// import useMutate from "./useMutation";
// import type { ApiResponseError } from "../interfaces/axios";

interface UploadResponse {
  url:string;
  file_type: string;
}

export const useImageUpload = () => {
  const { mutateAsync, isPending, error } = useMutate<UploadResponse, FormData>(
    {
      url: "core/upload/",
      type: "post",
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    }
  );

  const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await mutateAsync(formData);
      return response?.data;
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data?.message ?? "Failed to upload image");
    }
    // Append each file with image[] as the field name
  };

  const uploadSingleImage = async (file: File) => {
    const result = await uploadImages([file]);
    return result;
  };

  return { uploadImages, uploadSingleImage, isPending, error };
};
