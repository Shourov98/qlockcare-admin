import { apiRequest } from "@/lib/api";

// Staff DTOs + API.
//
// The admin "Staff" sidebar item surfaces staff across every agency
// (SUPER_ADMIN-only). Backed by:
//   - GET /admin/people/staff — cross-tenant list (paginated, filterable)
//
// Cross-tenant mutations are intentionally out of scope for the
// admin_people router (see qclockcare_backend/src/modules/admin_people/
// router.py:16-20) — invitation emails, scheduling constraints, and
// other side effects belong to the agency-scoped path. So this module
// is read-only.

export type StaffStatus =
  | "INVITED"
  | "EMAIL_VERIFICATION_PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "LOCKED"
  | "ARCHIVED";

export type Staff = {
  id: string;
  agency_id: string;
  agency_name: string | null;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  staff_code: string;
  status: StaffStatus;
  hired_at: string | null;
  terminated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StaffListResult = {
  data: Staff[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

// Mirrors qclockcare_backend/src/shared/domain/enums.py UserStatus.
const STAFF_STATUS_LABEL: Record<StaffStatus, string> = {
  INVITED: "Invited",
  EMAIL_VERIFICATION_PENDING: "Pending",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  LOCKED: "Locked",
  ARCHIVED: "Archived",
};

export function staffStatusLabel(status: StaffStatus): string {
  return STAFF_STATUS_LABEL[status] ?? status;
}

export const STAFF_STATUS_STYLE: Record<StaffStatus, string> = {
  INVITED: "bg-amber-100 text-amber-700",
  EMAIL_VERIFICATION_PENDING: "bg-amber-100 text-amber-700",
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-slate-100 text-slate-600",
  LOCKED: "bg-red-100 text-red-700",
  ARCHIVED: "bg-slate-100 text-slate-500",
};

export function staffStatusStyle(status: StaffStatus): string {
  return STAFF_STATUS_STYLE[status] ?? STAFF_STATUS_STYLE.ARCHIVED;
}

export interface ListStaffArgs {
  page: number;
  pageSize: number;
  search?: string;
  statusFilter?: StaffStatus;
  agencyId?: string;
}

export async function listStaff(args: ListStaffArgs): Promise<StaffListResult> {
  const query = new URLSearchParams({
    page: String(args.page),
    page_size: String(args.pageSize),
  });
  if (args.search?.trim()) query.set("search", args.search.trim());
  if (args.statusFilter) query.set("status", args.statusFilter);
  if (args.agencyId) query.set("agency_id", args.agencyId);

  return apiRequest<StaffListResult>(`/admin/people/staff?${query.toString()}`);
}

// The cross-tenant endpoint doesn't expose a single-id GET. We fetch
// the first page (cheap at default page_size) and pick by id. If the
// row is on a later page we return a stub the caller can render and
// the user can refine with the search box.
export async function getStaff(id: string): Promise<Staff> {
  const result = await apiRequest<StaffListResult>(
    `/admin/people/staff?page=1&page_size=100`,
  );
  const match = result.data.find((s) => s.id === id);
  if (!match) {
    throw new Error("Staff not found in the first 100 rows — refine the search.");
  }
  return match;
}