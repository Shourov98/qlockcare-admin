"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Header } from "@/components/common/Header";
import { Sidebar } from "@/components/common/Sidebar";
import { useAuth } from "@/components/providers/AuthProvider";

const PUBLIC_ROUTES = new Set(["/sign-in"]);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  useEffect(() => {
    if (isLoading) return;

    if (!user && !isPublicRoute) {
      const query = searchParams.toString();
      const next = `${pathname}${query ? `?${query}` : ""}`;
      router.replace(`/sign-in?next=${encodeURIComponent(next)}`);
    }

    if (user && isPublicRoute) {
      router.replace(searchParams.get("next") || "/");
    }
  }, [isLoading, isPublicRoute, pathname, router, searchParams, user]);

  if (isPublicRoute) {
    return children;
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="rounded-lg border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-sm">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
