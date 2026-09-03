import { Search } from "lucide-react";
import { Spinner } from "../common/Loading";

export default function SearchBar({
  query,
  onQueryChange,
  onSubmit,
  loading,
  placeholder = "Search city…",
  label = "Search for a city",
  id = "city-search",
}) {
  return (
    <form role="search" onSubmit={onSubmit} className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="text-dim pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2" aria-hidden="true" />
      <input
        id={id}
        type="text"
        className="input search-input"
        value={query}
        maxLength={60}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {loading && <Spinner className="h-4 w-4" />}
        <button type="submit" className="btn btn-primary h-6 rounded-md px-3 text-[11px]" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
