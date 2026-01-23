import { ApiResponseError } from "@/interfaces/axios";
import { toast } from "sonner";
import useMutate from "./useMutate";

interface UploadResponse {
  data: { url: string; file_type: string };
  message: string;
}

export const useUploadFile = () => {
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

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await mutateAsync(formData);
      return response?.data;
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(err?.response?.data?.message ?? "Failed to upload file");
    }
  };

  return { uploadFile, isPending, error };
};
