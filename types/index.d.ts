import type { NormalizedCacheObject } from "@apollo/client";

export {};

declare global {
  interface Window {
    __INITIAL_STATE__: NormalizedCacheObject;
    ENV: {
      API_URL: string;
    };
  }
}
