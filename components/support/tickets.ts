import { apiRequest } from "@/lib/api";

// Mirror qclockcare_backend/src/shared/domain/enums.py
export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "PENDING"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type TicketCommentKind =
  | "COMMENT"
  | "STATUS_CHANGE"
  | "ASSIGNMENT"
  | "ATTACHMENT";

// Mirror backend TicketListItemResponse
type TicketListItemBackend = {
  id: string;
  code: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  agency_id: string | null;
  reporter_user_id: string;
  assignee_user_id: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  attachment_count: number;
};

// Mirror backend TicketResponse (with comments + author)
type TicketAuthor = {
  id: string;
  full_name: string;
  email: string;
};

type TicketComment = {
  id: string;
  ticket_id: string;
  author_user_id: string;
  author: TicketAuthor | null;
  kind: TicketCommentKind;
  body: string;
  event_metadata: Record<string, unknown>;
  edited_at: string | null;
  created_at: string;
  updated_at: string;
};

type TicketBackend = Omit<TicketListItemBackend, "attachment_count"> & {
  description: string;
  extra: Record<string, unknown>;
  comments: TicketComment[];
};

// Mirror backend TicketStatsResponse
export type TicketStats = {
  total: number;
  by_status: Record<TicketStatus, number>;
  by_priority: Record<TicketPriority, number>;
};

// Display shapes — FE-friendly names.
export type Ticket = {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  agencyId: string | null;
  reporterId: string;
  assigneeId: string | null;
  attachmentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type TicketDetail = Ticket & {
  comments: TicketComment[];
  deletedAt: string | null;
};

export type TicketListResult = {
  data: Ticket[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

export type TicketCommentInput = {
  body: string;
  kind?: TicketCommentKind;
  event_metadata?: Record<string, unknown>;
};

export type TicketUpdateInput = Partial<{
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  agency_id: string | null;
  assignee_user_id: string | null;
}>;

export type TicketCreateInput = {
  title: string;
  description: string;
  priority?: TicketPriority;
  agency_id?: string | null;
  assignee_user_id?: string | null;
};

// --------------------------------------------------------------------------
// Mappers
// --------------------------------------------------------------------------
function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
}

function formatRelative(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} d ago`;
  return formatDate(value);
}

function mapListItem(t: TicketListItemBackend): Ticket {
  return {
    id: t.id,
    code: t.code,
    title: t.title,
    description: "", // not loaded in list view
    status: t.status,
    priority: t.priority,
    agencyId: t.agency_id,
    reporterId: t.reporter_user_id,
    assigneeId: t.assignee_user_id,
    attachmentCount: t.attachment_count ?? 0,
    createdAt: formatDate(t.created_at),
    updatedAt: formatDate(t.updated_at),
  };
}

function mapDetail(t: TicketBackend): TicketDetail {
  return {
    id: t.id,
    code: t.code,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    agencyId: t.agency_id,
    reporterId: t.reporter_user_id,
    assigneeId: t.assignee_user_id,
    attachmentCount: 0,
    createdAt: formatDate(t.created_at),
    updatedAt: formatDate(t.updated_at),
    deletedAt: t.deleted_at,
    comments: t.comments,
  };
}

// --------------------------------------------------------------------------
// API calls
// --------------------------------------------------------------------------
export async function listTickets(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
}): Promise<TicketListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.priority) query.set("priority", params.priority);

  const result = await apiRequest<{
    data: TicketListItemBackend[];
    pagination: TicketListResult["pagination"];
  }>(`/admin/tickets?${query}`);
  return {
    data: result.data.map(mapListItem),
    pagination: result.pagination,
  };
}

export async function getTicketStats(): Promise<TicketStats> {
  return apiRequest<TicketStats>("/admin/tickets/stats");
}

export async function getTicket(id: string): Promise<TicketDetail> {
  const result = await apiRequest<TicketBackend>(
    `/admin/tickets/${id}?_=${Date.now()}`,
  );
  return mapDetail(result);
}

export async function createTicket(
  input: TicketCreateInput,
): Promise<TicketDetail> {
  const result = await apiRequest<TicketBackend>("/admin/tickets", {
    method: "POST",
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      priority: input.priority ?? "MEDIUM",
      agency_id: input.agency_id ?? null,
      assignee_user_id: input.assignee_user_id ?? null,
    }),
  });
  return mapDetail(result);
}

export async function updateTicket(
  id: string,
  input: TicketUpdateInput,
): Promise<TicketDetail> {
  const result = await apiRequest<TicketBackend>(
    `/admin/tickets/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
  return mapDetail(result);
}

export async function deleteTicket(id: string): Promise<void> {
  await apiRequest<void>(`/admin/tickets/${id}`, {
    method: "DELETE",
  });
}

export async function addComment(
  ticketId: string,
  input: TicketCommentInput,
): Promise<TicketComment> {
  return apiRequest<TicketComment>(
    `/admin/tickets/${ticketId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({
        body: input.body,
        kind: input.kind ?? "COMMENT",
        event_metadata: input.event_metadata ?? {},
      }),
    },
  );
}

// --------------------------------------------------------------------------
// Display helpers — used by TicketList / TicketViewModal
// --------------------------------------------------------------------------
export const STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  PENDING: "Pending",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export function statusColor(status: TicketStatus): string {
  switch (status) {
    case "OPEN":
      return "text-blue-500";
    case "IN_PROGRESS":
      return "text-orange-500";
    case "PENDING":
      return "text-purple-500";
    case "RESOLVED":
      return "text-green-500";
    case "CLOSED":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
}

export function priorityBg(priority: TicketPriority): string {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-100";
    case "HIGH":
      return "bg-orange-100";
    case "MEDIUM":
      return "bg-yellow-100";
    case "LOW":
      return "bg-green-100";
    default:
      return "bg-muted";
  }
}

export function priorityTextColor(priority: TicketPriority): string {
  switch (priority) {
    case "CRITICAL":
      return "text-red-500";
    case "HIGH":
      return "text-orange-500";
    case "MEDIUM":
      return "text-yellow-600";
    case "LOW":
      return "text-green-500";
    default:
      return "text-muted-foreground";
  }
}

export { formatRelative };