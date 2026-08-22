"use client";

import React, { useEffect, useState } from 'react';
import { Ticket, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { getTicketStats, TicketStats } from './tickets';

export function SupportStatCards() {
    const [stats, setStats] = useState<TicketStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        getTicketStats()
            .then((s) => {
                if (mounted) setStats(s);
            })
            .catch(() => {
                // API unreachable — show zeros rather than crashing the page.
                if (mounted) {
                    setStats({
                        total: 0,
                        by_status: {
                            OPEN: 0,
                            IN_PROGRESS: 0,
                            PENDING: 0,
                            RESOLVED: 0,
                            CLOSED: 0,
                        },
                        by_priority: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
                    });
                }
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    const cards = [
        {
            title: 'Total Tickets',
            value: stats?.total ?? 0,
            trend: stats ? `${stats.by_status.OPEN} open` : '—',
            trendColor: 'text-green-500',
            icon: Ticket,
            iconBg: 'bg-blue-100 text-blue-500',
        },
        {
            title: 'Pending',
            value: stats?.by_status.PENDING ?? 0,
            trend: stats ? `${stats.by_status.IN_PROGRESS} in progress` : '—',
            trendColor: 'text-orange-500',
            icon: Clock,
            iconBg: 'bg-orange-100 text-orange-500',
        },
        {
            title: 'In Progress',
            value: stats?.by_status.IN_PROGRESS ?? 0,
            trend: stats ? `${stats.by_priority.CRITICAL + stats.by_priority.HIGH} high priority` : '—',
            trendColor: 'text-purple-500',
            icon: Loader2,
            iconBg: 'bg-purple-100 text-purple-500',
        },
        {
            title: 'Resolved',
            value: stats ? stats.by_status.RESOLVED + stats.by_status.CLOSED : 0,
            trend: stats && stats.total
                ? `${Math.round(((stats.by_status.RESOLVED + stats.by_status.CLOSED) / stats.total) * 100)}%`
                : '—',
            trendColor: 'text-green-500',
            icon: CheckCircle2,
            iconBg: 'bg-green-100 text-green-500',
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between h-[120px]">
                        <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-semibold ${stat.trendColor}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">
                                {loading ? '—' : stat.value}
                            </h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}