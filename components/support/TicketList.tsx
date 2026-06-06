import React, { useState } from 'react';
import { Eye, Edit, Trash2, Search, ChevronDown } from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';
import { TicketViewModal } from './TicketViewModal';
import { TicketEditModal } from './TicketEditModal';
import { TicketDeleteModal } from './TicketDeleteModal';

interface TicketListProps {
    tickets: any[];
}

export function TicketList({ tickets }: TicketListProps) {
    const [ticketsPage, setTicketsPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isViewOpen, setViewOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsPerPage = 5;
    const totalItems = filteredTickets.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const startIndex = (ticketsPage - 1) * itemsPerPage;
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

    const getPriorityIconBg = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100';
            case 'High': return 'bg-orange-100';
            case 'Medium': return 'bg-yellow-100';
            case 'Low': return 'bg-green-100';
            default: return 'bg-muted';
        }
    };

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
        <div>
            <div className="py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-[24px] font-bold text-foreground">Support Tickets</h3>
                <div className="flex flex-wrap items-center justify-end gap-2 p-2">
                    <div className="relative flex items-center gap-2">
                        <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setTicketsPage(1);
                            }}
                            className="border border-border rounded-[12px] pl-9 pr-4 py-1.5 text-sm bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <div className="relative">
                                <select className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                    <option>All Agencies</option>
                                    <option>Digital Solutions Inc</option>
                                    <option>Creative Hub</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="relative">
                                <select className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                    <option>All Priorities</option>
                                    <option>Critical</option>
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="relative">
                                <select className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                    <option>All Status</option>
                                    <option>Open</option>
                                    <option>In Progress</option>
                                    <option>Pending</option>
                                    <option>Resolved</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="relative">
                                <select className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                    <option>All Agents</option>
                                    <option>Mike Chen</option>
                                    <option>Sarah Johnson</option>
                                    <option>David Park</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="relative">
                                <select className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>This Month</option>
                                    <option>All Time</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-[12px] overflow-x-auto">
                <table className="w-full text-left text-[14px] text-foreground">
                    <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium">Ticket ID</th>
                            <th className="px-6 py-4 font-medium">Agency</th>
                            <th className="px-6 py-4 font-medium">Issue</th>
                            <th className="px-6 py-4 font-medium">Description</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Priority</th>
                            <th className="px-6 py-4 font-medium">Assigned To</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTickets.map((ticket) => {
                            return (
                                <tr key={ticket.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-foreground">{ticket.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-muted-foreground mt-0.5">{ticket.agency}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground text-sm">{ticket.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[300px]">{ticket.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-muted-foreground mt-0.5">{ticket.date}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1.5">
                                            <span className={`text-xs font-semibold ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1.5">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPriorityIconBg(ticket.priority)} ${getPriorityTextColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-foreground">{ticket.assignee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => { setSelectedTicket(ticket); setViewOpen(true); }}
                                                className="text-muted-foreground hover:text-blue-500 transition-colors" title="View Ticket"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedTicket(ticket); setEditOpen(true); }}
                                                className="text-muted-foreground hover:text-orange-500 transition-colors" title="Edit Ticket"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedTicket(ticket); setDeleteOpen(true); }}
                                                className="text-muted-foreground hover:text-red-500 transition-colors" title="Delete Ticket"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="py-5 border-t border-border">
                <Pagination
                    currentPage={ticketsPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setTicketsPage}
                    itemName="tickets"
                />
            </div>

            <TicketViewModal
                isOpen={isViewOpen}
                onClose={() => { setViewOpen(false); setSelectedTicket(null); }}
                ticket={selectedTicket}
            />

            <TicketEditModal
                isOpen={isEditOpen}
                onClose={() => { setEditOpen(false); setSelectedTicket(null); }}
                ticket={selectedTicket}
            />

            <TicketDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => { setDeleteOpen(false); setSelectedTicket(null); }}
                ticket={selectedTicket}
            />
        </div>
    );
}
