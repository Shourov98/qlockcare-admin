"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Mail, Smartphone, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import {
  listNotificationPreferences,
  updateNotificationPreference,
  NotificationChannel,
  NotificationPreference,
  NotificationType,
} from '@/components/notifications/notifications';
import { ApiError } from '@/lib/api';

// Human-readable labels for each (type, channel) pair the UI shows.
// The backend materialises one row per (type, channel) on first call
// (lazy seed in `list_my_prefs`) — so a freshly-onboarded admin has
// every combination toggled on. The UI mirrors that: each toggle maps
// 1:1 to a NotificationPreference row.
//
// We deliberately don't show every type (visit_*, appointment_*, etc) —
// those are agency-scoped events that a cross-tenant admin doesn't
// receive. Only the few platform-relevant types are listed here.
type ToggleKey = `${NotificationType}:${NotificationChannel}`;

const TOGGLE_DEFS: Array<{
  key: ToggleKey;
  channel: NotificationChannel;
  title: string;
  description: string;
}> = [
  // Email channel
  {
    key: "billing_invoice:EMAIL",
    channel: "EMAIL",
    title: "Billing Invoices",
    description: "Receive invoice emails for billing events across tenants.",
  },
  {
    key: "billing_payment_failed:EMAIL",
    channel: "EMAIL",
    title: "Payment Failures",
    description: "Get alerted when a tenant payment fails.",
  },
  {
    key: "system:EMAIL",
    channel: "EMAIL",
    title: "System Announcements",
    description: "Platform-wide maintenance and outage notices.",
  },
  // In-app channel
  {
    key: "compliance_audit_due:IN_APP",
    channel: "IN_APP",
    title: "Compliance Audits Due",
    description: "Bell-icon alert when a tenant's audit window opens.",
  },
  {
    key: "compliance_credential_expiring:IN_APP",
    channel: "IN_APP",
    title: "Credentials Expiring",
    description: "Staff credentials nearing expiry across tenants.",
  },
  {
    key: "system:IN_APP",
    channel: "IN_APP",
    title: "System Notices",
    description: "In-app platform updates.",
  },
];

// Group toggle definitions by channel for the section layout.
function groupByChannel(
  defs: typeof TOGGLE_DEFS,
): Record<NotificationChannel, typeof TOGGLE_DEFS> {
  const out: Record<NotificationChannel, typeof TOGGLE_DEFS> = {
    EMAIL: [],
    IN_APP: [],
    SMS: [],
    PUSH: [],
  };
  for (const d of defs) out[d.channel].push(d);
  return out;
}

function prefKey(p: NotificationPreference): ToggleKey {
  return `${p.type}:${p.channel}`;
}

