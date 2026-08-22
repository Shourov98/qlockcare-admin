"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  CreditCard,
  FileText,
  Plug,
  Headphones,
  ClipboardList,
  LayoutTemplate,
  FileBarChart,
  Settings,
  Zap,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";

type SidebarItem = {
  title: string;
  icon: typeof LayoutDashboard;
  href: string;
  // Sidebar items with `requiredScope` are hidden from PLATFORM_ADMIN
  // users who don't hold the scope. SUPER_ADMIN always sees them.
  // Items without `requiredScope` are visible to both roles.
  requiredScope?: "AGENCIES" | "CLINICAL" | "SUPPORT";
  // `requiredRole` strictly limits an item to one role (e.g. only
  // SUPER_ADMIN can manage admins).
  requiredRole?: "SUPER_ADMIN";
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const items: SidebarItem[] = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    { title: "Agencies", icon: Building2, href: "/agencies", requiredScope: "AGENCIES" },
    { title: "Clients", icon: Users, href: "/users", requiredScope: "CLINICAL" },
    { title: "Staff", icon: Briefcase, href: "/staff", requiredScope: "CLINICAL" },
    { title: "Admins", icon: Zap, href: "/admins", requiredRole: "SUPER_ADMIN" },
    { title: "Billing & Subscriptions", icon: CreditCard, href: "/billing" },
    { title: "Documents & Licenses", icon: FileText, href: "/documents" },
    // { title: "Integrations & Health", icon: Plug, href: "/integrations" },
    { title: "Support / Tickets", icon: Headphones, href: "/support" },
    {
      title: "Audit Logs",
      icon: ClipboardList,
      href: "/audit-logs",
      requiredScope: "SUPPORT",
    },
    // { title: "Templates & Forms", icon: LayoutTemplate, href: "/templates" },
    // { title: "Reports & Exports", icon: FileBarChart, href: "/reports" },
    { title: "Global Settings", icon: Settings, href: "/settings" },
  ];

  const visibleItems = items.filter((item) => {
    if (!user) return true; // Pre-auth render — show everything.
    if (user.role === "SUPER_ADMIN") return true;
    // PLATFORM_ADMIN:
    if (item.requiredRole === "SUPER_ADMIN") return false;
    if (item.requiredScope && !user.scopes.includes(item.requiredScope)) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-64 min-h-screen bg-card flex flex-col hidden md:flex">
      <div className="h-16 flex items-center justify-center px-6">
        <span className="text-primary font-bold text-xl">QLOCKCARE</span>
      </div>
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-colors ${isActive
                ? "bg-primary text-primary-foreground shadow-[0px_1px_4px_rgba(0,0,0,0.08)]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
