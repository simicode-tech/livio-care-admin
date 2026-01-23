import { useMutation } from "@tanstack/react-query";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "@/api/axiosIntance";
import type { ApiResponse, ApiResponseError } from "../interfaces/axios";
import { type AxiosRequestConfig } from "axios";
// import { postRequest } from "@/api/axiosIntance";

// Define a generic type for the mutation request
interface MutateRequest {
  type: "post" | "delete" | "patch" | "get" | "put";
  url: string;
  config?: AxiosRequestConfig;
}

const useMutate = <Response, Payload>({ type, url, config }: MutateRequest) => {
  const {
    data: resp,
    mutateAsync: originalMutate,
    isPending,
    error,
  } = useMutation<
    ApiResponse<Response>,
    ApiResponseError,
    { payload?: Payload; urlParams?: Record<string, string | number> }
  >({
    mutationFn: async ({ payload, urlParams }) => {
      const finalUrl = urlParams
        ? url.replace(/:([\w]+)/g, (_, key) => String(urlParams[key] || ""))
        : url;

      switch (type) {
        case "post":
          return await postRequest(finalUrl, payload, config);
        case "put":
          return await putRequest(finalUrl, payload, config);
        case "patch":
          return await patchRequest(finalUrl, payload, config);
        case "delete":
          return await deleteRequest(finalUrl, payload);
        case "get":
          return await getRequest(finalUrl);
        default:
          throw new Error("Unsupported HTTP method");
      }
    },
  });

  const data = resp?.data;

  // Wrap mutateAsync to maintain the desired API
  const mutateAsync = async (
    payload?: Payload,
    urlParams?: Record<string, string | number>
  ) => {
    return originalMutate({ payload, urlParams });
  };

  return { data, mutateAsync, isPending, error };
};

export default useMutate;
