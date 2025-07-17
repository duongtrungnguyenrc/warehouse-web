/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INTELLIGENT_URL: string;
  readonly VITE_SERVER_BASE_URL: string;
  readonly VITE_TOKEN_TYPE: string;
  readonly VITE_ACCESS_TOKEN_PREFIX: string;
  readonly VITE_REFRESH_TOKEN_PREFIX: string;
}
