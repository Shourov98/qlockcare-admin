import { apiRequest } from "@/lib/api";

// Client (Patient) DTOs + API.
//
// The admin "Clients" sidebar item surfaces patients across every
// agency (SUPER_ADMIN-only). Two endpoints back the page:
//   - GET /admin/people/patients — cross-tenant list (preferred)
//   - GET /patients/{id}/with-relationships — single patient deep view
//
// The cross-tenant endpoint is preferred because RLS-scoped `/patients`
// rejects SUPER_ADMIN (it requires an agency_id). We only fall back to
// the single-patient endpoint for the "View" modal where we need the
// full relationship graph.

export type PatientStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type Patient = {
  id: string;
  agency_id: string;
  agency_name: string | null;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  patient_code: string;
  status: PatientStatus;
  date_of_birth: string | null;
  gender: string | null;
  preferred_language: string | null;
  care_notes: string | null;
  admitted_at: string | null;
  discharged_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PatientListResult = {
  data: Patient[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

// Mirrors qclockcare_backend/src/shared/domain/enums.py PatientStatus.
const PATIENT_STATUS_LABEL: Record<PatientStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ARCHIVED: "Archived",
};

export function patientStatusLabel(status: PatientStatus): string {
  return PATIENT_STATUS_LABEL[status] ?? status;
}

export const PATIENT_STATUS_STYLE: Record<PatientStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-red-100 text-red-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

export function patientStatusStyle(status: PatientStatus): string {
  return PATIENT_STATUS_STYLE[status] ?? PATIENT_STATUS_STYLE.ARCHIVED;
}

export interface ListClientsArgs {
  page: number;
  pageSize: number;
  search?: string;
  statusFilter?: PatientStatus;
  agencyId?: string;
}

export async function listClients(
  args: ListClientsArgs,
): Promise<PatientListResult> {
  const query = new URLSearchParams({
    page: String(args.page),
    page_size: String(args.pageSize),
  });
  if (args.search?.trim()) query.set("search", args.search.trim());
  if (args.statusFilter) query.set("status", args.statusFilter);
  if (args.agencyId) query.set("agency_id", args.agencyId);

  return apiRequest<PatientListResult>(
    `/admin/people/patients?${query.toString()}`,
  );
}

export type ClientGuardianLink = {
  id: string;
  patient_id: string;
  guardian_id: string;
  relationship: string;
  is_primary: boolean;
  // Denormalized for the modal — not all backend responses include them
  guardian_name?: string | null;
  guardian_email?: string | null;
  guardian_phone?: string | null;
};

export type PatientDeepView = Patient & {
  guardians: ClientGuardianLink[];
};

export async function getClient(id: string): Promise<PatientDeepView> {
  // Single-patient deep view is RLS-scoped to one tenant. SUPER_ADMIN
  // can call it as long as their JWT carries a matching agency context
  // — which isn't true here. We fall back to the cross-tenant row plus
  // an empty guardians array; a real guardians API for cross-tenant
  // will land in a follow-up.
  const row = await apiRequest<Patient>(`/admin/people/patients?q=${id}`).catch(
    async () => {
      // If `/admin/people/patients` doesn't take an id filter (the
      // current backend only filters on agency_id/status/search), fall
      // back to listing and picking by id. The list endpoint is cheap
      // at default page_size.
      const list = await apiRequest<PatientListResult>(
        `/admin/people/patients?page=1&page_size=100`,
      );
      const match = list.data.find((p) => p.id === id);
      if (!match) {
        throw new Error("Patient not found");
      }
      return match;
    },
  );
  return { ...row, guardians: [] };
}