"use client";

import React, { useEffect, useState } from 'react';
import { FileText, Search, Plus, Loader2 } from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';
import { MissingDocRequestModal } from './MissingDocRequestModal';
import { MissingDocViewModal } from './MissingDocViewModal';
import { AddMissingDocumentModal } from './AddMissingDocumentModal';
import {
    AgencyDocument,
    DOCUMENT_STATUS_LABEL,
    documentStatusColor,
    listMissingDocuments,
} from '../compliance/compliance';

export function MissingDocumentsReport() {
    const [docs, setDocs] = useState<AgencyDocument[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRequestModalOpen, setRequestModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<AgencyDocument | null>(null);
    const itemsPerPage = 5;

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await listMissingDocuments({
                page,
                pageSize: itemsPerPage,
                ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
            });
            setDocs(result.data);
            setTotalPages(result.pagination.total_pages);
            setTotal(result.pagination.total);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to load missing documents';
            setError(msg);
            setDocs([]);
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

    const onSearchChange = (value: string) => {
        setSearchQuery(value);
        setPage(1);
    };

    return (
        <>
            <div className="pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-[24px] font-bold text-foreground">Missing Documents Report</h3>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 p-2">
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
                        onClick={() => setAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-[12px] text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Document
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto bg-card border border-border rounded-[12px]">
                <table className="w-full text-left text-[14px] text-foreground">
                    <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium">Document</th>
                            <th className="px-6 py-4 font-medium">Description</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Expires</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && docs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                                Loading…
                                </td>
                            </tr>
                        )}
                        {!loading && docs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    No missing documents.
                                </td>
                            </tr>
                        )}
                        {docs.map((doc) => {
                            const styles = documentStatusColor(doc.status);
                            return (
                                <tr key={doc.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${styles.bg}`}>
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-foreground">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {doc.description || '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.bg} ${styles.text}`}>
                                            {DOCUMENT_STATUS_LABEL[doc.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground text-sm">
                                        {doc.expiresAt || 'No expiry'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3 text-sm font-medium">
                                            <button
                                                onClick={() => { setSelectedDoc(doc); setRequestModalOpen(true); }}
                                                className="text-primary cursor-pointer rounded-md px-2 py-1 text-sm font-semibold"
                                            >
                                                Request
                                            </button>
                                            <button
                                                onClick={() => { setSelectedDoc(doc); setViewModalOpen(true); }}
                                                className="text-primary cursor-pointer rounded-md px-2 py-1 text-sm font-semibold"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
                itemName="documents"
            />

            <MissingDocRequestModal
                isOpen={isRequestModalOpen}
                onClose={() => { setRequestModalOpen(false); setSelectedDoc(null); }}
                doc={selectedDoc}
            />

            <MissingDocViewModal
                isOpen={isViewModalOpen}
                onClose={() => { setViewModalOpen(false); setSelectedDoc(null); }}
                doc={selectedDoc}
            />

            <AddMissingDocumentModal
                isOpen={isAddModalOpen}
                onClose={() => { setAddModalOpen(false); refresh(); }}
            />
        </>
    );
}