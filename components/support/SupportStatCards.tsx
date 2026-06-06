import React from 'react';
import { Ticket, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export function SupportStatCards() {
    const stats = [
        {
            title: 'Total Tickets',
            value: '342',
            trend: '+12%',
            trendColor: 'text-green-500',
            icon: Ticket,
            iconBg: 'bg-blue-100 text-blue-500',
        },
        {
            title: 'Pending',
            value: '47',
            trend: '24 Active',
            trendColor: 'text-orange-500',
            icon: Clock,
            iconBg: 'bg-orange-100 text-orange-500',
        },
        {
            title: 'Active',
            value: '89',
            trend: 'In Progress',
            trendColor: 'text-purple-500',
            icon: Loader2,
            iconBg: 'bg-purple-100 text-purple-500',
        },
        {
            title: 'Resolved',
            value: '206',
            trend: '+8%',
            trendColor: 'text-green-500',
            icon: CheckCircle2,
            iconBg: 'bg-green-100 text-green-500',
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => {
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
                            <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
