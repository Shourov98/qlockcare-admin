import React, { useState } from "react";
import { ApiError } from "@/lib/api";
import {
  Agency,
  AgencyStatus,
  AgencySubscriptionPlan,
  AgencyUpdateInput,
} from "./agencies";

interface AgencyEditModalProps {
  isOpen: boolean;
  agency: Agency | null;
  onClose: () => void;
  onEdit?: (agencyId: string, input: AgencyUpdateInput) => Promise<void>;
}

const STATUS_OPTIONS: AgencyStatus[] = [
  "ACTIVE",
  "TRIAL",
  "SUSPENDED",
  "CHURNED",
];

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

export function AgencyEditModal({
  isOpen,
  agency,
  onClose,
  onEdit,
}: AgencyEditModalProps) {
  const [name, setName] = useState(agency?.name || "");
  const [timezone, setTimezone] = useState(agency?.timezone || "America/Chicago");
  const [status, setStatus] = useState<AgencyStatus>(agency?.status || "ACTIVE");
  const [plan, setPlan] = useState<AgencySubscriptionPlan>(
    agency?.subscriptionPlan || "BASIC",
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when the modal opens for a different agency.
  React.useEffect(() => {
    if (!isOpen || !agency) return;
    setName(agency.name);
    setTimezone(agency.timezone);
    setStatus(agency.status);
    setPlan(agency.subscriptionPlan);
    setError("");
  }, [isOpen, agency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency || !onEdit) return;

    setError("");
    setIsSubmitting(true);
    try {
      await onEdit(agency.id, {
        name,
        timezone,
        status,
        subscriptionPlan: plan,
      });
      onClose();
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Unable to save agency.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !agency) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[28rem] p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Agency</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              maxLength={255}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AgencyStatus)}
                className="w-full border rounded px-2 py-1 bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plan</label>
              <select
                value={plan}
                onChange={(e) =>
                  setPlan(e.target.value as AgencySubscriptionPlan)
                }
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
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}