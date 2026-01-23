import { AxiosResponse, AxiosError } from "axios";


type ApiError = {
    message: string;
    errorCode: number;
    errors: Record;
    error: string
};

type ApiResponse<T = unknown> = AxiosResponse<T>;
type ApiResponseError = AxiosError<ApiError>
