"use client";

import React, { useState } from 'react';
import { Pagination } from '@/components/common/Pagination';
import {
    Building2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Download,
    Plus,
    MoreHorizontal,
    Filter
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

import { expiringLicenses, complianceIssues } from '../../components/compliance/data';

export default function ComplianceDashboard() {
    const [docsPage, setDocsPage] = useState(1);
    const [issuesPage, setIssuesPage] = useState(1);

    const barChartData = {
        labels: ['Alpha Benefits', 'Coastal Health', 'Elite Care', 'Premier Wellness', 'Summit Financial', 'Vertex Group', 'Nexus Partners', 'Omega Solutions'],
        datasets: [
            {
                label: 'Risk Level',
                data: [9, 7, 5, 6, 3, 8, 4, 7],
                backgroundColor: [
                    '#ef4444',
                    '#f59e0b',
                    '#10b981',
                    '#f59e0b',
                    '#10b981',
                    '#ef4444',
                    '#10b981',
                    '#f59e0b',
                ],
                borderRadius: 4,
            },
        ],
    };
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `Risk Level: ${context.raw}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: { stepSize: 2 },
                grid: { color: '#f3f4f6' },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } },
                border: { display: false }
            }
        }
    };
    const pieChartData = {
        labels: ['Compliant', 'At Risk', 'Critical Issues'],
        datasets: [
            {
                data: [75, 16.7, 8.33],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0,
            },
        ],
    };
    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { usePointStyle: true, boxWidth: 8, padding: 20 }
            }
        },
        cutout: '0%'
    };

    return (
        <main className="p-6 space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Compliance & Risk Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Monitor agency compliance status and manage risk across your platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm">
                        <Download className="w-4 h-4" />
                        Export Evidence
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors shadow-sm">
                        <Plus className="w-4 h-4" />
                        New Compliance Item
                    </button>
                </div>
            </div>

            {/* stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Agencies */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Total Agencies</p>
                            <h3 className="text-3xl font-bold text-foreground">48</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Building2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm flex items-center">
                        <span className="text-green-600 dark:text-green-500 font-medium">+4</span>
                        <span className="text-muted-foreground ml-1">this month</span>
                    </div>
                </div>

                {/* Compliant */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Compliant</p>
                            <h3 className="text-3xl font-bold text-green-600 dark:text-green-500">36</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-500">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm">
                        <span className="text-muted-foreground">75% compliance rate</span>
                    </div>
                </div>

                {/* At Risk */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                            <h3 className="text-3xl font-bold text-orange-500">8</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm">
                        <span className="text-orange-600 dark:text-orange-400 font-medium">Requires attention</span>
                    </div>
                </div>

                {/* Critical Issues */}
                <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                            <h3 className="text-3xl font-bold text-red-600 dark:text-red-500">4</h3>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-500">
                            <XCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm">
                        <span className="text-red-600 dark:text-red-500 font-medium">Immediate action needed</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-semibold text-foreground">Risk by Agency</h3>
                        <button className="text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>
                    <div className="h-[280px]">
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-semibold text-foreground">Compliance Status Overview</h3>
                        <button className="text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>
                    <div className="h-[280px] flex items-center justify-center relative">
                        <div className="w-full max-w-[280px] h-full">
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Expiring Licenses & Documents */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-foreground">Expiring Licenses & Documents</h3>
                        <p className="text-sm text-muted-foreground mt-1">Documents and licenses expiring within the next 90 days</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
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
                            {expiringLicenses.map((item) => (
                                <tr key={item.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center font-medium text-xs ${item.color}`}>
                                                {item.initials}
                                            </div>
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
                                            <button className="text-primary hover:text-primary/80 transition-colors">Renew</button>
                                            <button className="text-muted-foreground hover:text-foreground transition-colors">View</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={docsPage}
                    totalPages={2}
                    totalItems={8}
                    itemsPerPage={5}
                    onPageChange={setDocsPage}
                    itemName="documents"
                />
            </div>

            {/* Compliance Issue Queue */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-foreground">Compliance Issue Queue</h3>
                        <p className="text-sm text-muted-foreground mt-1">Active compliance issues requiring resolution</p>
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-1.5 bg-card border border-border rounded-md text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            <option>All Severities</option>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <select className="px-3 py-1.5 bg-card border border-border rounded-md text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            <option>All Statuses</option>
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Pending Review</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[14px] text-foreground">
                        <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-medium">Severity</th>
                                <th className="px-6 py-4 font-medium w-1/3">Issue</th>
                                <th className="px-6 py-4 font-medium">Agency</th>
                                <th className="px-6 py-4 font-medium">Assigned To</th>
                                <th className="px-6 py-4 font-medium">Due Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complianceIssues.map((issue) => (
                                <tr key={issue.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
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
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded flex items-center justify-center font-medium text-[10px] ${issue.avatarColor}`}>
                                                {issue.initials}
                                            </div>
                                            <span className="text-foreground">{issue.agency}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <img src={issue.avatarUrl} alt={issue.assignee} className="w-6 h-6 rounded-full" />
                                            <span className="text-foreground">{issue.assignee}</span>
                                        </div>
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
                    totalPages={3}
                    totalItems={12}
                    itemsPerPage={5}
                    onPageChange={setIssuesPage}
                    itemName="issues"
                />
            </div>
        </main>
    );
}
