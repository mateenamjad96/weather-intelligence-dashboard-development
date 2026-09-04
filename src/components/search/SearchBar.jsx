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
      {loading && (
        <Spinner className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
      )}
    </form>
  );
}
