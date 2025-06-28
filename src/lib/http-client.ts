import axios, { type AxiosError } from "axios";

import { NO_REFRESH_ROUTES } from "./constants";

import { getAuthorizationToken, getAuthToken } from "@/lib/utils.ts";
import { AccountService } from "@/services";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
});

httpClient.interceptors.request.use((config) => {
  const authToken = getAuthorizationToken();

  if (authToken) {
    config.headers.authorization = authToken;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || NO_REFRESH_ROUTES.some((route) => originalRequest.url?.includes(route))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const tokens = getAuthToken();

      if (tokens.refreshToken) {
        const result = await AccountService.refreshToken({ refreshToken: tokens.refreshToken });

        if (result) {
          const newToken = getAuthorizationToken();

          originalRequest.headers.set("Authorization", newToken);

          return httpClient(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  },
);

export { httpClient };
