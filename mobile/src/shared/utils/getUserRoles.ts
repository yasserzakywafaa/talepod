import { hasAdminRights as hasAdminRightsCore } from "@yasserzakywafaa/client-core";

import type { User } from "src/shared/types/user";
import { UserRole } from "src/shared/types/user";

const ADMIN_ROLES = [UserRole.super_admin, UserRole.admin] as const;

export const hasAdminRights = (user: User | null): boolean =>
  hasAdminRightsCore(user, ADMIN_ROLES);
