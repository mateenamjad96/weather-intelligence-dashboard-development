import { useCallback, useEffect, useRef, useState } from "react";
import { searchLocations } from "../services/weatherService";

const DEFAULT_MIN_QUERY_LENGTH = 2;
const DEFAULT_DEBOUNCE_MS = 450;

// Owns everything related to the geocoding search box: controlled query,
// results, loading/error state, debounced "as you type" requests and
// AbortController cancellation of stale requests.
export function useLocationSearch(
  onSelectLocation,
  { minQueryLength = DEFAULT_MIN_QUERY_LENGTH, debounceMs = DEFAULT_DEBOUNCE_MS } = {}
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef(null);

  const search = useCallback(async (rawQuery) => {
    const trimmed = rawQuery.trim();
    abortControllerRef.current?.abort();

    if (trimmed.length < minQueryLength) {
      setResults([]);
      setError(trimmed.length ? `Enter at least ${minQueryLength} characters to search.` : null);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const found = await searchLocations(trimmed, 5, controller.signal);
      setResults(found);
      setHasSearched(true);
    } catch (requestError) {
      if (requestError?.name === "AbortError") return;
      setResults([]);
      setHasSearched(true);
      setError(requestError?.message ?? "Unable to search locations right now.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [minQueryLength]);

  // Debounced suggestions while typing; form submit still searches immediately.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minQueryLength) return undefined;
    const timer = setTimeout(() => search(query), debounceMs);
    return () => clearTimeout(timer);
  }, [debounceMs, minQueryLength, query, search]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      search(query);
    },
    [query, search]
  );

  const handleSelect = useCallback(
    (location) => {
      const accepted = onSelectLocation(location);
      if (accepted === false) return;
      setQuery("");
      setResults([]);
      setError(null);
      setHasSearched(false);
    },
    [onSelectLocation]
  );

  const handleClose = useCallback(() => {
    setResults([]);
    setHasSearched(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasSearched,
    search,
    handleSubmit,
    handleSelect,
    handleClose,
  };
}
