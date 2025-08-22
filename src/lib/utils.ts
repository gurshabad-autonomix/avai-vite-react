import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRoleRedirectPath(role: string): string {
  switch (role) {
    case "avai_int_admin":
      return "/admin/console";
    case "avai_int_sales":
      return "/sales/console";
    case "avai_ext_org_owner":
      return "/owner/console";
    default:
      return "/";
  }
}

export function getProfileSetupPath(role: string): string {
  switch (role) {
    case "avai_int_admin":
      return "/admin/profile-setup";
    case "avai_int_sales":
      return "/sales/profile-setup";
    case "avai_ext_org_owner":
      return "/owner/onboarding";
    default:
      return "/";
  }
}

export function getConsolePath(role: string): string {
  switch (role) {
    case "avai_int_admin":
      return "/admin/console";
    case "avai_int_sales":
      return "/sales/console";
    case "avai_ext_org_owner":
      return "/owner/console";
    default:
      return "/";
  }
}
