import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface TicketDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: any;
}

export function TicketDeleteModal({ isOpen, onClose, ticket }: TicketDeleteModalProps) {
    if (!isOpen || !ticket) return null;

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
                    <p className="text-sm text-foreground mb-4">
                        Are you sure you want to delete ticket <span className="font-bold">{ticket.id}</span>? 
                        This action cannot be undone and will permanently remove all associated data and attachments.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg border border-border">
                        <span className="block text-xs font-semibold text-muted-foreground mb-1">Ticket Subject</span>
                        <span className="text-sm font-medium text-foreground">{ticket.title}</span>
                    </div>
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/20 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted transition-colors">
                        Cancel
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 transition-colors shadow-sm">
                        Delete Ticket
                    </button>
                </div>
            </div>
        </div>
    );
}