export function NotificationSettings() {
    const [prefs, setPrefs] = useState<NotificationPreference[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [savingKey, setSavingKey] = useState<ToggleKey | null>(null);

    const load = useCallback(async () => {
      setIsLoading(true);
      setError("");
      try {
        const rows = await listNotificationPreferences();
        setPrefs(rows);
      } catch (caught) {
        setError(
          caught instanceof ApiError
            ? caught.message
            : "Unable to load notification preferences.",
        );
        setPrefs([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      load();
    }, [load]);

    // Index prefs by (type, channel) so toggling is O(1).
    const prefsByKey = useMemo(() => {
      const out = new Map<ToggleKey, NotificationPreference>();
      for (const p of prefs) out.set(prefKey(p), p);
      return out;
    }, [prefs]);

    const grouped = useMemo(() => groupByChannel(TOGGLE_DEFS), []);

    const handleToggle = async (defKey: ToggleKey, nextValue: boolean) => {
      const [type, channel] = defKey.split(":") as [NotificationType, NotificationChannel];
      const existing = prefsByKey.get(defKey);

      // Optimistic update — flip the local row immediately, then PATCH
      // the server. If the request fails, revert.
      if (existing) {
        setPrefs((rows) =>
          rows.map((r) =>
            prefKey(r) === defKey ? { ...r, opted_in: nextValue } : r,
          ),
        );
      } else {
        // No row yet — backend lazy-seeds on list, so this branch only
        // fires on first toggle before a reload. Synthesise a stub row.
        setPrefs((rows) => [
          ...rows,
          {
            user_id: "",
            type,
            channel,
            opted_in: nextValue,
            updated_at: new Date().toISOString(),
          },
        ]);
      }

      setSavingKey(defKey);
      try {
        const updated = await updateNotificationPreference({
          type,
          channel,
          opted_in: nextValue,
        });
        setPrefs((rows) =>
          rows.map((r) => (prefKey(r) === defKey ? updated : r)),
        );
      } catch (caught) {
        // Revert on failure.
        if (existing) {
          setPrefs((rows) =>
            rows.map((r) =>
              prefKey(r) === defKey ? { ...r, opted_in: !nextValue } : r,
            ),
          );
        } else {
          setPrefs((rows) => rows.filter((r) => prefKey(r) !== defKey));
        }
        setError(
          caught instanceof ApiError
            ? caught.message
            : "Unable to update preference.",
        );
      } finally {
        setSavingKey(null);
      }
    };

    const ToggleSwitch = ({
      defKey,
      checked,
      disabled,
      onChange,
    }: {
      defKey: ToggleKey;
      checked: boolean;
      disabled: boolean;
      onChange: () => void;
    }) => (
        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            aria-label={`Toggle ${defKey}`}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              checked ? 'bg-primary' : 'bg-muted'
            }`}
        >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                checked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
        </button>
    );

    const channelMeta: Record<
      NotificationChannel,
      { icon: typeof Mail; title: string; subtitle: string; bg: string; color: string }
    > = {
      EMAIL: {
        icon: Mail,
        title: 'Email Notifications',
        subtitle: 'Receive updates directly to your inbox.',
        bg: 'bg-blue-500/10',
        color: 'text-blue-500',
      },
      IN_APP: {
        icon: Bell,
        title: 'In-App Notifications',
        subtitle: 'Bell-icon alerts while you\'re signed in.',
        bg: 'bg-primary/10',
        color: 'text-primary',
      },
      SMS: {
        icon: Smartphone,
        title: 'SMS Notifications',
        subtitle: 'Critical alerts only. No SMS toggles are exposed today.',
        bg: 'bg-orange-500/10',
        color: 'text-orange-500',
      },
      PUSH: {
        icon: MessageSquare,
        title: 'Push Notifications',
        subtitle: 'Mobile push (not yet wired on iOS/Android).',
        bg: 'bg-purple-500/10',
        color: 'text-purple-500',
      },
    };

    const renderChannelSection = (
      channel: NotificationChannel,
      defs: typeof TOGGLE_DEFS,
    ) => {
      const meta = channelMeta[channel];
      const Icon = meta.icon;
      // Only render a section if it has at least one toggle defined.
      if (defs.length === 0) return null;
      return (
        <div key={channel} className="p-6 border-b border-border last:border-b-0">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{meta.title}</h4>
              <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
            </div>
          </div>
          <div className="space-y-5">
            {defs.map((def) => {
              const pref = prefsByKey.get(def.key);
              const checked = pref?.opted_in ?? true;
              const isSaving = savingKey === def.key;
              return (
                <div key={def.key} className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-medium text-foreground">
                      {def.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {def.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : null}
                    <ToggleSwitch
                      defKey={def.key}
                      checked={checked}
                      disabled={isSaving || isLoading}
                      onChange={() => handleToggle(def.key, !checked)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Choose what updates you want to receive and how.</p>
                </div>
            </div>

            {error ? (
              <div className="px-6 py-3 bg-red-50 border-b border-border text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="p-0">
                {isLoading ? (
                  <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading preferences...
                  </div>
                ) : (
                  (Object.keys(grouped) as NotificationChannel[])
                    .filter((ch) => grouped[ch].length > 0)
                    .map((ch) => renderChannelSection(ch, grouped[ch]))
                )}
            </div>

            <div className="p-6 bg-muted/20 border-t border-border flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Changes are saved automatically. Critical security alerts cannot be disabled
                    and will always reach you through your primary email.
                </p>
            </div>
        </div>
    );
}