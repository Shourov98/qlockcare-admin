"use client";

import React, { useState } from 'react';
import { Search, Download, Plus } from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';
import { expiringLicenses } from './data';
import { ComplianceLicenseAddModal } from './ComplianceLicenseAddModal';

export function ExpiringLicensesTable() {
    const [docsPage, setDocsPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    const filteredDocs = expiringLicenses.filter(doc => {
        const matchesSearch = doc.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.docType.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All Statuses' || doc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const itemsPerPage = 5;
    const totalItems = filteredDocs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (docsPage - 1) * itemsPerPage;
    const paginatedDocs = filteredDocs.slice(startIndex, startIndex + itemsPerPage);
    const handleExport = () => {
        const headers = ["ID", "Agency", "Document Type", "Document Name", "Expiry Date", "Days Until", "Status"];
        const csvContent = [
            headers.join(","),
            ...filteredDocs.map(doc =>
                `${doc.id},"${doc.agency}","${doc.docType}","${doc.docName}","${doc.expiry}",${doc.daysUntil},${doc.status}`
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "expiring_licenses.csv");
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
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setDocsPage(1);
                        }}
                        className="px-3 py-1.5 bg-card border border-border rounded-[12px] text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                        <option>All Statuses</option>
                        <option>Critical</option>
                        <option>Warning</option>
                        <option>Upcoming</option>
                    </select>
                    <div className="relative flex items-center gap-2">
                        <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setDocsPage(1);
                            }}
                            className="border border-border rounded-[12px] pl-9 pr-4 py-1.5 text-sm bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-[12px] text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-[12px] text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Add Document
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto bg-card border border-border rounded-[12px]">
                <table className="w-full text-left text-[14px] text-foreground">
                    <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium">Agency</th>
                            <th className="px-6 py-4 font-medium">Document Type</th>
                            <th className="px-6 py-4 font-medium">Document Name</th>
                            <th className="px-6 py-4 font-medium">Expiry Date</th>
                            <th className="px-6 py-4 font-medium">Days Until Expiry</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDocs.map((item) => (
                            <tr key={item.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-foreground">{item.agency}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{item.docType}</td>
                                <td className="px-6 py-4 text-foreground">{item.docName}</td>
                                <td className="px-6 py-4 text-muted-foreground">{item.expiry}</td>
                                <td className={`px-6 py-4 font-medium ${item.daysUntil <= 14 ? 'text-red-600 dark:text-red-500' :
                                    item.daysUntil <= 45 ? 'text-orange-500 dark:text-orange-400' : 'text-primary'
                                    }`}>
                                    {item.daysUntil} days
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-medium ${item.status === 'Critical' ? 'text-red-600 dark:text-red-500' :
                                        item.status === 'Warning' ? 'text-orange-500 dark:text-orange-400' : 'text-primary'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 text-sm font-medium">
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
                currentPage={docsPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setDocsPage}
                itemName="documents"
            />

            <ComplianceLicenseAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </>
    );
}
