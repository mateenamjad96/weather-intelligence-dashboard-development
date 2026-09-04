import { Link, useLocation } from "react-router-dom";
import { PRIMARY_NAV } from "./Sidebar";

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--header-border)] bg-[var(--header-bg)] pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.45)] lg:hidden"
    >
      <div
        className="mx-auto grid max-w-md gap-1 px-2 py-1.5"
        style={{ gridTemplateColumns: `repeat(${PRIMARY_NAV.length}, minmax(0, 1fr))` }}
      >
        {PRIMARY_NAV.map((item) => {
          const Icon = item.mobileIcon ?? item.icon;
          const active = pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                active
                  ? "border-blue-400/45 bg-blue-500/15 text-blue-500"
                  : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--control-hover-bg)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
