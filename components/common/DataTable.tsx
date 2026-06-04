import React, { useState } from "react";

export interface Column<T> {
  /** Header label displayed in the table */
  header: string;
  /** Property key from the row data */
  accessor: keyof T;
}

/**
 * Generic data table with a simple client‑side text filter.
 * It is styled to match the rest of the dashboard (glassmorphism, subtle shadows).
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  filterAccessor = "name" as keyof T,
}: {
  columns: Column<T>[];
  data: T[];
  /** Which field the filter input should match. Defaults to "name". */
  filterAccessor?: keyof T;
}) {
  const [filter, setFilter] = useState("");

  const filtered = data.filter((row) => {
    const value = String(row[filterAccessor] ?? "").toLowerCase();
    return value.includes(filter.toLowerCase());
  });

  return (
    <div className="bg-card rounded-[12px] p-4 shadow-[0px_1px_4px_rgba(0,0,0,0.08)]">
      <input
        type="text"
        placeholder={`Search ${String(filterAccessor)}...`}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 w-full rounded-[8px] border border-border bg-card px-3 py-2 text-foreground focus:outline-none"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-foreground">
          <thead className="bg-[#066a5f] text-[12px] tracking-[0.05em] font-semibold text-white uppercase border-b border-border">
            <tr>
              {columns.map((col) => (
                <th key={String(col.accessor)} className="px-4 py-2">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border hover:bg-muted transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="px-4 py-2">
                    {String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-2 text-center text-muted-foreground">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
