import { apiRequest } from "@/lib/api";

// Mirror qclockcare_backend/src/shared/domain/enums.py
export type DocumentType =
  | "LICENSE"
  | "CERTIFICATE"
  | "DOCUMENT"
  | "PERMIT"
  | "POLICY"
  | "REPORT";

export type DocumentStatus =
  | "MISSING"
  | "PENDING"
  | "VALID"
  | "EXPIRING"
  | "EXPIRED"
  | "REJECTED";

export type LicenseStatus =
  | "VALID"
  | "UPCOMING"
  | "WARNING"
  | "CRITICAL"
  | "EXPIRED";

// Mirror backend AgencyDocumentResponse
type AgencyDocumentBackend = {
  id: string;
  agency_id: string;
  name: string;
  doc_type: DocumentType;
  status: DocumentStatus;
  description: string | null;
  expires_at: string | null;
  file_url: string | null;
  extra: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

// Mirror backend AgencyLicenseResponse
type AgencyLicenseBackend = {
  id: string;
  agency_id: string;
  name: string;
  doc_type: DocumentType;
  status: LicenseStatus;
  issued_at: string | null;
  expires_at: string;
  reference_number: string | null;
  notes: string | null;
  extra: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

// Mirror backend ComplianceStatsResponse
export type ComplianceStats = {
  documents_total: number;
  documents_missing: number;
  documents_expiring: number;
  documents_expired: number;
  documents_valid: number;
  licenses_total: number;
  licenses_critical: number;
  licenses_warning: number;
  licenses_upcoming: number;
  licenses_valid: number;
  licenses_expired: number;
};

// Display shapes
export type AgencyDocument = {
  id: string;
  agencyId: string;
  name: string;
  docType: DocumentType;
  status: DocumentStatus;
  description: string | null;
  expiresAt: string | null;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AgencyLicense = {
  id: string;
  agencyId: string;
  name: string;
  docType: DocumentType;
  status: LicenseStatus;
  issuedAt: string | null;
  expiresAt: string;
  referenceNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Computed for display — days until expiry.
  daysUntil: number;
};

export type DocumentListResult = {
  data: AgencyDocument[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

export type LicenseListResult = {
  data: AgencyLicense[];
  pagination: DocumentListResult["pagination"];
};

export type DocumentCreateInput = {
  agency_id: string;
  name: string;
  doc_type?: DocumentType;
  status?: DocumentStatus;
  description?: string | null;
  expires_at?: string | null;
  file_url?: string | null;
};

export type DocumentUpdateInput = Partial<{
  name: string;
  doc_type: DocumentType;
  status: DocumentStatus;
  description: string | null;
  expires_at: string | null;
  file_url: string | null;
}>;

export type LicenseCreateInput = {
  agency_id: string;
  name: string;
  expires_at: string;
  doc_type?: DocumentType;
  issued_at?: string | null;
  reference_number?: string | null;
  notes?: string | null;
};

export type LicenseUpdateInput = Partial<{
  name: string;
  doc_type: DocumentType;
  status: LicenseStatus;
  issued_at: string | null;
  expires_at: string;
  reference_number: string | null;
  notes: string | null;
}>;

// --------------------------------------------------------------------------
// Mappers
// --------------------------------------------------------------------------
function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
}

function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 0;
  const diffMs = date.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function mapDocument(d: AgencyDocumentBackend): AgencyDocument {
  return {
    id: d.id,
    agencyId: d.agency_id,
    name: d.name,
    docType: d.doc_type,
    status: d.status,
    description: d.description,
    expiresAt: formatDate(d.expires_at),
    fileUrl: d.file_url,
    createdAt: formatDate(d.created_at),
    updatedAt: formatDate(d.updated_at),
  };
}

function mapLicense(l: AgencyLicenseBackend): AgencyLicense {
  return {
    id: l.id,
    agencyId: l.agency_id,
    name: l.name,
    docType: l.doc_type,
    status: l.status,
    issuedAt: formatDate(l.issued_at),
    expiresAt: formatDate(l.expires_at),
    referenceNumber: l.reference_number,
    notes: l.notes,
    createdAt: formatDate(l.created_at),
    updatedAt: formatDate(l.updated_at),
    daysUntil: daysUntil(l.expires_at),
  };
}

// --------------------------------------------------------------------------
// Stats
// --------------------------------------------------------------------------
export async function getComplianceStats(): Promise<ComplianceStats> {
  return apiRequest<ComplianceStats>("/admin/compliance/stats");
}

// --------------------------------------------------------------------------
// Documents
// --------------------------------------------------------------------------
export async function listDocuments(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: DocumentStatus;
  agency_id?: string;
}): Promise<DocumentListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.agency_id) query.set("agency_id", params.agency_id);

  const result = await apiRequest<{
    data: AgencyDocumentBackend[];
    pagination: DocumentListResult["pagination"];
  }>(`/admin/compliance/documents?${query}`);
  return {
    data: result.data.map(mapDocument),
    pagination: result.pagination,
  };
}

export async function listMissingDocuments(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<DocumentListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });
  if (params.search?.trim()) query.set("search", params.search.trim());

  const result = await apiRequest<{
    data: AgencyDocumentBackend[];
    pagination: DocumentListResult["pagination"];
  }>(`/admin/compliance/documents/missing?${query}`);
  return {
    data: result.data.map(mapDocument),
    pagination: result.pagination,
  };
}

