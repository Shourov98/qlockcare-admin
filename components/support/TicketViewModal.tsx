"use client";

import React, { useEffect, useState } from 'react';
import { X, Clock, MessageSquare, Paperclip, Loader2 } from 'lucide-react';
import {
    TicketDetail,
    PRIORITY_LABEL,
    STATUS_LABEL,
    formatRelative,
    getTicket,
    priorityBg,
    priorityTextColor,
} from './tickets';

interface TicketViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string | null;
}

export function TicketViewModal({ isOpen, onClose, ticketId }: TicketViewModalProps) {
    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !ticketId) {
            setTicket(null);
            return;
        }
        let mounted = true;
        setLoading(true);
        getTicket(ticketId)
            .then((t) => {
                if (mounted) setTicket(t);
            })
            .catch(() => {
                if (mounted) setTicket(null);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, [isOpen, ticketId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col border border-border">
                <div className="p-6 border-b border-border flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-foreground">
                                {loading ? 'Loading…' : (ticket?.code ?? 'Ticket')}
                            </h2>
                            {ticket && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityBg(ticket.priority)} ${priorityTextColor(ticket.priority)} uppercase`}>
                                    {PRIORITY_LABEL[ticket.priority]}
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">
                            {ticket?.title ?? '—'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading && (
                    <div className="p-12 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading ticket…
                    </div>
                )}

                {!loading && ticket && (
                    <div className="p-6 overflow-y-auto flex-1 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-sm font-medium text-muted-foreground mb-1">Status</span>
                                <span className="text-sm text-foreground">{STATUS_LABEL[ticket.status]}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-muted-foreground mb-1">Agency</span>
                                <span className="text-sm text-foreground">
                                    {ticket.agencyId ?? 'Cross-tenant'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-muted-foreground mb-1">Assignee</span>
                                <span className="text-sm text-foreground">
                                    {ticket.assigneeId ? ticket.assigneeId.slice(0, 8) + '…' : 'Unassigned'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-muted-foreground mb-1">Reporter</span>
                                <span className="text-sm text-foreground">
                                    {ticket.reporterId.slice(0, 8) + '…'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="block text-sm font-medium text-muted-foreground mb-2">Description</span>
                            <div className="bg-muted/30 p-4 rounded-lg border border-border text-sm text-foreground whitespace-pre-wrap">
                                {ticket.description}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> {formatRelative(ticket.createdAt + 'T00:00:00Z')}
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> {ticket.comments.length} comments
                            </div>
                            <div className="flex items-center gap-2">
                                <Paperclip className="w-4 h-4" /> {ticket.attachmentCount} files
                            </div>
                        </div>

                        {ticket.comments.length > 0 && (
                            <div>
                                <span className="block text-sm font-medium text-muted-foreground mb-2">Timeline</span>
                                <div className="space-y-3">
                                    {ticket.comments.map((c) => (
                                        <div key={c.id} className="bg-muted/30 p-3 rounded-lg border border-border text-sm">
                                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                <span>
                                                    {c.author?.full_name ?? 'System'} · {c.kind}
                                                </span>
                                                <span>{formatRelative(c.created_at)}</span>
                                            </div>
                                            <div className="text-foreground whitespace-pre-wrap">{c.body}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-4 border-t border-border flex justify-end shrink-0">
                    <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}