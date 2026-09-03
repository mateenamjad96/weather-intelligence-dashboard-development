import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { formatRelativeMinutes } from "../utils/dateUtils";
import { useAppContext } from "../context/WeatherContext";
import { fetchCurrentWeather } from "../services/weatherService";
import FavoritesList from "../components/favorites/FavoritesList";
import SearchField from "../components/search/SearchField";
import EmptyState from "../components/common/EmptyState";

export default function FavoritesPage() {
  const { favorites, removeFavorite, selectLocation, temperatureUnit, settings } = useAppContext();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("recent");
  const [weatherById, setWeatherById] = useState({});
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(null);

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

  const handleSearchSelect = useCallback(
    (location) => {
      selectLocation(location);
      navigate("/weather");
    },
    [navigate, selectLocation]
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full min-w-[220px] sm:w-72">
            <SearchField onSelectLocation={handleSearchSelect} id="favorites-search" placeholder="Search city to add…" />
          </div>
          <div>
            <label htmlFor="favorites-sort" className="label-xs mb-1.5 block">
              Sort by
            </label>
            <select
              id="favorites-sort"
              className="input h-11 w-auto py-0 text-sm"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="recent">Recently added</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
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
    </div>
  );
}
