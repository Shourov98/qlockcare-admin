export function RecentActivities() {
  const actionQueue = [
    {
      issue: "EVV Clock-in Mismatch",
      severity: "Critical",
      sla: "2 hours",
      status: "Open",
      agency: "HealthCare Plus",
    },
    {
      issue: "Missing Authorization",
      severity: "High",
      sla: "4 hours",
      status: "In Progress",
      agency: "CareFirst Agency",
    },
    {
      issue: "Billing Discrepancy",
      severity: "Medium",
      sla: "24 hours",
      status: "Open",
      agency: "Premier Care",
    },
    {
      issue: "EVV Clock-in Mismatch",
      severity: "Critical",
      sla: "2 hours",
      status: "Open",
      agency: "HealthCare Plus",
    },
    {
      issue: "Missing Authorization",
      severity: "High",
      sla: "4 hours",
      status: "In Progress",
      agency: "CareFirst Agency",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-[24px] font-bold text-foreground">
          Recent Activities
        </h2>
      </div>
      <div className="overflow-x-auto bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
        <table className="w-full text-left text-[14px] text-foreground">
          <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Issue</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">SLA</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Agency</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {actionQueue.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-border hover:bg-muted/20 transition-colors last:border-0"
              >
                <td className="px-6 py-4 font-medium">{item.issue}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${item.severity === "Critical"
                      ? "text-[#ba1a1a] bg-[#ffdad6]"
                      : item.severity === "High"
                        ? "text-orange-700 bg-orange-100"
                        : "text-yellow-700 bg-yellow-100"
                      }`}
                  >
                    {item.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {item.sla}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[12px] font-semibold ${item.status === "Open"
                      ? "text-orange-700"
                      : "text-primary"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {item.agency}
                </td>
                <td className="px-6 py-4">
                  <button className="bg-primary text-primary-foreground rounded-[20px] px-4 py-1.5 text-[14px] font-medium hover:bg-primary/90 transition-colors">
                    Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
