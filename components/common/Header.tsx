"use client";

import { Bell, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.replace("/sign-in");
  };

  return (
    <header className="h-[72px] px-8 bg-card flex justify-between items-center shrink-0">
      <div>
        <h1 className="text-[20px] font-semibold text-foreground tracking-tight">
          Global Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/notifications">
          <button className="p-2 bg-green-50 rounded-full relative hover:bg-green-100 transition-colors cursor-pointer">
            <Bell className="w-5 h-5 text-green-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-card"></span>
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
                  {user?.full_name || "Super Admin"}
                </p>
                <p className="text-[12px] text-muted-foreground leading-none mt-1.5">
                  Super Admin
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
