"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Edit, Trash2, Search, ChevronDown, Loader2 } from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';
import { TicketViewModal } from './TicketViewModal';
import { TicketEditModal } from './TicketEditModal';
import { TicketDeleteModal } from './TicketDeleteModal';
import {
    Ticket,
    TicketPriority,
    TicketStatus,
    deleteTicket,
    listTickets,
    priorityBg,
    priorityTextColor,
    PRIORITY_LABEL,
    STATUS_LABEL,
    statusColor,
} from './tickets';

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

export function TicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
    const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
    const [isViewOpen, setViewOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const itemsPerPage = 5;

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await listTickets({
                page,
                pageSize: itemsPerPage,
                ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
                ...(statusFilter ? { status: statusFilter } : {}),
                ...(priorityFilter ? { priority: priorityFilter } : {}),
            });
            setTickets(result.data);
            setTotalPages(result.pagination.total_pages);
            setTotal(result.pagination.total);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to load tickets';
            setError(message);
            setTickets([]);
            setTotalPages(1);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // Refresh when filters change (server-side filter changes page→1).
    const onFilterChange = () => {
        setPage(1);
        // Trigger a refresh — listTickets is called in useEffect after page changes.
    };

    const onSearchChange = (value: string) => {
        setSearchQuery(value);
        onFilterChange();
    };

    const onStatusChange = (value: string) => {
        const next = value === '' ? '' : (value as TicketStatus);
        setStatusFilter(next);
        onFilterChange();
    };

    const onPriorityChange = (value: string) => {
        const next = value === '' ? '' : (value as TicketPriority);
        setPriorityFilter(next);
        onFilterChange();
    };

    // Trigger refresh after filter changes (the useEffect on `page` won't fire
    // because page may already be 1; this explicit effect covers it).
    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, statusFilter, priorityFilter]);

    const handleDelete = async (id: string) => {
        await deleteTicket(id);
        setDeleteOpen(false);
        setSelectedTicketId(null);
        refresh();
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
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="border border-border rounded-[12px] pl-9 pr-4 py-1.5 text-sm bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <div className="relative">
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => onPriorityChange(e.target.value)}
                                    className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">All Priorities</option>
                                    {PRIORITY_OPTIONS.map((p) => (
                                        <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => onStatusChange(e.target.value)}
                                    className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">All Status</option>
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-card rounded-[12px] overflow-x-auto">
                <table className="w-full text-left text-[14px] text-foreground">
                    <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium">Ticket ID</th>
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Description</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Priority</th>
                            <th className="px-6 py-4 font-medium">Attachments</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && tickets.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                                Loading…
                                </td>
                            </tr>
                        )}
                        {!loading && tickets.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                                    No tickets match your filters.
                                </td>
                            </tr>
                        )}
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-foreground">{ticket.code}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-foreground text-sm">{ticket.title}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[300px]">
                                        {ticket.description || "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-muted-foreground mt-0.5">{ticket.createdAt}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-start gap-1.5">
                                        <span className={`text-xs font-semibold ${statusColor(ticket.status)}`}>
                                            {STATUS_LABEL[ticket.status]}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-start gap-1.5">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityBg(ticket.priority)} ${priorityTextColor(ticket.priority)}`}>
                                            {PRIORITY_LABEL[ticket.priority]}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        {ticket.attachmentCount}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => { setSelectedTicketId(ticket.id); setViewOpen(true); }}
                                            className="text-muted-foreground hover:text-blue-500 transition-colors" title="View Ticket"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedTicketId(ticket.id); setEditOpen(true); }}
                                            className="text-muted-foreground hover:text-orange-500 transition-colors" title="Edit Ticket"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedTicketId(ticket.id); setDeleteOpen(true); }}
                                            className="text-muted-foreground hover:text-red-500 transition-colors" title="Delete Ticket"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="py-5 border-t border-border">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={total}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPage}
                    itemName="tickets"
                />
            </div>

            <TicketViewModal
                isOpen={isViewOpen}
                onClose={() => { setViewOpen(false); setSelectedTicketId(null); }}
                ticketId={selectedTicketId}
            />

            <TicketEditModal
                isOpen={isEditOpen}
                onClose={() => { setEditOpen(false); setSelectedTicketId(null); }}
                ticketId={selectedTicketId}
                onSaved={() => {
                    setEditOpen(false);
                    setSelectedTicketId(null);
                    refresh();
                }}
            />

            <TicketDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => { setDeleteOpen(false); setSelectedTicketId(null); }}
                ticketId={selectedTicketId}
                onConfirm={handleDelete}
            />
        </div>
    );
}