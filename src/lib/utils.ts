import axios, { type AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

import {
  ACCESS_TOKEN_PREFIX,
  REFRESH_TOKEN_PREFIX,
  TOKEN_TYPE,
} from "./constants";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const saveAuthToken = (token: TokenPair): void => {
  Cookies.set(ACCESS_TOKEN_PREFIX, token.accessToken, {
    secure: process.env.NODE_ENV === "production",
    expires: 60 * 60 * 1000, // 1h
    path: "/",
  });

  Cookies.set(REFRESH_TOKEN_PREFIX, token.refreshToken, {
    secure: process.env.NODE_ENV === "production",
    expires: 14 * 24 * 60 * 60 * 1000, // 14 days
    path: "/",
  });
};

export const clearAuthToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_PREFIX);
  Cookies.remove(REFRESH_TOKEN_PREFIX);
};

export const getAuthToken = (): Partial<TokenPair> => {
  const accessToken = Cookies.get(ACCESS_TOKEN_PREFIX);
  const refreshToken = Cookies.get(REFRESH_TOKEN_PREFIX);

  return {
    accessToken,
    refreshToken,
  };
};

export const getAuthorizationToken = (): string => {
  const token = getAuthToken();

  return `${TOKEN_TYPE} ${token.accessToken}`;
};

export const catchError = (
  e: unknown,
  callback?: (cause: string) => void
): string => {
  if (axios.isAxiosError(e)) {
    const error = e as AxiosError<any>;

    const message =
      error.response?.data?.message || error.message || "Unexpected API error";

    callback?.(message);

    return message;
  } else if (e instanceof Error) {
    const message = "Error: " + e.message;

    callback?.(message);
    return message;
  } else {
    const message = "Unknown error occurred";

    callback?.(message);
    return message;
  }
};

export const toastOnError = (e: unknown) => {
  const cause = catchError(e);
  toast.error(cause);
};
