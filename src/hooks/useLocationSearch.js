import { useCallback, useEffect, useRef, useState } from "react";
import { searchLocations } from "../services/weatherService";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 450;

// Owns everything related to the geocoding search box: controlled query,
// results, loading/error state, debounced "as you type" requests and
// AbortController cancellation of stale requests.
export function useLocationSearch(onSelectLocation) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef(null);

  const search = useCallback(async (rawQuery) => {
    const trimmed = rawQuery.trim();
    abortControllerRef.current?.abort();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setError(trimmed.length ? `Enter at least ${MIN_QUERY_LENGTH} characters to search.` : null);
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
  }, []);

  // Debounced suggestions while typing; form submit still searches immediately.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) return undefined;
    const timer = setTimeout(() => search(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, search]);

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
      onSelectLocation(location);
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
