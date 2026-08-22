"use client";

import React, { useEffect, useState } from 'react';
import { Search, Download, Plus, Loader2 } from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';
import { ComplianceLicenseAddModal } from './ComplianceLicenseAddModal';
import {
    AgencyLicense,
    LICENSE_STATUS_LABEL,
    LicenseStatus,
    daysUntilColor,
    deleteLicense,
    documentStatusColor,
    DOCUMENT_TYPE_LABEL,
    licenseStatusColor,
    listLicenses,
} from './compliance';

const STATUS_OPTIONS: LicenseStatus[] = [
    'CRITICAL',
    'WARNING',
    'UPCOMING',
    'VALID',
    'EXPIRED',
];

export function ExpiringLicensesTable() {
    const [licenses, setLicenses] = useState<AgencyLicense[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | LicenseStatus>('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 5;

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await listLicenses({
                page,
                pageSize: itemsPerPage,
                ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
                ...(statusFilter !== 'All' ? { status: statusFilter } : {}),
            });
            setLicenses(result.data);
            setTotalPages(result.pagination.total_pages);
            setTotal(result.pagination.total);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to load licenses';
            setError(msg);
            setLicenses([]);
            setTotalPages(1);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, statusFilter]);

    const onSearchChange = (value: string) => {
        setSearchQuery(value);
        setPage(1);
    };

    const onStatusChange = (value: string) => {
        setStatusFilter(value === 'All' ? 'All' : (value as LicenseStatus));
        setPage(1);
    };

    const handleExport = () => {
        const headers = ['ID', 'Agency', 'Document Type', 'Document Name', 'Expiry Date', 'Days Until', 'Status'];
        const csvContent = [
            headers.join(','),
            ...licenses.map((lic) =>
                `${lic.id},"${lic.agencyId}","${DOCUMENT_TYPE_LABEL[lic.docType]}","${lic.name}","${lic.expiresAt}",${lic.daysUntil},${LICENSE_STATUS_LABEL[lic.status]}`,
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'expiring_licenses.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-[24px] font-bold text-foreground">Expiring Licenses & Documents</h3>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 p-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="px-3 py-1.5 bg-card border border-border rounded-[12px] text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                        <option value="All">All Statuses</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{LICENSE_STATUS_LABEL[s]}</option>
                        ))}
                    </select>
                    <div className="relative flex items-center gap-2">
                        <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="border border-border rounded-[12px] pl-9 pr-4 py-1.5 text-sm bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-[12px] text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-[12px] text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Document
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 mt-4 text-sm">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto bg-card border border-border rounded-[12px]">
                <table className="w-full text-left text-[14px] text-foreground">
                    <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium">Document Type</th>
                            <th className="px-6 py-4 font-medium">Document Name</th>
                            <th className="px-6 py-4 font-medium">Expiry Date</th>
                            <th className="px-6 py-4 font-medium">Days Until Expiry</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Reference</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && licenses.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                                Loading…
                                </td>
                            </tr>
                        )}
                        {!loading && licenses.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                    No licenses match your filters.
                                </td>
                            </tr>
                        )}
                        {licenses.map((lic) => (
                            <tr key={lic.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                                <td className="px-6 py-4 text-muted-foreground">{DOCUMENT_TYPE_LABEL[lic.docType]}</td>
                                <td className="px-6 py-4 text-foreground">{lic.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{lic.expiresAt}</td>
                                <td className={`px-6 py-4 font-medium ${daysUntilColor(lic.daysUntil)}`}>
                                    {lic.daysUntil} days
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-medium ${licenseStatusColor(lic.status)}`}>
                                        {LICENSE_STATUS_LABEL[lic.status]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground text-sm">
                                    {lic.referenceNumber ?? '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-3 text-sm font-medium">
                                        <button className="text-primary font-semibold transition-colors">Renew</button>
                                        <button className="text-primary font-semibold transition-colors">View</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
                itemName="licenses"
            />

            <ComplianceLicenseAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onCreated={() => {
                    setIsAddModalOpen(false);
                    refresh();
                }}
            />
        </>
    );
}