export async function createDocument(input: DocumentCreateInput): Promise<AgencyDocument> {
  const result = await apiRequest<AgencyDocumentBackend>(
    "/admin/compliance/documents",
    {
      method: "POST",
      body: JSON.stringify({
        agency_id: input.agency_id,
        name: input.name,
        doc_type: input.doc_type ?? "DOCUMENT",
        status: input.status ?? "MISSING",
        description: input.description ?? null,
        expires_at: input.expires_at ?? null,
        file_url: input.file_url ?? null,
      }),
    },
  );
  return mapDocument(result);
}

export async function updateDocument(
  id: string,
  input: DocumentUpdateInput,
): Promise<AgencyDocument> {
  const result = await apiRequest<AgencyDocumentBackend>(
    `/admin/compliance/documents/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
  return mapDocument(result);
}

export async function deleteDocument(id: string): Promise<void> {
  await apiRequest<void>(`/admin/compliance/documents/${id}`, { method: "DELETE" });
}

// --------------------------------------------------------------------------
// Licenses
// --------------------------------------------------------------------------
export async function listLicenses(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: LicenseStatus;
  expiring_within_days?: number;
  agency_id?: string;
}): Promise<LicenseListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (typeof params.expiring_within_days === "number") {
    query.set("expiring_within_days", String(params.expiring_within_days));
  }
  if (params.agency_id) query.set("agency_id", params.agency_id);

  const result = await apiRequest<{
    data: AgencyLicenseBackend[];
    pagination: LicenseListResult["pagination"];
  }>(`/admin/compliance/licenses?${query}`);
  return {
    data: result.data.map(mapLicense),
    pagination: result.pagination,
  };
}

export async function createLicense(input: LicenseCreateInput): Promise<AgencyLicense> {
  const result = await apiRequest<AgencyLicenseBackend>(
    "/admin/compliance/licenses",
    {
      method: "POST",
      body: JSON.stringify({
        agency_id: input.agency_id,
        name: input.name,
        expires_at: input.expires_at,
        doc_type: input.doc_type ?? "LICENSE",
        issued_at: input.issued_at ?? null,
        reference_number: input.reference_number ?? null,
        notes: input.notes ?? null,
      }),
    },
  );
  return mapLicense(result);
}

export async function updateLicense(
  id: string,
  input: LicenseUpdateInput,
): Promise<AgencyLicense> {
  const result = await apiRequest<AgencyLicenseBackend>(
    `/admin/compliance/licenses/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
  return mapLicense(result);
}

export async function deleteLicense(id: string): Promise<void> {
  await apiRequest<void>(`/admin/compliance/licenses/${id}`, { method: "DELETE" });
}

// --------------------------------------------------------------------------
// Display helpers
// --------------------------------------------------------------------------
export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  LICENSE: "License",
  CERTIFICATE: "Certificate",
  DOCUMENT: "Document",
  PERMIT: "Permit",
  POLICY: "Policy",
  REPORT: "Report",
};

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  MISSING: "Missing",
  PENDING: "Pending",
  VALID: "Valid",
  EXPIRING: "Expiring",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
};

export const LICENSE_STATUS_LABEL: Record<LicenseStatus, string> = {
  VALID: "Valid",
  UPCOMING: "Upcoming",
  WARNING: "Warning",
  CRITICAL: "Critical",
  EXPIRED: "Expired",
};

export function documentStatusColor(status: DocumentStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "MISSING":
      return { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" };
    case "EXPIRED":
      return { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" };
    case "EXPIRING":
      return { bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-100" };
    case "PENDING":
      return { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100" };
    case "VALID":
      return { bg: "bg-green-50", text: "text-green-500", border: "border-green-100" };
    case "REJECTED":
      return { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-100" };
  }
}

export function licenseStatusColor(status: LicenseStatus): string {
  switch (status) {
    case "CRITICAL":
      return "text-red-600 dark:text-red-500";
    case "WARNING":
      return "text-orange-500 dark:text-orange-400";
    case "UPCOMING":
      return "text-blue-500 dark:text-blue-400";
    case "EXPIRED":
      return "text-red-700 dark:text-red-600";
    case "VALID":
    default:
      return "text-primary";
  }
}

export function daysUntilColor(days: number): string {
  if (days <= 14) return "text-red-600 dark:text-red-500";
  if (days <= 45) return "text-orange-500 dark:text-orange-400";
  return "text-primary";
}