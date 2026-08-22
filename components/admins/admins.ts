import { apiRequest } from "@/lib/api";

// Mirror qclockcare_backend/src/shared/domain/enums.py
export type AdminStatus =
  | "INVITED"
  | "EMAIL_VERIFICATION_PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "LOCKED"
  | "ARCHIVED";

// Mirror qclockcare_backend AdminScope enum (UPPERCASE)
export type AdminScope = "AGENCIES" | "CLINICAL" | "SUPPORT";

// Mirror backend's PlatformAdminResponse
type PlatformAdmin = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  status: AdminStatus;
  email_verified: boolean;
  role: "SUPER_ADMIN" | "PLATFORM_ADMIN";
  scopes: AdminScope[];
  created_at: string;
  updated_at: string;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: AdminStatus;
  emailVerified: boolean;
  role: "SUPER_ADMIN" | "PLATFORM_ADMIN";
  scopes: AdminScope[];
  createdAt: string;
  updatedAt: string;
};

export type AdminListResult = {
  data: Admin[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

type PlatformAdminListResult = {
  data: PlatformAdmin[];
  pagination: AdminListResult["pagination"];
};

// New create shape: no password (invitation flow), scopes required.
export type AdminCreateInput = {
  name: string;
  email: string;
  phone?: string;
  scopes: AdminScope[];
};

export type AdminUpdateInput = {
  name?: string;
  email?: string;
  phone?: string;
  status?: AdminStatus;
  password?: string;
  scopes?: AdminScope[];
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
}

function mapAdmin(admin: PlatformAdmin): Admin {
  return {
    id: admin.id,
    name: admin.full_name,
    email: admin.email,
    phone: admin.phone || "",
    status: admin.status,
    emailVerified: admin.email_verified,
    role: admin.role,
    scopes: admin.scopes,
    createdAt: formatDate(admin.created_at),
    updatedAt: formatDate(admin.updated_at),
  };
}

export async function listAdmins(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<AdminListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  const result = await apiRequest<PlatformAdminListResult>(`/admin/admins?${query}`);
  return {
    data: result.data.map(mapAdmin),
    pagination: result.pagination,
  };
}

export async function createAdmin(input: AdminCreateInput): Promise<Admin> {
  const result = await apiRequest<PlatformAdmin>("/admin/admins", {
    method: "POST",
    body: JSON.stringify({
      full_name: input.name,
      email: input.email,
      phone: input.phone || null,
      scopes: input.scopes,
    }),
  });
  return mapAdmin(result);
}

export async function updateAdmin(id: string, input: AdminUpdateInput): Promise<Admin> {
  const body: Record<string, string | string[] | null> = {};
  if (input.name !== undefined) body.full_name = input.name;
  if (input.email !== undefined) body.email = input.email;
  if (input.phone !== undefined) body.phone = input.phone || null;
  if (input.status !== undefined) body.status = input.status;
  if (input.password) body.password = input.password;
  if (input.scopes !== undefined) body.scopes = input.scopes;

  const result = await apiRequest<PlatformAdmin>(`/admin/admins/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return mapAdmin(result);
}

export async function deleteAdmin(id: string): Promise<void> {
  await apiRequest<void>(`/admin/admins/${id}`, {
    method: "DELETE",
  });
}

// Display helpers — used by AdminViewModal / AdminEditModal chips.
export const SCOPE_LABEL: Record<AdminScope, string> = {
  AGENCIES: "Agencies",
  CLINICAL: "Clinical",
  SUPPORT: "Support",
};

export const SCOPE_DESCRIPTION: Record<AdminScope, string> = {
  AGENCIES: "View and update agency status, plan, suspension across tenants.",
  CLINICAL: "View clients and staff across tenants (read-only).",
  SUPPORT: "View audit logs and notifications across tenants.",
};
