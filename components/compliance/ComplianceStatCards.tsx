import React from 'react';
import {
    Building2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
} from 'lucide-react';

export function ComplianceStatCards() {
    return (
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
    );
}
