import { User } from "src/shared/types/user";

/**
 * Users can register via Google (email) or phone OTP (phoneNumber), so display
 * whichever contact they actually have. Email takes precedence when both exist.
 */
export const getUserContact = (
  user: Pick<User, "email" | "phoneNumber">,
): string => user.email || user.phoneNumber || "—";

/** Label matching the value returned by getUserContact, for single-user views. */
export const getUserContactLabel = (
  user: Pick<User, "email" | "phoneNumber">,
): string => (user.email ? "Email" : user.phoneNumber ? "Phone" : "Contact");
