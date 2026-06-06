"use client";

import React, { useState } from 'react';
import { Pagination } from '@/components/common/Pagination';
import { complianceIssues } from './data';
import { Search, Download, Plus } from 'lucide-react';
import { ComplianceIssueAddModal } from './ComplianceIssueAddModal';

export function ComplianceIssueQueueTable() {
    const [issuesPage, setIssuesPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredIssues = complianceIssues.filter(issue =>
        issue.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.issueTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsPerPage = 5;
    const totalItems = filteredIssues.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    
    const startIndex = (issuesPage - 1) * itemsPerPage;
    const paginatedIssues = filteredIssues.slice(startIndex, startIndex + itemsPerPage);

    const handleExport = () => {
        const headers = ["ID", "Severity", "Title", "Agency", "Assignee", "Due Date", "Status"];
        const csvContent = [
            headers.join(","),
            ...filteredIssues.map(issue => 
                `${issue.id},${issue.severity},"${issue.issueTitle}","${issue.agency}","${issue.assignee}","${issue.dueDate}",${issue.status}`
            )
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "compliance_issues.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-[24px] font-bold text-foreground">Compliance Issue Queue</h3>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 p-2">
                    <select className="px-3 py-1.5 bg-card border border-border rounded-[12px] text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                        <option>All Severities</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                    <select className="px-3 py-1.5 bg-card border border-border rounded-[12px] text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                        <option>All Statuses</option>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Pending Review</option>
                    </select>
                    <div className="relative flex items-center gap-2">
                        <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIssuesPage(1);
                            }}
                            className="border border-border rounded-[12px] pl-9 pr-4 py-1.5 text-sm bg-card text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-[12px] text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-[12px] text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Add Issue
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto bg-card border border-border rounded-[12px]">
                <table className="w-full text-left text-[14px] text-foreground">
                    <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-medium">Agency</th>
                            <th className="px-6 py-4 font-medium">Severity</th>
                            <th className="px-6 py-4 font-medium w-1/3">Issue</th>
                            <th className="px-6 py-4 font-medium">Assigned To</th>
                            <th className="px-6 py-4 font-medium">Due Date</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedIssues.map((issue) => (
                            <tr key={issue.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                                <td className="px-6 py-4">
                                    <span className="text-foreground">{issue.agency}</span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <issue.severityIcon className={`w-4 h-4 ${issue.severityColor}`} />
                                        <span className={`font-medium ${issue.severityColor}`}>{issue.severity}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-foreground">{issue.issueTitle}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{issue.issueDesc}</p>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="text-foreground">{issue.assignee}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className={`font-medium ${issue.dueColor}`}>{issue.dueDate}</span>
                                        <span className="text-xs text-muted-foreground">{issue.dueContext}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-medium ${issue.statusColor}`}>{issue.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 font-medium">
                                        <button className="text-primary hover:text-primary/80 transition-colors">Resolve</button>
                                        <button className="text-muted-foreground hover:text-foreground transition-colors">Assign</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={issuesPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setIssuesPage}
                itemName="issues"
            />

            <ComplianceIssueAddModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
        </>
    );
}
