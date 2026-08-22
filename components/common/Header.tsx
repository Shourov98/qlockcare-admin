"use client";

import { Bell, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { getNotificationBadge } from "@/components/notifications/notifications";
import { ApiError } from "@/lib/api";

// Polling cadence for the badge — every 30 s while the header is
// mounted. RTK Query isn't used here (the admin keeps the lighter
// `apiRequest` pattern), so a useEffect interval is the equivalent.
const POLL_MS = 30_000;

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [unread, setUnread] = useState<number>(0);

  const fetchBadge = useCallback(async () => {
    try {
      const badge = await getNotificationBadge();
      setUnread(badge.unread_count);
    } catch (caught) {
      // Silent — badge is decorative. If the request 401s because the
      // token just expired, the next page navigation will catch it.
      if (caught instanceof ApiError && caught.status === 401) {
        setUnread(0);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBadge();
    const id = window.setInterval(fetchBadge, POLL_MS);
    return () => window.clearInterval(id);
  }, [fetchBadge]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.replace("/sign-in");
  };

  const displayCount = unread > 99 ? "99+" : String(unread);
  const hasUnread = unread > 0;

  return (
    <header className="h-[72px] px-8 bg-card flex justify-between items-center shrink-0">
      <div>
        <h1 className="text-[20px] font-semibold text-foreground tracking-tight">
          Global Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/notifications" aria-label="Notifications">
          <button
            type="button"
            className={`p-2 rounded-full relative transition-colors ${
              hasUnread
                ? "bg-green-50 hover:bg-green-100"
                : "hover:bg-muted"
            }`}
          >
            <Bell
              className={`w-5 h-5 ${hasUnread ? "text-green-600" : "text-muted-foreground"}`}
            />
            {hasUnread ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold leading-[18px] text-center rounded-full border-2 border-card">
                {displayCount}
              </span>
            ) : null}
          </button>
        </Link>
        <div className="flex items-center gap-3 ml-2 border-l border-border pl-6">
          <Link href="/settings">
            <div className="flex items-center gap-3">
              <Image
                src="/avatar.jpeg"
                alt="Avatar"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-[14px] font-semibold text-foreground leading-none">
                  {user?.full_name || user?.email || "Admin"}
                </p>
                <p className="text-[12px] text-muted-foreground leading-none mt-1.5">
                  {user?.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : user?.role === "PLATFORM_ADMIN"
                      ? "Platform Admin"
                      : "Admin"}
                </p>
              </div>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Log out"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}