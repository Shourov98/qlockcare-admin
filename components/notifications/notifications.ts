import { apiRequest } from "@/lib/api";

// Mirrors qclockcare_backend/src/modules/notifications/schemas.py
export type NotificationType =
  | "visit_assigned"
  | "visit_completed"
  | "visit_issue"
  | "appointment_scheduled"
  | "appointment_cancelled"
  | "appointment_reminder"
  | "billing_invoice"
  | "billing_payment_failed"
  | "billing_subscription_canceled"
  | "compliance_credential_expiring"
  | "compliance_audit_due"
  | "staff_invitation"
  | "guardian_invitation"
  | "agency_invitation"
  | "system"
  | "custom";

export type NotificationStatus = "unread" | "read" | "archived";

export type Notification = {
  id: string;
  agency_id: string | null;
  recipient_user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  status: NotificationStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  read_at: string | null;
  expires_at: string | null;
};

export type NotificationListResponse = {
  data: Notification[];
  next_cursor: string | null;
  unread_count: number;
};

export type NotificationBadge = {
  unread_count: number;
};

export type NotificationPreference = {
  user_id: string;
  type: NotificationType;
  channel: "in_app" | "email" | "sms" | "push";
  opted_in: boolean;
  updated_at: string;
};

export interface ListNotificationsArgs {
  cursor?: string | null;
  limit?: number;
  unread_only?: boolean;
}

export interface UpdateNotificationPreferenceArgs {
  type: NotificationType;
  channel: "in_app" | "email" | "sms" | "push";
  opted_in: boolean;
}

export async function listNotifications(
  args: ListNotificationsArgs = {},
): Promise<NotificationListResponse> {
  const query = new URLSearchParams();
  if (args.cursor) query.set("cursor", args.cursor);
  if (args.limit) query.set("limit", String(args.limit));
  if (args.unread_only) query.set("unread_only", "true");
  const qs = query.toString();
  return apiRequest<NotificationListResponse>(
    `/notifications${qs ? `?${qs}` : ""}`,
  );
}

export async function getNotificationBadge(): Promise<NotificationBadge> {
  return apiRequest<NotificationBadge>("/notifications/badge");
}

export async function getNotification(id: string): Promise<Notification> {
  return apiRequest<Notification>(`/notifications/${id}`);
}

export async function markNotificationRead(id: string): Promise<Notification> {
  return apiRequest<Notification>(`/notifications/${id}/read`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function markAllNotificationsRead(): Promise<{
  updated: number;
}> {
  return apiRequest<{ updated: number }>(
    `/notifications/read-all`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
}

export async function listNotificationPreferences(): Promise<{
  data: NotificationPreference[];
}> {
  return apiRequest<{ data: NotificationPreference[] }>(
    `/notifications/preferences`,
  );
}

export async function updateNotificationPreference(
  args: UpdateNotificationPreferenceArgs,
): Promise<NotificationPreference> {
  return apiRequest<NotificationPreference>(
    `/notifications/preferences`,
    {
      method: "PUT",
      body: JSON.stringify(args),
    },
  );
}

// Map a notification type to the icon + color used by the
// notifications page. Keeps the visual language consistent with the
// website's notifications page.
export const TYPE_VISUAL: Record<
  NotificationType,
  { icon: "alert" | "doc" | "shield" | "system" | "calendar" | "message"; color: string; bg: string }
> = {
  visit_assigned:        { icon: "calendar", color: "text-blue-500",   bg: "bg-blue-100" },
  visit_completed:       { icon: "system",   color: "text-green-500",  bg: "bg-green-100" },
  visit_issue:           { icon: "alert",    color: "text-red-500",    bg: "bg-red-100" },
  appointment_scheduled: { icon: "calendar", color: "text-blue-500",   bg: "bg-blue-100" },
  appointment_cancelled: { icon: "alert",    color: "text-orange-500", bg: "bg-orange-100" },
  appointment_reminder:  { icon: "calendar", color: "text-blue-500",   bg: "bg-blue-100" },
  billing_invoice:       { icon: "doc",      color: "text-orange-500", bg: "bg-orange-100" },
  billing_payment_failed:{ icon: "alert",    color: "text-red-500",    bg: "bg-red-100" },
  billing_subscription_canceled: { icon: "alert", color: "text-red-500", bg: "bg-red-100" },
  compliance_credential_expiring: { icon: "shield", color: "text-yellow-600", bg: "bg-yellow-100" },
  compliance_audit_due:  { icon: "shield",   color: "text-yellow-600", bg: "bg-yellow-100" },
  staff_invitation:      { icon: "message",  color: "text-blue-500",   bg: "bg-blue-100" },
  guardian_invitation:   { icon: "message",  color: "text-blue-500",   bg: "bg-blue-100" },
  agency_invitation:     { icon: "message",  color: "text-blue-500",   bg: "bg-blue-100" },
  system:                { icon: "system",   color: "text-green-500",  bg: "bg-green-100" },
  custom:                { icon: "message",  color: "text-blue-500",   bg: "bg-blue-100" },
};

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