export type BillingInvoiceStatus = "Paid" | "Pending" | "Overdue";

export type LegacyBillingInvoice = {
  id: number;
  invoiceNumber: string;
  agencyName: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  status: BillingInvoiceStatus;
};

export type PaymentStatus = "Successful" | "Failed" | "Refunded";

export type LegacyPayment = {
  id: number;
  transactionId: string;
  agencyName: string;
  method: string;
  amount: string;
  date: string;
  status: PaymentStatus;
};

export type TrialStatus = "Active" | "Expired";

export type LegacyTrial = {
  id: number;
  agencyName: string;
  type: "Trial" | "Demo";
  startDate: string;
  endDate: string;
  daysLeft: number;
  status: TrialStatus;
};

export type LegacySubscription = {
  id: number;
  agencyName: string;
  agencyEmail: string;
  plan: string;
  status: "Paid" | "Past Due" | "Trial" | "Demo";
  amount: string;
  billingCycle: string;
  nextPayment: string;
};

export type LegacyPlan = {
  name: string;
  price: string;
  billingCycle: string;
  features: string[];
};

export type LegacyCoupon = {
  id: number;
  code: string;
  discount: string;
  uses: number;
  maxUses: number;
  expiry: string;
  status: "Active" | "Expired";
};
