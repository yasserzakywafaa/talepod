import { parsePhoneNumber } from "libphonenumber-js";

/** Normalizes user input to E.164 when valid; mirrors web PhoneOtpAuthForm. */
export const validatePhoneNumber = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = parsePhoneNumber(trimmed);
    if (!parsed?.isValid()) {
      return null;
    }
    return parsed.format("E.164");
  } catch {
    return null;
  }
};
