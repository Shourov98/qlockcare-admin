import React from 'react';
import { X, Clock, MessageSquare, Paperclip } from 'lucide-react';

interface TicketViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: any;
}

export function TicketViewModal({ isOpen, onClose, ticket }: TicketViewModalProps) {
    if (!isOpen || !ticket) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col border border-border">
                <div className="p-6 border-b border-border flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-foreground">{ticket.id}</h2>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                                {ticket.priority}
                            </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">{ticket.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-sm font-medium text-muted-foreground mb-1">Agency</span>
                            <span className="text-sm text-foreground">{ticket.agency}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-muted-foreground mb-1">Status</span>
                            <span className="text-sm text-foreground">{ticket.status}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-muted-foreground mb-1">Assigned To</span>
                            <span className="text-sm text-foreground">{ticket.assignee.name}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-muted-foreground mb-1">Reported By</span>
                            <span className="text-sm text-foreground">{ticket.reporter.name}</span>
                        </div>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-muted-foreground mb-2">Description</span>
                        <div className="bg-muted/30 p-4 rounded-lg border border-border text-sm text-foreground">
                            {ticket.description}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> {ticket.timeAgo}
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> {ticket.comments} comments
                        </div>
                        <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4" /> {ticket.files} files
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border flex justify-end shrink-0">
                    <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
