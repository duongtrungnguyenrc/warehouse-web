import axios, { type AxiosError } from "axios";

import { getAuthorizationToken, getAuthToken, NO_REFRESH_ROUTES, SERVER_BASE_URL } from "@/lib";
import { AccountService } from "@/services";

const httpClient = axios.create({
  baseURL: SERVER_BASE_URL,
});

httpClient.interceptors.request.use((config) => {
  config.headers.authorization = getAuthorizationToken();

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
