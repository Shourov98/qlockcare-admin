import { GrowthCharts } from "@/components/charts/GrowthCharts";
import { RecentActivities } from "@/components/common/RecentActivities";
import { KpiGrid } from "@/components/common/KpiGrid";

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <KpiGrid />
      <GrowthCharts />
      <RecentActivities />
    </div>
  );
}
