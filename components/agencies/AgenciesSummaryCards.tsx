import React from "react";
import { CalendarDays, FileWarning, LucideIcon, ShieldAlert } from "lucide-react";

export interface SummaryCardData {
  title: string;
  value: string;
  subtext: string;
  status: string;
  icon: LucideIcon;
}
export function AgenciesSummaryCards() {
  const agenciesCardData = [
    {
      title: "Total Agencies",
      value: "847",
      subtext: "+12%",
      status: "success",
      icon: CalendarDays,
    },
    {
      title: "Active Agencies",
      value: "67",
      subtext: "+12%",
      status: "warning",
      icon: ShieldAlert,
    },
    {
      title: "Total Staff",
      value: "142",
      subtext: "$+12%",
      status: "purple",
      icon: FileWarning,
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agenciesCardData.map((kpi, idx) => (
        <div
          key={idx}
          className="bg-white rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] border border-transparent hover:border-border transition-colors flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-green-100 text-green-700`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[12px] tracking-[0.05em] font-semibold px-2 py-1 rounded-[100px] ${kpi.status === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-50 text-red-700"
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
  );
}
