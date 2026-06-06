"use client";

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function ComplianceBarChart() {
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

    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-semibold text-foreground">Risk by Agency</h3>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div className="h-[280px]">
                <Bar data={barChartData} options={barChartOptions} />
            </div>
        </div>
    );
}
