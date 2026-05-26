import {
  CalendarDays,
  ShieldAlert,
  FileWarning,
  DollarSign,
  History,
  AlertCircle,
  Activity,
} from "lucide-react";

export function KpiGrid() {
  const kpis = [
    {
      title: "Total Visits",
      value: "847",
      subtext: "+12%",
      status: "success",
      icon: CalendarDays,
      meta: "34 Completed • 56 In Progress",
    },
    {
      title: "EVV Exceptions",
      value: "67",
      subtext: "Review",
      status: "warning",
      icon: ShieldAlert,
      meta: "12 pending review",
    },
    {
      title: "Missing Notes",
      value: "142",
      subtext: "Action",
      status: "purple",
      icon: FileWarning,
      meta: "34 providers",
    },
    {
      title: "Billing Ready",
      value: "$124K",
      subtext: "Ready",
      status: "success",
      icon: DollarSign,
      meta: "456 Ready • 23 On Hold",
    },
    {
      title: "Auth Expiring",
      value: "89",
      subtext: "30 Days",
      status: "warning",
      icon: History,
      meta: "34 in next 7 days",
    },
    {
      title: "Credentials Expiring",
      value: "156",
      subtext: "Urgent",
      status: "error",
      icon: AlertCircle,
      meta: "12 (7d) • 34 (14d) • 110 (30d)",
    },
    {
      title: "System Health",
      value: "98.7%",
      subtext: "Overview",
      status: "primary",
      icon: Activity,
      meta: "All systems operational",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] border border-transparent hover:border-border transition-colors flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-2 rounded-lg ${
                kpi.status === "success"
                  ? "bg-green-100 text-green-700"
                  : kpi.status === "error"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : kpi.status === "warning"
                      ? "bg-orange-100 text-orange-700"
                      : kpi.status === "purple"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-[#eef1ef] text-[#004e45]"
              }`}
            >
              <kpi.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[12px] tracking-[0.05em] font-semibold px-2 py-1 rounded-[100px] ${
                kpi.status === "success"
                  ? "bg-green-100 text-green-700"
                  : kpi.status === "error"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : kpi.status === "warning"
                      ? "bg-orange-100 text-orange-700"
                      : kpi.status === "purple"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-[#eef1ef] text-[#004e45]"
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
            <p className="text-[12px] text-muted-foreground mt-3 flex items-center gap-1">
              {kpi.meta}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
