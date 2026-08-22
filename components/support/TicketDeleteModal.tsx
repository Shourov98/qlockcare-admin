"use client";

import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { TicketDetail, getTicket } from './tickets';

interface TicketDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string | null;
    onConfirm: (id: string) => Promise<void> | void;
}

export function TicketDeleteModal({ isOpen, onClose, ticketId, onConfirm }: TicketDeleteModalProps) {
    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

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

    const handleDelete = async () => {
        if (!ticketId) return;
        setDeleting(true);
        try {
            await onConfirm(ticketId);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-card rounded-xl shadow-lg w-full max-w-md border border-border">
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">Delete Ticket</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading…
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-foreground mb-4">
                                Are you sure you want to delete ticket{' '}
                                <span className="font-bold">{ticket?.code ?? ticketId}</span>?
                                This action cannot be undone and will remove the ticket from the
                                dashboard view.
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg border border-border">
                                <span className="block text-xs font-semibold text-muted-foreground mb-1">
                                    Subject
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {ticket?.title ?? '—'}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/20 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-card border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting || loading}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {deleting ? 'Deleting…' : 'Delete Ticket'}
                    </button>
                </div>
            </div>
        </div>
    );
}