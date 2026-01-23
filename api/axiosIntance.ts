import { baseReducer } from "@/store";
import axios, { AxiosError, AxiosRequestConfig } from "axios";



const axiosInstance = axios.create({
  baseURL: "https://api.livioca.com/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = baseReducer.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { setReset } = baseReducer.getState();
    const isUnauthorized = error.response && error.response.status === 401;
    if (isUnauthorized) {
      setReset();
    }
    return Promise.reject(error);
  }
);

export const getAxiosInstance = () => {
  return axiosInstance;
};

const noAuthAxiosInstance = axios.create({
  baseURL: "https://api.livioca.com/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

noAuthAxiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { setReset } = baseReducer.getState();
    const isUnauthorized = error.response && error.response.status === 401;
    if (isUnauthorized) {
      setReset();
    }
    return Promise.reject(error);
  }
);

export const getNoAuthAxiosInstance = () => {
  return noAuthAxiosInstance;
};

export const getRequest = async (url: string,  config?: AxiosRequestConfig) => {
  const res = await getAxiosInstance().get(`${url}`, config);
  return res;
};

export const postRequest = async <T extends unknown = unknown>(
  url: string,
  payload: T,
  config?: AxiosRequestConfig
) => {

 
  const res = await getAxiosInstance().post(url, payload, config);
  return res;
};
export const noAuthPostRequest = async <T extends unknown = unknown>(
  url: string,
  payload: T,
  config?: AxiosRequestConfig
) => {

 
  const res = await getNoAuthAxiosInstance().post(url, payload, config);
  return res;
};

export const patchRequest = async <T extends unknown = unknown>(
  url: string,
  payload: T,
  config?: AxiosRequestConfig
) => {
  const res = await getAxiosInstance().patch(`${url}`, payload, config);
  return res;
};

export const putRequest = async <T extends unknown = unknown>(
  url: string,
  payload: T,
  config?: AxiosRequestConfig
) => {
  console.log(payload);
  const res = await getAxiosInstance().put(`${url}`, payload, config);
  return res;
  // re
};

export const deleteRequest = async <T extends unknown = unknown>(
  url: string,
  payload: T
) => {
  const res = await getAxiosInstance().delete(`${url}`, { data: payload });
  return res;
};
