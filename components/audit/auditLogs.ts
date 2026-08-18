import { apiRequest } from "@/lib/api";

// Mirrors qclockcare_backend/src/modules/audit_logs/schemas.py
export type AuditAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT" | "OTHER";

export type AuditLog = {
  id: string;
  agency_id: string | null;
  actor_user_id: string | null;
  action: AuditAction;
  entity_type: string;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  new_data: Record<string, unknown> | null;
  old_data: Record<string, unknown> | null;
  created_at: string;
  // Optional denormalized fields the backend sometimes returns
  actor_email?: string | null;
  actor_name?: string | null;
};

export type AuditLogListResponse = {
  data: AuditLog[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

export interface ListAuditLogsArgs {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  action?: AuditAction;
  entityType?: string;
  agencyId?: string;
  actorUserId?: string;
}

export async function listAuditLogs(
  args: ListAuditLogsArgs = {},
): Promise<AuditLogListResponse> {
  const query = new URLSearchParams({
    page: String(args.page || 1),
    page_size: String(args.pageSize || 25),
  });
  if (args.dateFrom) query.set("date_from", args.dateFrom);
  if (args.dateTo) query.set("date_to", args.dateTo);
  if (args.action) query.set("action", args.action);
  if (args.entityType) query.set("entity_type", args.entityType);
  if (args.agencyId) query.set("agency_id", args.agencyId);
  if (args.actorUserId) query.set("actor_user_id", args.actorUserId);

  return apiRequest<AuditLogListResponse>(
    `/audit-logs?${query.toString()}`,
  );
}

export async function getAuditLog(id: string): Promise<AuditLog> {
  return apiRequest<AuditLog>(`/audit-logs/${id}`);
}

const ACTION_STYLES: Record<AuditAction, string> = {
  CREATE: "bg-green-100 text-green-700",
  READ: "bg-slate-100 text-slate-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  LOGIN: "bg-purple-100 text-purple-700",
  LOGOUT: "bg-slate-100 text-slate-600",
  EXPORT: "bg-yellow-100 text-yellow-700",
  OTHER: "bg-slate-100 text-slate-600",
};

export function actionStyle(action: AuditAction): string {
  return ACTION_STYLES[action] || ACTION_STYLES.OTHER;
}

export function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toISOString().split("T")[0];
}