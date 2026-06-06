"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  ShieldCheck,
  FileText,
  Plug,
  Headphones,
  ClipboardList,
  LayoutTemplate,
  FileBarChart,
  Settings,
  Zap,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const items = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    { title: "Agencies", icon: Building2, href: "/agencies" },
    { title: "Clients", icon: Users, href: "/users" },
    { title: "Admins", icon: Zap, href: "/admins" },
    { title: "Billing & Subscriptions", icon: CreditCard, href: "/billing" },
    { title: "Compliance & Risk", icon: ShieldCheck, href: "/compliance" },
    { title: "Documents & Licenses", icon: FileText, href: "/documents" },
    { title: "Integrations & Health", icon: Plug, href: "/integrations" },
    { title: "Support / Tickets", icon: Headphones, href: "/support" },
    { title: "Audit Logs", icon: ClipboardList, href: "/audit-logs" },
    { title: "Templates & Forms", icon: LayoutTemplate, href: "/templates" },
    { title: "Reports & Exports", icon: FileBarChart, href: "/reports" },
    { title: "Global Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="w-64 min-h-screen bg-card flex flex-col hidden md:flex">
      <div className="h-16 flex items-center justify-center px-6">
        <span className="text-primary font-bold text-xl">QLOCKCARE</span>
      </div>
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
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
