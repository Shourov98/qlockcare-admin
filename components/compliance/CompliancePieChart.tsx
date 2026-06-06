"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { MoreHorizontal } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function CompliancePieChart() {
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
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-semibold text-foreground">Compliance Status Overview</h3>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div className="h-[280px] flex items-center justify-center relative">
                <div className="w-full max-w-[280px] h-full">
                    <Pie data={pieChartData} options={pieChartOptions} />
                </div>
            </div>
        </div>
    );
}
