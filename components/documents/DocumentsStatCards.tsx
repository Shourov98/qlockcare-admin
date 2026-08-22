"use client";

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, FileWarning, CheckCircle2 } from 'lucide-react';
import { ComplianceStats, getComplianceStats } from '../compliance/compliance';

export function DocumentsStatCards() {
    const [stats, setStats] = useState<ComplianceStats | null>(null);

    useEffect(() => {
        let mounted = true;
        getComplianceStats()
            .then((s) => {
                if (mounted) setStats(s);
            })
            .catch(() => {
                if (mounted) {
                    setStats({
                        documents_total: 0,
                        documents_missing: 0,
                        documents_expiring: 0,
                        documents_expired: 0,
                        documents_valid: 0,
                        licenses_total: 0,
                        licenses_critical: 0,
                        licenses_warning: 0,
                        licenses_upcoming: 0,
                        licenses_valid: 0,
                        licenses_expired: 0,
                    });
                }
            });
        return () => {
            mounted = false;
        };
    }, []);

    const cards = [
        {
            label: 'Urgent',
            value: stats?.licenses_critical ?? 0,
            sub: 'Licenses expiring this week',
            icon: AlertTriangle,
            iconBg: 'bg-red-50 text-red-500',
            textColor: 'text-red-500',
        },
        {
            label: 'Warning',
            value: stats?.licenses_warning ?? 0,
            sub: 'Licenses expiring this month',
            icon: Clock,
            iconBg: 'bg-orange-50 text-orange-500',
            textColor: 'text-orange-500',
        },
        {
            label: 'Action',
            value: stats?.documents_missing ?? 0,
            sub: 'Missing Documents',
            icon: FileWarning,
            iconBg: 'bg-yellow-50 text-yellow-600',
            textColor: 'text-yellow-600',
        },
        {
            label: 'Active',
            value: stats?.documents_valid ?? 0,
            sub: 'Valid Documents',
            icon: CheckCircle2,
            iconBg: 'bg-green-50 text-green-500',
            textColor: 'text-green-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => {
                const Icon = c.icon;
                return (
                    <div key={c.label} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-semibold ${c.textColor}`}>{c.label}</span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-3xl font-bold text-foreground">{c.value}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{c.sub}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}