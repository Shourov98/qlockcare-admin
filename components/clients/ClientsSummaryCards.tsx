import React, { useState, useMemo } from "react";
import { clientsCardDataMonthly } from "./client";

export function ClientsSummaryCards() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const data = useMemo(() => {
    return clientsCardDataMonthly.map(card => {
      const factor = selectedMonth.length + parseInt(selectedYear) % 10;
      const numValue = parseInt(card.value.replace(/,/g, ''));
      return {
        ...card,
        value: Math.floor(numValue * (1 + factor * 0.02)).toLocaleString()
      }
    });
  }, [selectedYear, selectedMonth]);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = ["2026", "2025", "2024", "2023"];

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 px-3 py-2 bg-gray-50 rounded-[12px]">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-border rounded-[12px] px-3 py-1.5 text-sm bg-white shadow-sm"
        >
          <option value="All">All Months</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-border rounded-[12px] px-3 py-1.5 text-sm bg-white shadow-sm"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] border border-transparent hover:border-border transition-colors flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-blue-100 text-blue-700`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[12px] tracking-[0.05em] font-semibold px-2 py-1 rounded-[100px] ${kpi.status === "success"
                  ? "bg-green-100 text-green-700"
                  : kpi.status === "warning"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-purple-100 text-purple-700"
                  }`}
              >
                {kpi.subtext}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-[14px]">{kpi.title}</p>
              <h3 className="text-[32px] leading-[1.3] font-semibold text-foreground mt-1">
                {kpi.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
