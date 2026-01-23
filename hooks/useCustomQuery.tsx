"use client"
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { ApiResponse, ApiResponseError } from "@/interfaces/axios";
import { getRequest } from "@/api/axiosIntance";

interface QueryRequest {
  url: string;
  config?: AxiosRequestConfig;
  responseType?: "json" | "blob" | "arraybuffer" | "text";
}

export interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  page_size?: number;
  page_number?: number;
  results: T[];
}

const useCustomQuery = <T,>(
  queryRequest: QueryRequest,
  options?: Omit<
    UseQueryOptions<ApiResponse<T>, ApiResponseError>,
    "queryFn"
  >
) => {
  const { url, config, responseType = "json" } = queryRequest;

  const { data, ...rest } = useQuery<ApiResponse<T>, ApiResponseError>({
    queryKey: options?.queryKey ?? [url],
    queryFn: () =>
      getRequest(url, {
        ...config,
        responseType,
      }),
    staleTime: 180_000,
    enabled: Boolean(url),
    ...options,
  });

  return { 
    data: data?.data,
    response: data,
    ...rest 
  };
};

export default useCustomQuery;