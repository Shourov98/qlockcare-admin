import { Paperclip, X } from "lucide-react";

import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  TicketDetail,
  TicketPriority,
  TicketStatus,
  formatRelative,
  priorityTextColor,
  statusColor,
  ticketAttachments,
} from "./tickets";

interface TicketDetailsPaneProps {
  ticket: TicketDetail | null;
  onClose: () => void;
}

export function TicketDetailsPane({ ticket, onClose }: TicketDetailsPaneProps) {
  if (!ticket) return null;

  const attachments = ticketAttachments(ticket.comments);
  const timeline = [...ticket.comments].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between border-b border-border p-6">
        <h3 className="font-bold text-foreground">Ticket details</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close ticket details"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">{ticket.code}</h2>
            <span
              className={`rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold ${priorityTextColor(ticket.priority as TicketPriority)}`}
            >
              {PRIORITY_LABEL[ticket.priority]}
            </span>
          </div>
          <h3 className="mb-1 font-semibold text-foreground">{ticket.title}</h3>
          <p className="text-sm text-muted-foreground">{ticket.description}</p>
        </div>

        <hr className="mb-6 border-border" />

        <div className="mb-8">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Details</h4>
          <div className="space-y-3 text-sm">
            <DetailRow label="Status">
              <span className={`font-semibold ${statusColor(ticket.status as TicketStatus)}`}>
                {STATUS_LABEL[ticket.status]}
              </span>
            </DetailRow>
            <DetailRow label="Priority">
              <span className={`font-semibold ${priorityTextColor(ticket.priority as TicketPriority)}`}>
                {PRIORITY_LABEL[ticket.priority]}
              </span>
            </DetailRow>
            <DetailRow label="Agency">{ticket.agencyId ?? "Platform"}</DetailRow>
            <DetailRow label="Assigned to">{ticket.assigneeId ?? "Unassigned"}</DetailRow>
            <DetailRow label="Reported by">{ticket.reporterId}</DetailRow>
            <DetailRow label="Updated">{formatRelative(ticket.updatedAt)}</DetailRow>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Activity timeline</h4>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity has been recorded.</p>
          ) : (
            <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-[5px] before:w-0.5 before:bg-border">
              {timeline.map((comment) => (
                <div key={comment.id} className="relative flex gap-4">
                  <div className="z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-card bg-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{comment.body}</p>
                    <p className="text-xs text-muted-foreground">
                      {comment.author?.full_name ?? "System"} · {comment.kind.replaceAll("_", " ")} · {formatRelative(comment.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {attachments.length > 0 && (
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Attachments</h4>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.commentId} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm text-foreground">{attachment.name}</span>
                  </div>
                  {attachment.url ? (
                    <a href={attachment.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">Download</a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Link unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-all text-right text-foreground">{children}</span>
    </div>
  );
}
