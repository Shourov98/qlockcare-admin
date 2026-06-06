import React from "react";
import { Search } from "lucide-react";
import { TrialsTable } from "./TrialsTable";

interface TrialsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TrialsTab({ searchQuery, setSearchQuery }: TrialsTabProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto overflow-hidden">
        <div className="flex items-center justify-between py-5">
          <h2 className="text-[24px] font-bold text-foreground">Trial & Demo Accounts</h2>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search agencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-border bg-muted/20 rounded-[8px] pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
        </div>
        <TrialsTable searchQuery={searchQuery} />
      </div>
    </div>
  );
}
