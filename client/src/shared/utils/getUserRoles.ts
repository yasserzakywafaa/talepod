import { User, UserRole } from "../user";

export const hasAdminRights = (user: User | null): boolean => {
  if (!user) return false;

  return user.role === UserRole.super_admin || user.role === UserRole.admin;
};
