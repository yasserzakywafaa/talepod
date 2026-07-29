import { AuthProviderEnum, type User } from "src/shared/types/user";

export type UserProfileContactKind = "email" | "phone";

export interface UserProfileContact {
  kind: UserProfileContactKind;
  value: string;
  openUrl?: string;
}

const hasText = (value?: string): boolean => Boolean(value?.trim());

/**
 * Primary sign-in identifier for profile UI (phone OTP vs email OAuth).
 */
export const getUserProfileContact = (user: User): UserProfileContact => {
  const email = user.email?.trim() ?? "";
  const phone = user.phoneNumber?.trim() ?? "";

  const preferPhone =
    user.provider === AuthProviderEnum.phone ||
    (hasText(phone) && !hasText(email));

  if (preferPhone && phone) {
    return { kind: "phone", value: phone, openUrl: `tel:${phone}` };
  }

  return {
    kind: "email",
    value: email,
    openUrl: email ? `mailto:${email}` : undefined,
  };
};
