import axios from "axios";

export type AdminFeedbackVariant = "success" | "error";

export interface AdminFeedback {
  message: string;
  variant: AdminFeedbackVariant;
}

/**
 * The web pops a global toast from its managers via `Notify`. Mobile has no
 * global toast host, so the admin stores keep the last message in state and
 * the screen renders it with `AppToast` — same feedback, local ownership.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (message) {
      return message;
    }
  }
  return fallback;
};
