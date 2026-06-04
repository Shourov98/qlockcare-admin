import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  /** Optional icon component */
  icon?: React.ReactNode;
}

/**
 * Reusable card component for showing a title and a numeric/value summary.
 * Uses the same glassmorphism style as other dashboard cards.
 */
export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-card rounded-[12px] p-6 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] transition-colors flex flex-col justify-between hover:border-border border border-transparent">
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <p className="text-[32px] leading-[1.3] font-semibold text-foreground">{value}</p>
    </div>
  );
};

export default SummaryCard;
