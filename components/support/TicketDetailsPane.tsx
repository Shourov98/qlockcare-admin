import React from 'react';
import { X, Paperclip } from 'lucide-react';

interface TicketDetailsPaneProps {
    ticket: any;
    onClose: () => void;
}

export function TicketDetailsPane({ ticket, onClose }: TicketDetailsPaneProps) {
    if (!ticket) return null;
    const getPriorityTextColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-500';
            case 'High': return 'text-orange-500';
            case 'Medium': return 'text-yellow-600';
            case 'Low': return 'text-green-500';
            default: return 'text-muted-foreground';
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'text-blue-500';
            case 'In Progress': return 'text-orange-500';
            case 'Pending': return 'text-purple-500';
            case 'Resolved': return 'text-green-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-start">
                <h3 className="font-bold text-foreground">Ticket Details</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-foreground">{ticket.id}</h2>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted ${getPriorityTextColor(ticket.priority)}`}>
                            {ticket.priority}
                        </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{ticket.title}</h3>
                    <p className="text-sm text-muted-foreground">{ticket.agency}</p>
                </div>

                <hr className="border-border mb-6" />

                <div className="mb-8">
                    <h4 className="font-semibold text-foreground text-sm mb-4">{ticket.title}</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className={`font-semibold ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Priority</span>
                            <span className={`font-semibold ${getPriorityTextColor(ticket.priority)}`}>{ticket.priority}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Agency</span>
                            <span className="text-foreground">{ticket.agency}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Assigned to</span>
                            <span className="text-foreground">{ticket.assignee.name}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="font-semibold text-foreground text-sm mb-4">SLA Details</h4>
                    <div className="bg-muted/30 border border-border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-red-500">Response Time</span>
                            <span className="text-xs font-medium text-red-500">{ticket.slaRemaining}</span>
                        </div>
                        <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${ticket.slaPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="font-semibold text-foreground text-sm mb-4">Activity Timeline</h4>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
                        {ticket.timeline.map((event: any, idx: number) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-3 h-3 rounded-full border-2 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${event.active ? 'bg-blue-500' : 'bg-muted-foreground'}`}></div>
                                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">{event.title}</span>
                                        <span className="text-xs text-muted-foreground">{event.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {ticket.attachments && ticket.attachments.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-foreground text-sm mb-4">Attachments</h4>
                        <div className="space-y-2">
                            {ticket.attachments.map((file: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{file.name}</span>
                                    </div>
                                    <button className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
