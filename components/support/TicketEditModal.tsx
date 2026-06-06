import React from 'react';
import { X } from 'lucide-react';

interface TicketEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: any;
}

export function TicketEditModal({ isOpen, onClose, ticket }: TicketEditModalProps) {
    if (!isOpen || !ticket) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col border border-border">
                <div className="p-6 border-b border-border flex justify-between items-start shrink-0">
                    <h2 className="text-xl font-bold text-foreground">Edit Ticket {ticket.id}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form className="p-6 overflow-y-auto flex-1 space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                        <input 
                            type="text" 
                            defaultValue={ticket.title} 
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                        <textarea 
                            rows={4} 
                            defaultValue={ticket.description} 
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                            <select defaultValue={ticket.status} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Pending</option>
                                <option>Resolved</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                            <select defaultValue={ticket.priority} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                <option>Critical</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Agency</label>
                            <input 
                                type="text" 
                                defaultValue={ticket.agency} 
                                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Assigned To</label>
                            <select defaultValue={ticket.assignee.name} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                <option>Mike Chen</option>
                                <option>Sarah Johnson</option>
                                <option>David Park</option>
                                <option>Unassigned</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium text-sm hover:bg-muted/80 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
