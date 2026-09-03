import { ChevronRight, History, Trash2 } from "lucide-react";

export default function RecentSearches({ history, onSelect, onClear }) {
  return (
    <section className="card p-5" aria-labelledby="recent-searches-title">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 id="recent-searches-title" className="font-display flex items-center gap-2 text-base font-semibold">
          <History className="text-accent-soft h-4 w-4" aria-hidden="true" />
          Recent Searches
        </h3>
        {history.length > 0 && (
          <button type="button" className="btn btn-ghost h-8 px-2.5 text-xs" onClick={onClear}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-dim text-sm">No recent searches yet. Search for a city to build this list.</p>
      ) : (
        <ul className="space-y-1.5">
          {history.map((location) => (
            <li key={location.id}>
              <button
                type="button"
                onClick={() => onSelect(location)}
                className="hover:border-[var(--card-border)] hover:bg-[var(--chip-bg)] flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition"
              >
                <History className="text-dim h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{location.name}</span>
                  <span className="text-dim block truncate text-xs">
                    {[location.admin1, location.country].filter(Boolean).join(", ") || "—"}
                  </span>
                </span>
                <ChevronRight className="text-dim h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
