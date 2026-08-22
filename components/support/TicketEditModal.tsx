"use client";

import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import {
    PRIORITY_LABEL,
    STATUS_LABEL,
    TicketDetail,
    TicketPriority,
    TicketStatus,
    getTicket,
    updateTicket,
} from './tickets';

interface TicketEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string | null;
    onSaved?: () => void;
}

const STATUS_OPTIONS: TicketStatus[] = [
    'OPEN',
    'IN_PROGRESS',
    'PENDING',
    'RESOLVED',
    'CLOSED',
];
const PRIORITY_OPTIONS: TicketPriority[] = [
    'CRITICAL',
    'HIGH',
    'MEDIUM',
    'LOW',
];

export function TicketEditModal({ isOpen, onClose, ticketId, onSaved }: TicketEditModalProps) {
    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TicketStatus>('OPEN');
    const [priority, setPriority] = useState<TicketPriority>('MEDIUM');

    useEffect(() => {
        if (!isOpen || !ticketId) {
            setTicket(null);
            return;
        }
        let mounted = true;
        setLoading(true);
        setError(null);
        getTicket(ticketId)
            .then((t) => {
                if (!mounted) return;
                setTicket(t);
                setTitle(t.title);
                setDescription(t.description);
                setStatus(t.status);
                setPriority(t.priority);
            })
            .catch((e) => {
                if (!mounted) return;
                setError(e instanceof Error ? e.message : 'Failed to load ticket');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, [isOpen, ticketId]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketId) return;
        setSaving(true);
        setError(null);
        try {
            await updateTicket(ticketId, {
                title: title.trim(),
                description: description.trim(),
                status,
                priority,
            });
            onSaved?.();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save ticket');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col border border-border">
                <div className="p-6 border-b border-border flex justify-between items-start shrink-0">
                    <h2 className="text-xl font-bold text-foreground">
                        {loading ? 'Loading…' : (ticket ? `Edit Ticket ${ticket.code}` : 'Edit Ticket')}
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading && (
                    <div className="p-12 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading ticket…
                    </div>
                )}

                {!loading && (
                    <form className="p-6 overflow-y-auto flex-1 space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                minLength={1}
                                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                minLength={1}
                                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as TicketStatus)}
                                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                >
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium text-sm hover:bg-muted/80 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                            >
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}