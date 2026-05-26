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
  ];

  return (
    <div className="bg-card rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-[24px] font-medium text-foreground">
          Recent Activities
        </h2>
        <div className="flex gap-4">
          <select className="border border-border rounded-[12px] px-3 py-1 bg-card text-[14px] text-foreground focus:outline-none focus:border-primary appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%236e7976%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.2em_1.2em] pr-8">
            <option>All Severity</option>
          </select>
          <select className="border border-border rounded-[12px] px-3 py-1 bg-card text-[14px] text-foreground focus:outline-none focus:border-primary appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%236e7976%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.2em_1.2em] pr-8">
            <option>All Status</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-foreground">
          <thead className="bg-[#f1f4f2] text-[12px] tracking-[0.05em] font-semibold text-muted-foreground uppercase border-b border-border">
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
                    className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${
                      item.severity === "Critical"
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
                    className={`text-[12px] font-semibold ${
                      item.status === "Open"
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
    </div>
  );
}
