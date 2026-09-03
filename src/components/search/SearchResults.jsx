import { Spinner } from "../common/Loading";
import LocationCard from "./LocationCard";

export default function SearchResults({ open, query, results, loading, error, hasSearched, onSelect }) {
  if (!open) return null;
  return (
    <div className="card fade-in absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden p-2">
      {loading ? (
        <div role="status" className="text-dim flex items-center gap-2 px-3 py-3 text-sm">
          <Spinner className="h-4 w-4" />
          Searching…
        </div>
      ) : error ? (
        <p className="text-warn px-3 py-3 text-sm">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-dim px-3 py-4 text-center text-sm">
          {hasSearched ? (
            <>
              No locations found for <strong className="text-inherit">“{query.trim()}”</strong>. Check the spelling or
              try a nearby city.
            </>
          ) : (
            "Type at least 2 characters to search."
          )}
        </p>
      ) : (
        <ul className="scroll-slim max-h-80 overflow-y-auto">
          {results.map((location) => (
            <LocationCard key={location.id} location={location} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </div>
  );
}
