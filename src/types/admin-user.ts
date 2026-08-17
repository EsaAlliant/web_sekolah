import type { AdminRole } from "@/lib/permissions";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  createdAt: string;
}
