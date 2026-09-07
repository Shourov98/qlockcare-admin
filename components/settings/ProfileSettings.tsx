"use client";

import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, BadgeCheck, Loader2, Save } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Read-only display of the signed-in admin's account.
 *
 * The admin backend's `User` model currently exposes only
 * `full_name`, `email`, `phone`, `status`, `email_verified`, `role`,
 * and (for PLATFORM_ADMIN) `scopes`. There is no `first_name` /
 * `last_name` split, no organisation field, and no avatar upload —
 * so we render only what the backend actually returns. Editing your
 * `PATCH /auth/me` supports edits to full name and phone. Email remains
 * read-only because it is the account's login identity.
 */
export function ProfileSettings() {
  const { user, isLoading, updateProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFullName(user?.full_name ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.full_name, user?.phone]);

  const save = async () => {
    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      await updateProfile({ full_name: fullName.trim(), phone: phone.trim() || undefined });
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-12 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center text-muted-foreground">
        Not signed in.
      </div>
    );
  }

  const roleLabel = user.role === "SUPER_ADMIN"
    ? "Super Admin"
    : user.role === "PLATFORM_ADMIN"
      ? "Platform Admin"
      : (user.role ?? "Unknown role");

  const initial = (user.full_name || user.email || "?").trim().charAt(0).toUpperCase();

  const Field = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: typeof User;
    label: string;
    value: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <div className="w-full bg-muted/20 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground">
          {value || <span className="text-muted-foreground italic">Not set</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
          <p className="text-sm text-muted-foreground">Update your name and phone number.</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={isSaving || !fullName.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-md bg-primary/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">{initial}</span>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-foreground">
                {user.full_name || user.email}
              </h4>
              <p className="text-sm text-muted-foreground">{roleLabel}</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="profile-full-name">
                Full Name
              </label>
              <input
                id="profile-full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              />
            </div>
            <Field icon={Mail} label="Email Address" value={user.email} />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="profile-phone">
                Phone Number
              </label>
              <input
                id="profile-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Not set"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {saved ? <p className="text-sm text-emerald-700">Profile changes saved.</p> : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                icon={Shield}
                label="Role"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    {roleLabel}
                    {user.role === "SUPER_ADMIN" ? (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wide">
                        full access
                      </span>
                    ) : null}
                  </span>
                }
              />
              <Field
                icon={BadgeCheck}
                label="Email Verified"
                value={
                  user.email_verified ? (
                    <span className="inline-flex items-center gap-1 text-green-700">
                      <BadgeCheck className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-700">Not verified</span>
                  )
                }
              />
            </div>

            {user.role === "PLATFORM_ADMIN" ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Granted Scopes
                </label>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {user.scopes.length === 0 ? (
                    <span className="text-sm text-muted-foreground italic">
                      No scopes granted yet
                    </span>
                  ) : (
                    user.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        {scope}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
