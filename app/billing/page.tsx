"use client";

import React, { useState } from "react";
import { SubscriptionsTab } from "@/components/billing/SubscriptionsTab";
import { InvoicesTab } from "@/components/billing/InvoicesTab";
import { PaymentsTab } from "@/components/billing/PaymentsTab";
import { TrialsTab } from "@/components/billing/TrialsTab";
import { PlansAndCoupons } from "@/components/billing/PlansAndCoupons";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("Subscriptions");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["Subscriptions", "Invoices", "Payments", "Trials & Demos", "Plans & Coupons"];

  return (
    <main className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === "Subscriptions" && (
        <SubscriptionsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}

      {activeTab === "Invoices" && <InvoicesTab />}

      {activeTab === "Payments" && <PaymentsTab />}

      {activeTab === "Trials & Demos" && <TrialsTab />}

      {activeTab === "Plans & Coupons" && (
        <PlansAndCoupons />
      )}
    </main>
  );
}
