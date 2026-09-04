import { Link, useLocation } from "react-router-dom";
import { ArrowLeftRight, CloudSun, Heart, LayoutGrid, Settings, Star } from "lucide-react";

export const PRIMARY_NAV = [
  { to: "/weather", label: "Dashboard", icon: LayoutGrid },
  { to: "/compare", label: "Compare", icon: ArrowLeftRight },
  { to: "/favorites", label: "Favorites", icon: Star, mobileIcon: Heart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNavigate, className = "" }) {
  const { pathname } = useLocation();
  return (
    <aside className={`surface flex flex-col gap-5 p-3.5 ${className}`}>
      <Link to="/weather" onClick={onNavigate} className="flex items-center gap-2.5 px-0.5 pt-0.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/90 to-blue-700 shadow-lg shadow-blue-900/30">
          <CloudSun className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
        <span>
          <span className="font-display block text-sm font-bold leading-tight">SkyPulse</span>
          <span className="text-[10px] font-semibold tracking-wide text-blue-300">DASHBOARD</span>
        </span>
      </Link>

      <nav aria-label="Primary" className="flex flex-col gap-0.5">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link key={item.to} to={item.to} onClick={onNavigate} data-active={active}
              className="nav-link" aria-current={active ? "page" : undefined}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="my-auto" />

      <div className="flex flex-col gap-4 border-t border-[var(--subtle-border)] pt-4">
        <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
          Weather via{" "}<a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-blue-300 font-semibold hover:underline">Open-Meteo</a>
          <span className="block">Air quality via CAMS</span>
        </p>
      </div>
    </aside>
  );
}
