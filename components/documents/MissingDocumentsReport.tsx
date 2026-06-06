"use client";

import React, { useState } from 'react';
import { AlertTriangle, FileText, Search, Plus } from 'lucide-react';
import { missingDocuments } from './data';
import { Pagination } from '@/components/common/Pagination';
import { MissingDocRequestModal } from './MissingDocRequestModal';
import { MissingDocViewModal } from './MissingDocViewModal';
import { AddMissingDocumentModal } from './AddMissingDocumentModal';

export function MissingDocumentsReport() {
    const [searchQuery, setSearchQuery] = useState('');
    const [docsPage, setDocsPage] = useState(1);
    const [isRequestModalOpen, setRequestModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    const filteredDocs = missingDocuments.filter(doc =>
        doc.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.missingList.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsPerPage = 5;
    const totalItems = filteredDocs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const startIndex = (docsPage - 1) * itemsPerPage;
    const paginatedDocs = filteredDocs.slice(startIndex, startIndex + itemsPerPage);

    const getColorStyles = (color: string) => {
        switch (color) {
            case 'red':
                return {
                    container: 'bg-red-50/50 border-red-100',
                    iconBg: 'bg-red-100 text-red-500',
                    text: 'text-red-500',
                    button: 'bg-red-600 hover:bg-red-700 text-white',
                };
            case 'yellow':
                return {
                    container: 'bg-yellow-50/50 border-yellow-100',
                    iconBg: 'bg-yellow-100 text-yellow-600',
                    text: 'text-yellow-600',
                    button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                };
            case 'orange':
                return {
                    container: 'bg-orange-50/50 border-orange-100',
                    iconBg: 'bg-orange-100 text-orange-500',
                    text: 'text-orange-500',
                    button: 'bg-orange-600 hover:bg-orange-700 text-white',
                };
            default:
                return {
                    container: 'bg-muted/50 border-border',
                    iconBg: 'bg-muted text-muted-foreground',
                    text: 'text-muted-foreground',
                    button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                };
        }
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
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setDocsPage(1);
                            }}
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

            <div className="overflow-x-auto bg-card border border-border rounded-[12px]">
                <table className="w-full text-left text-[14px] text-foreground">
                    <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium">Agency</th>
                            <th className="px-6 py-4 font-medium">Missing Documents</th>
                            <th className="px-6 py-4 font-medium">Count</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDocs.map((doc) => {
                            const styles = getColorStyles(doc.color);
                            return (
                                <tr key={doc.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-foreground">{doc.agency}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{doc.missingList}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.container} ${styles.text}`}>
                                            {doc.missingCount} Missing
                                        </span>
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
                currentPage={docsPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setDocsPage}
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
                onClose={() => setAddModalOpen(false)} 
            />
        </>
    );
}
