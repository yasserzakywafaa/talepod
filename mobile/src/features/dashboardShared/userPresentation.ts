import {
  formatLocalizedDate,
  formatLocalizedDateTime,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";

import { UserRole, UserStatus, type User } from "src/shared/types/user";
import type { AdminChipTone } from "src/features/dashboardShared/AdminStatusChip";

/** Same mapping as web `getUserTypeColor`. */
export const getUserRoleTone = (role: UserRole): AdminChipTone => {
  switch (role) {
    case UserRole.super_admin:
    case UserRole.admin:
      return "warning";
    case UserRole.user:
      return "info";
    default:
      return "neutral";
  }
};

/** Same mapping as web `getUserTypeLabel`. */
export const getUserRoleLabel = (
  role: UserRole,
  t: (key: string) => string,
): string => {
  switch (role) {
    case UserRole.super_admin:
      return t("admin.users.roleSuperAdmin");
    case UserRole.admin:
      return t("admin.users.roleAdmin");
    case UserRole.user:
      return t("admin.users.roleRegular");
    default:
      return role;
  }
};

/** Same mapping as web `getUserStatusColor`. */
export const getUserStatusTone = (status: UserStatus): AdminChipTone => {
  switch (status) {
    case UserStatus.active:
      return "success";
    case UserStatus.suspended:
    case UserStatus.banned:
      return "error";
    case UserStatus.inactive:
    default:
      return "neutral";
  }
};

/**
 * Blocking sets `banned`, so that is the state the unblock action reverses.
 * `suspended` is set elsewhere and is deliberately not treated as blocked.
 */
export const isUserBlocked = (status: UserStatus): boolean =>
  status === UserStatus.banned;

/** `#A1B2C3` — the short form the web grid prints under a user's name. */
export const getUserShortId = (user: User): string => {
  const id = user.userId || user._id || "";
  return id.length > 8 ? `#${id.slice(-6).toUpperCase()}` : `#${id.toUpperCase()}`;
};

export const formatAdminDate = (
  value: Date | string | undefined,
  language: string,
): string =>
  formatLocalizedDate(value ?? new Date(), localeFromLanguage(language), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatAdminDateTime = (
  value: Date | string | undefined,
  language: string,
): string =>
  formatLocalizedDateTime(value ?? new Date(), localeFromLanguage(language));
