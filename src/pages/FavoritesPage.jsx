import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Heart, Plus, Star } from "lucide-react";
import { formatRelativeMinutes } from "../utils/dateUtils";
import { useAppContext } from "../context/WeatherContext";
import { fetchCurrentWeather } from "../services/weatherService";
import FavoritesList from "../components/favorites/FavoritesList";
import EmptyState from "../components/common/EmptyState";
import SearchField from "../components/search/SearchField";

const FAVORITES_SORT_OPTIONS = [
  { value: "recent", label: "Recently added" },
  { value: "name", label: "Name (A–Z)" },
];

function FavoritesSort({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const selectedLabel = FAVORITES_SORT_OPTIONS.find((option) => option.value === value)?.label;

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectOption = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative z-20 w-full sm:w-48">
      <button
        ref={triggerRef}
        id="favorites-sort"
        type="button"
        className="input !flex !h-10 items-center justify-between gap-2 py-0 !text-[13px]"
        aria-label="Sort favorites"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="favorites-sort-options"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          id="favorites-sort-options"
          role="listbox"
          aria-label="Sort favorites"
          className="card fade-in absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden p-1"
        >
          {FAVORITES_SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-[var(--chip-bg)] ${
                option.value === value ? "bg-blue-500 text-white" : "text-[var(--text-primary)]"
              }`}
              onClick={() => selectOption(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites, addFavorite, removeFavorite, selectLocation, temperatureUnit, settings } = useAppContext();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("recent");
  const [weatherById, setWeatherById] = useState({});
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [favoriteFeedback, setFavoriteFeedback] = useState(null);
  const [isAddSearchOpen, setIsAddSearchOpen] = useState(false);

  useEffect(() => {
    if (!favoriteFeedback) return undefined;
    const timeoutId = window.setTimeout(() => setFavoriteFeedback(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [favoriteFeedback]);

  // One lightweight "current conditions" request per favorite, in parallel.
  useEffect(() => {
    if (favorites.length === 0) {
      setWeatherById({});
      return undefined;
    }
    let cancelled = false;
    setLoadingWeather(true);
    setFetchedAt(null);
    Promise.allSettled(
      favorites.map(async (favorite) => [favorite.id, await fetchCurrentWeather(favorite.latitude, favorite.longitude)])
    ).then((results) => {
      if (cancelled) return;
      const next = {};
      results.forEach((result) => {
        if (result.status === "fulfilled") next[result.value[0]] = result.value[1];
      });
      setWeatherById(next);
      setFetchedAt(new Date().toISOString());
      setLoadingWeather(false);
    });
    return () => {
      cancelled = true;
    };
  }, [favorites]);

  const handleOpen = useCallback(
    (location) => {
      selectLocation(location, { addToHistory: false });
      navigate("/weather");
    },
    [navigate, selectLocation]
  );

  const handleAddFavorite = useCallback(
    (location) => {
      const added = addFavorite(location);
      if (added) setIsAddSearchOpen(false);
      setFavoriteFeedback({
        type: added ? "success" : "duplicate",
        message: added ? `${location.name} added to favorites` : `${location.name} is already in favorites`,
      });
      return true;
    },
    [addFavorite]
  );

  const sortedFavorites =
    sortOption === "name"
      ? [...favorites].sort((a, b) => a.name.localeCompare(b.name))
      : [...favorites].reverse();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display flex items-center gap-2 text-2xl font-semibold">
            Favorites
            <Star className="h-5 w-5 text-accent-soft" fill="currentColor" aria-hidden="true" />
          </h1>
          <p className="text-dim text-sm">Your saved locations and quick weather overview</p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
          <div className={`relative z-20 ${isAddSearchOpen ? "w-full sm:w-64 lg:w-72" : "w-auto"}`}>
            {isAddSearchOpen ? (
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <SearchField
                    onSelectLocation={handleAddFavorite}
                    placeholder="Add new city..."
                    id="favorites-add-city"
                    minQueryLength={3}
                    debounceMs={400}
                  />
                </div>
                <button
                  type="button"
                  className="h-10 shrink-0 rounded-lg px-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  onClick={() => setIsAddSearchOpen(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary h-10 px-3"
                onClick={() => setIsAddSearchOpen(true)}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add new city
              </button>
            )}
          </div>
          <FavoritesSort value={sortOption} onChange={setSortOption} />
        </div>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorites yet"
          message="Save locations from the dashboard hero card and they will appear here with live conditions."
          actionLabel="Browse dashboard"
          onAction={() => navigate("/weather")}
        />
      ) : (
        <>
          <p className="text-dim -mb-2 text-sm">
            {favorites.length} {favorites.length === 1 ? "Location" : "Locations"}
          </p>
          <FavoritesList
            favorites={sortedFavorites}
            weatherById={weatherById}
            loadingWeather={loadingWeather}
            unit={temperatureUnit}
            windUnit={settings.windUnit}
            updatedLabel={fetchedAt ? `Updated ${formatRelativeMinutes(fetchedAt)}` : null}
            onOpen={handleOpen}
            onRemove={removeFavorite}
            onAddNew={() => navigate("/weather")}
          />
        </>
      )}

      <div className="card flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
        <span className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
          Tip: open a favorite to load its weather instantly — no geocoding search needed.
        </span>
        <span className="text-dim text-xs">
          Data provided by{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-accent-soft font-semibold hover:underline">
            Open-Meteo
          </a>
        </span>
      </div>

      {favoriteFeedback && (
        <div
          role="status"
          aria-live="polite"
          className={`card fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-50 max-w-[calc(100vw-2rem)] px-4 py-3 text-sm font-semibold shadow-xl lg:bottom-5 ${
            favoriteFeedback.type === "success" ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {favoriteFeedback.message}
        </div>
      )}
    </div>
  );
}
