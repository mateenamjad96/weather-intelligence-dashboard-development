import { useEffect, useRef } from "react";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

// Self-contained search box: input + dropdown results + outside-click close.
// Reused by the header and the Favorites page.
export default function SearchField({
  onSelectLocation,
  placeholder,
  id = "city-search",
  minQueryLength = 2,
  debounceMs = 450,
}) {
  const containerRef = useRef(null);
  const { query, setQuery, results, loading, error, hasSearched, handleSubmit, handleSelect, handleClose } =
    useLocationSearch(onSelectLocation, { minQueryLength, debounceMs });

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) handleClose();
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [handleClose]);

  const open = loading || Boolean(error) || (hasSearched && query.trim().length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        loading={loading}
        placeholder={placeholder}
        id={id}
      />
      <SearchResults
        open={open}
        query={query}
        results={results}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        minQueryLength={minQueryLength}
        onSelect={handleSelect}
      />
    </div>
  );
}
