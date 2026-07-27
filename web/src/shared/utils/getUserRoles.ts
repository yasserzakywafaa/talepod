import { hasAdminRights as hasAdminRightsCore } from "@yasserzakywafaa/client-core";
import { User, UserRole } from "../types/user";

const ADMIN_ROLES = [UserRole.super_admin, UserRole.admin] as const;

export const hasAdminRights = (user: User | null): boolean =>
  hasAdminRightsCore(user, ADMIN_ROLES);
