import React, { useState } from "react";
import { ApiError } from "@/lib/api";
import {
  AgencyCreateInput,
  AgencySubscriptionPlan,
} from "./agencies";

interface AgencyAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (input: AgencyCreateInput) => Promise<void>;
}

const PLAN_OPTIONS: AgencySubscriptionPlan[] = [
  "BASIC",
  "PROFESSIONAL",
  "ENTERPRISE",
];

const TIMEZONES = [
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/New_York",
  "America/Phoenix",
  "UTC",
];

export function AgencyAddModal({ isOpen, onClose, onAdd }: AgencyAddModalProps) {
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [plan, setPlan] = useState<AgencySubscriptionPlan>("BASIC");
  const [startTrial, setStartTrial] = useState(false);
  const [trialDays, setTrialDays] = useState(14);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setTimezone("America/Chicago");
    setPlan("BASIC");
    setStartTrial(false);
    setTrialDays(14);
    setAdminEmail("");
    setAdminName("");
    setAdminPhone("");
    setAdminPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAdd) return;

    setError("");
    setIsSubmitting(true);
    try {
      await onAdd({
        name,
        timezone,
        subscriptionPlan: plan,
        startTrial,
        trialDays,
        admin: {
          email: adminEmail,
          fullName: adminName,
          phone: adminPhone || undefined,
          password: adminPassword || undefined,
        },
      });
      reset();
      onClose();
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Unable to create agency.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[32rem] p-6 my-auto">
        <h2 className="text-xl font-semibold mb-4">Add Agency</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Agency section */}
          <fieldset className="space-y-3 border border-border rounded-lg p-4">
            <legend className="text-xs uppercase tracking-wide text-muted-foreground px-2">
              Agency
            </legend>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                maxLength={255}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="Sunrise Home Health"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full border rounded px-2 py-1 bg-white"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plan</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as AgencySubscriptionPlan)}
                  className="w-full border rounded px-2 py-1 bg-white"
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={startTrial}
                  onChange={(e) => setStartTrial(e.target.checked)}
                  className="rounded"
                />
                Start trial
              </label>
              <div>
                <label className="block text-sm font-medium mb-1">Trial days</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={trialDays}
                  onChange={(e) => setTrialDays(parseInt(e.target.value, 10) || 14)}
                  disabled={!startTrial}
                  className="w-full border rounded px-2 py-1 disabled:opacity-50"
                />
              </div>
            </div>
          </fieldset>

          {/* Admin section (required by backend) */}
          <fieldset className="space-y-3 border border-border rounded-lg p-4">
            <legend className="text-xs uppercase tracking-wide text-muted-foreground px-2">
              Initial Agency Admin
            </legend>
            <p className="text-xs text-muted-foreground -mt-2">
              Every agency must have at least one admin. Leave password
              blank to send an invitation email instead.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                type="text"
                required
                maxLength={255}
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="jane@sunrise.example"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password (optional)
              </label>
              <input
                type="password"
                minLength={12}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="Leave blank to send invitation"
              />
              <p className="text-xs text-muted-foreground mt-1">
                When set, admin is created ACTIVE (login-ready). Otherwise
                INVITED with an email OTP.
              </p>
            </div>
          </fieldset>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create agency"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}