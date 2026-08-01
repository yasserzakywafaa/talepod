import axios from "axios";

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
  networkFallback?: string,
): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    return (
      networkFallback ??
      "Cannot reach the API server. Check DEV_PORT, Wi‑Fi, and restart Expo after .env changes."
    );
  }

  const message = error.response.data?.message;
  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  return fallback;
};
