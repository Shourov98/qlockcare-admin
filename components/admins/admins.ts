import { apiRequest } from "@/lib/api";

export type AdminStatus =
  | "INVITED"
  | "EMAIL_VERIFICATION_PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "LOCKED"
  | "ARCHIVED";

type PlatformAdmin = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  status: AdminStatus;
  email_verified: boolean;
  role: "SUPER_ADMIN";
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

export type AdminCreateInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

export type AdminUpdateInput = {
  name?: string;
  email?: string;
  phone?: string;
  status?: AdminStatus;
  password?: string;
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
      password: input.password,
    }),
  });
  return mapAdmin(result);
}

export async function updateAdmin(id: string, input: AdminUpdateInput): Promise<Admin> {
  const body: Record<string, string | null> = {};
  if (input.name !== undefined) body.full_name = input.name;
  if (input.email !== undefined) body.email = input.email;
  if (input.phone !== undefined) body.phone = input.phone || null;
  if (input.status !== undefined) body.status = input.status;
  if (input.password) body.password = input.password;

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
