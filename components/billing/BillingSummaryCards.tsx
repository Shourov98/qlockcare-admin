import React from "react";
import { billingSummaryData } from "./billing";

export function BillingSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {billingSummaryData.map((kpi, idx) => {
        let bgColor = "bg-green-100";
        let iconColor = "text-green-600";
        let percentColor = "text-green-600";
        
        if (kpi.status === "error") {
          bgColor = "bg-red-100";
          iconColor = "text-red-600";
          percentColor = "text-red-600";
        } else if (kpi.status === "info") {
          bgColor = "bg-blue-100";
          iconColor = "text-blue-600";
          percentColor = "text-blue-600";
        } else if (kpi.status === "purple") {
          bgColor = "bg-purple-100";
          iconColor = "text-purple-600";
          percentColor = "text-purple-600";
        }

        return (
          <div
            key={idx}
            className="bg-white rounded-[12px] p-6 shadow-sm border border-border flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-lg ${bgColor} ${iconColor}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold ${percentColor}`}>
                {kpi.subtext}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">{kpi.title}</p>
              <h3 className="text-3xl font-semibold text-foreground mt-1">
                {kpi.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
