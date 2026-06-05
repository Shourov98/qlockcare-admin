import React, { useState } from "react";
import { Search, Download, ChevronDown } from "lucide-react";
import { BillingSummaryCards } from "./BillingSummaryCards";
import { BillingTable } from "./BillingTable";
import { subscriptionsData } from "./billing";

interface SubscriptionsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SubscriptionsTab({ searchQuery, setSearchQuery }: SubscriptionsTabProps) {
  const [statusFilter, setStatusFilter] = useState("All Status");

  const handleExport = () => {
    const headers = ["Agency Name", "Agency Email", "Plan", "Status", "Amount", "Billing Cycle", "Next Payment"];
    
    const dataToExport = subscriptionsData.filter(sub => {
      const matchesSearch = sub.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.agencyEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const csvContent = [
      headers.join(","),
      ...dataToExport.map(row => 
        `"${row.agencyName}","${row.agencyEmail}","${row.plan}","${row.status}","${row.amount}","${row.billingCycle}","${row.nextPayment}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "billing_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <BillingSummaryCards />
      <div className="overflow-x-auto bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Agency Subscriptions</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-[12px] px-4 py-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search agencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-border bg-muted/20 rounded-[8px] pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none flex items-center gap-2 border border-border px-4 py-2 pr-10 rounded-[8px] text-sm font-medium hover:bg-muted/50 transition-colors bg-white text-foreground cursor-pointer focus:outline-none"
              >
                <option value="All Status">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Past Due">Past Due</option>
                <option value="Trial">Trial</option>
                <option value="Demo">Demo</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        <BillingTable searchQuery={searchQuery} statusFilter={statusFilter} />
      </div>
    </div>
  );
}
