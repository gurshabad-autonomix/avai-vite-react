import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MeResponse } from "@/types/auth";
import { ROLE, type UserRole } from "@/types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CONSOLE_BY_ROLE: Record<UserRole, string> = {
  [ROLE.AVAI_INT_ADMIN]: "/admin/console",
  [ROLE.AVAI_INT_SALES]: "/sales/console",
  [ROLE.AVAI_EXT_ORG_OWNER]: "/owner/console",
  [ROLE.AVAI_EXT_DEMO_USER]: "/welcome/invite",
  [ROLE.UNASSIGNED]: "/welcome/invite",
};

export function getRoleRedirectPath(role: UserRole): string {
  return CONSOLE_BY_ROLE[role.toUpperCase() as UserRole] ?? "/welcome/invite";
}

export function getConsolePath(role: UserRole): string {
  return CONSOLE_BY_ROLE[role.toUpperCase() as UserRole] ?? "/welcome/invite";
}

/**
 * Decide the next path based on /me response.
 * - If UNASSIGNED or unknown, go to /welcome (invite gate)
 * - If not onboarded, go to the role-specific setup path
 * - Else, go to the role console path
 */
export function getNextPathForUser(
  me: Pick<MeResponse, "role" | "onboarded">
): string {
  const r = me.role.toUpperCase() as UserRole;
  if (r === ROLE.UNASSIGNED) {
    return "/welcome/invite";
  }
  if (!me.onboarded) {
    return "/welcome/invite";
  }
  return getConsolePath(r);
}
