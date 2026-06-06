import React from 'react';
import { ChevronDown } from 'lucide-react';

export function SupportFilters() {
    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-foreground text-base">Filter Tickets</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Reset Filters</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">Agency</label>
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
                    <label className="text-xs font-medium text-foreground">Priority</label>
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
                    <label className="text-xs font-medium text-foreground">Status</label>
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
                    <label className="text-xs font-medium text-foreground">Assigned To</label>
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
                    <label className="text-xs font-medium text-foreground">Date Range</label>
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
    );
}
