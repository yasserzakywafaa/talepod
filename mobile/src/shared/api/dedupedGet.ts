import type { AxiosRequestConfig, AxiosResponse } from "axios";

import { api } from "src/application/shared/apiClient";

const inFlightGets = new Map<string, Promise<AxiosResponse<unknown>>>();

const buildGetKey = (url: string, config?: AxiosRequestConfig): string => {
  const params = config?.params ? JSON.stringify(config.params) : "";
  return `${url}?${params}`;
};

/** Coalesces parallel GETs to the same URL (React re-mounts, strict mode, etc.). */
export const dedupedGet = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const key = buildGetKey(url, config);
  const existing = inFlightGets.get(key);
  if (existing) {
    return existing as Promise<AxiosResponse<T>>;
  }

  const request = api.get<T>(url, config).finally(() => {
    if (inFlightGets.get(key) === request) {
      inFlightGets.delete(key);
    }
  });

  inFlightGets.set(key, request as Promise<AxiosResponse<unknown>>);
  return request;
};
