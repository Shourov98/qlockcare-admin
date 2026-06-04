import { CalendarDays, FileWarning, ShieldAlert } from "lucide-react";

export const initialCardData = [
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

export const agencies = [
  { name: "QLOCKCARE", status: "Active", employeeCount: 150, services: "PCA,245D,ARMHS,Counseling", createdAt: "2023-01-15" },
  { name: "HealthCare Plus", status: "Inactive", employeeCount: 245, services: "PCA", createdAt: "2022-09-03" },
  { name: "Premier Care", status: "Active", employeeCount: 98, services: "PCA,245D,ARMHS", createdAt: "2023-05-22" },
  { name: "CareFirst Agency", status: "Active", employeeCount: 187, services: "ARMHS,Counseling", createdAt: "2024-02-08" },
  { name: "Wellness Solutions", status: "Active", employeeCount: 76, services: "245D,ARMHS,Counseling", createdAt: "2023-11-12" },
  { name: "MediAssist", status: "Inactive", employeeCount: 321, services: "PCA,245D,ARMHS,Counseling", createdAt: "2021-07-19" },
  { name: "HealthBridge", status: "Active", employeeCount: 112, services: "PCA,245D,ARMHS", createdAt: "2022-03-05" },
  { name: "CareLink", status: "Pending", employeeCount: 10, services: "PCA,245D,ARMHS,Counseling", createdAt: "2024-01-20" },
  { name: "Synergy HomeCare", status: "Active", employeeCount: 67, services: "PCA,245D", createdAt: "2023-08-30" },
  { name: "Gentle Hands Care", status: "Pending", employeeCount: 15, services: "PCA,245D,ARMHS,Counseling", createdAt: "2024-02-15" },
  { name: "BrightStar Care", status: "Inactive", employeeCount: 210, services: "PCA", createdAt: "2022-04-10" },
  { name: "HomeWell Health", status: "Active", employeeCount: 89, services: "PCA,245D,ARMHS", createdAt: "2023-03-25" },
  { name: "Allure Home Care", status: "Active", employeeCount: 43, services: "PCA,245D,ARMHS,Counseling", createdAt: "2024-01-05" },
  { name: "Prestige Care Services", status: "Pending", employeeCount: 22, services: "PCA,245D", createdAt: "2024-02-20" },
  { name: "Quality Homecare", status: "Active", employeeCount: 58, services: "PCA", createdAt: "2022-11-18" },
  { name: "Guardian Health", status: "Active", employeeCount: 134, services: "PCA,245D,ARMHS,Counseling", createdAt: "2023-07-11" },
  { name: "Comfort Keepers", status: "Inactive", employeeCount: 88, services: "PCA,245D", createdAt: "2021-12-05" },
  { name: "Compassionate Care", status: "Active", employeeCount: 205, services: "PCA,ARMHS", createdAt: "2024-03-10" },
  { name: "Lumina HomeCare", status: "Pending", employeeCount: 45, services: "PCA,245D,Counseling", createdAt: "2024-05-01" },
  { name: "TrueCare Services", status: "Active", employeeCount: 160, services: "PCA,245D,ARMHS,Counseling", createdAt: "2022-10-25" },
  { name: "Evergreen Care", status: "Active", employeeCount: 92, services: "245D,ARMHS", createdAt: "2023-06-18" },
  { name: "Harmony Health", status: "Inactive", employeeCount: 310, services: "PCA,Counseling", createdAt: "2021-09-14" },
  { name: "Oasis Services", status: "Active", employeeCount: 175, services: "PCA,245D,ARMHS,Counseling", createdAt: "2023-11-30" },
  { name: "Apex Care Group", status: "Pending", employeeCount: 30, services: "PCA,245D,ARMHS", createdAt: "2024-04-12" },
  { name: "Pioneer Health", status: "Active", employeeCount: 142, services: "PCA,Counseling", createdAt: "2022-08-21" },
];
