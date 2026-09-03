import { ChevronRight, MapPin } from "lucide-react";

export default function LocationCard({ location, onSelect }) {
  const region = [location.admin1, location.country].filter(Boolean).join(", ");
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(location)}
        className="hover:bg-[var(--chip-bg)] flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition"
      >
        <MapPin className="text-accent-soft h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{location.name}</span>
          <span className="text-dim block truncate text-xs">
            {region || "Unknown region"} · {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
          </span>
        </span>
        <ChevronRight className="text-dim h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
    </li>
  );
}
