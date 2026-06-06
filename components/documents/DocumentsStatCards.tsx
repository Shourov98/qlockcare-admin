import React from 'react';
import { AlertTriangle, Clock, FileWarning, CheckCircle2 } from 'lucide-react';

export function DocumentsStatCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Urgent */}
            <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-red-500">Urgent</span>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-foreground">12</h3>
                    <p className="text-sm text-muted-foreground mt-1">Expiring This Week</p>
                </div>
            </div>

            {/* Warning */}
            <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                        <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-orange-500">Warning</span>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-foreground">28</h3>
                    <p className="text-sm text-muted-foreground mt-1">Expiring This Month</p>
                </div>
            </div>

            {/* Action */}
            <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                        <FileWarning className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-yellow-600">Action</span>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-foreground">7</h3>
                    <p className="text-sm text-muted-foreground mt-1">Missing Documents</p>
                </div>
            </div>

            {/* Active */}
            <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-green-600">Active</span>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-foreground">342</h3>
                    <p className="text-sm text-muted-foreground mt-1">Valid Documents</p>
                </div>
            </div>
        </div>
    );
}
