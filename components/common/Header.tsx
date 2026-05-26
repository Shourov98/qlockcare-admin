import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="h-[72px] px-8 bg-card border-b border-border flex justify-between items-center shrink-0">
      <div>
        <h1 className="text-[20px] font-semibold text-foreground tracking-tight">
          Global Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>
        <div className="flex items-center gap-3 ml-2 border-l border-border pl-6">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            JA
          </div>
          <div className="hidden sm:block">
            <p className="text-[14px] font-semibold text-foreground leading-none">
              John Admin
            </p>
            <p className="text-[12px] text-muted-foreground leading-none mt-1.5">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
