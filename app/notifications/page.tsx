"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  FileText,
  Calendar,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  Notification,
  relativeTime,
  TYPE_VISUAL,
} from "@/components/notifications/notifications";
import { ApiError } from "@/lib/api";

const ICONS = {
  alert: AlertCircle,
  doc: FileText,
  shield: ShieldAlert,
  system: CheckCircle2,
  calendar: Calendar,
  message: MessageSquare,
};

const PAGE_SIZE = 50;

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const resp = await listNotifications({ limit: PAGE_SIZE });
      setItems(resp.data);
      setUnreadCount(resp.unread_count);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Unable to load notifications.",
      );
      setItems([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const updated = await markNotificationRead(id);
      setItems((current) =>
        current.map((n) => (n.id === id ? updated : n)),
      );
      setUnreadCount((c) => Math.max(c - 1, 0));
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Unable to mark notification as read.",
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((current) =>
        current.map((n) =>
          n.read_at === null
            ? { ...n, status: "READ", read_at: new Date().toISOString() }
            : n,
        ),
      );
      setUnreadCount(0);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Unable to mark all as read.",
      );
    }
  };

  const filtered = filter === "unread"
    ? items.filter((n) => n.read_at === null)
    : items;

  return (
    <main className="p-5 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            System alerts, tickets, and mentions.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground hover:bg-muted/80 font-medium text-sm rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center gap-6 px-6 border-b border-border bg-muted/10">
          <button
            onClick={() => setFilter("all")}
            className={`py-4 text-sm font-medium transition-colors border-b-2 ${
              filter === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`py-4 text-sm font-medium transition-colors border-b-2 ${
              filter === "unread"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread
          </button>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                You&apos;re all caught up!
              </h3>
              <p className="text-muted-foreground text-sm">
                No {filter === "unread" ? "unread " : ""}notifications in
                this category.
              </p>
            </div>
          ) : (
            filtered.map((notification) => {
              const visual =
                TYPE_VISUAL[notification.type] || TYPE_VISUAL.custom;
              const Icon = ICONS[visual.icon];
              const unread = notification.read_at === null;
              return (
                <div
                  key={notification.id}
                  className={`p-6 flex gap-4 transition-colors hover:bg-muted/30 ${
                    unread ? "bg-primary/5" : ""
                  }`}
                  onClick={() => unread && handleMarkAsRead(notification.id)}
                  role={unread ? "button" : undefined}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${visual.bg} ${visual.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <h4
                        className={`text-base truncate ${
                          unread
                            ? "font-bold text-foreground"
                            : "font-semibold text-foreground/80"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0 mt-1">
                        {relativeTime(notification.created_at)}
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-3 ${
                        unread
                          ? "text-foreground/90"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.body}
                    </p>
                    {unread && (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                  {unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-3" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}