import React from "react";
import { Check, Edit, Trash2, Plus } from "lucide-react";
import { plansData, couponsData } from "./billing";

export function PlansAndCoupons() {
  return (
    <div className="space-y-8">
      {/* Plans Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Subscription Plans</h2>
          <button className="flex items-center gap-2 bg-[#066a5f] text-white px-4 py-2 rounded-[8px] text-sm font-medium hover:bg-[#05584f] transition-colors">
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plansData.map((plan, idx) => (
            <div key={idx} className="bg-card rounded-[12px] shadow-sm border border-border p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="flex gap-2">
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.billingCycle}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="bg-green-100 text-green-700 p-0.5 rounded-full shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Coupons Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Active Coupons</h2>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-[8px] text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>
        <div className="bg-white rounded-[12px] shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] text-foreground">
              <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Uses</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {couponsData.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold">{coupon.code}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">{coupon.discount}</td>
                    <td className="px-6 py-4 text-muted-foreground">{coupon.uses} / {coupon.maxUses}</td>
                    <td className="px-6 py-4 text-muted-foreground">{coupon.expiry}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-semibold px-2 py-1 rounded-[100px] ${coupon.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-2 justify-center">
                      <button aria-label="Edit" className="p-2 rounded-full hover:bg-muted/20 transition-colors text-foreground">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button aria-label="Delete" className="p-2 rounded-full hover:bg-muted/20 transition-colors text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
