import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, SearchX, Star } from "lucide-react";
import { useAppContext } from "../context/WeatherContext";
import { useWeather } from "../hooks/useWeather";
import { useLocalClock } from "../hooks/useLocalClock";
import { fetchCurrentWeather } from "../services/weatherService";
import CurrentWeather from "../components/weather/CurrentWeather";
import WeatherDetails from "../components/weather/WeatherDetails";
import HourlyWeather from "../components/weather/HourlyWeather";
import Forecast from "../components/weather/Forecast";
import WeatherStatistics from "../components/weather/WeatherStatistics";
import RecentSearches from "../components/search/RecentSearches";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import { Skeleton, Spinner } from "../components/common/Loading";
import FavoritesPreview from "../components/favorites/FavoritesPreview";
import { DEFAULT_HOT_THRESHOLD_C, DEFAULT_WIND_THRESHOLD_KMH, filterForecast, sortForecast } from "../utils/forecastFilters";
import { calculateWeatherStatistics } from "../utils/weatherStatistics";
import { isSameDay } from "../utils/dateUtils";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"><Skeleton className="h-72 rounded-[1.25rem]" /><Skeleton className="h-72 rounded-[1.25rem]" /></div>
      <Skeleton className="h-44 rounded-[1.25rem]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"><Skeleton className="h-48 rounded-xl"/><Skeleton className="h-48 rounded-xl"/><Skeleton className="h-48 rounded-xl"/><Skeleton className="h-48 rounded-xl"/></div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    selectedLocation, selectLocation, settings, temperatureUnit, theme, favorites,
    isFavorite, addFavorite, removeFavorite, searchHistory, clearSearchHistory,
  } = useAppContext();
  const { weather, loading, error, reload } = useWeather(selectedLocation, { refreshMinutes: settings.autoRefreshMinutes });
  const [searchParams, setSearchParams] = useSearchParams();
  const [urlError, setUrlError] = useState(null);
  const appliedUrlKeyRef = useRef("");

  const [selectedForecastDay, setSelectedForecastDay] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [hotThresholdC, setHotThresholdC] = useState(DEFAULT_HOT_THRESHOLD_C);
  const [windThresholdKmh, setWindThresholdKmh] = useState(DEFAULT_WIND_THRESHOLD_KMH);
  const [weatherById, setWeatherById] = useState({});

  useEffect(() => {
    const previewFavorites = favorites.slice(0, 3);
    if (previewFavorites.length === 0) {
      setWeatherById({});
      return undefined;
    }

    let cancelled = false;
    Promise.allSettled(
      previewFavorites.map(async (favorite) => [
        favorite.id,
        await fetchCurrentWeather(favorite.latitude, favorite.longitude),
      ])
    ).then((results) => {
      if (cancelled) return;
      const nextWeatherById = {};
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          nextWeatherById[result.value[0]] = result.value[1];
        }
      });
      setWeatherById(nextWeatherById);
    });

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  useEffect(() => {
    const lat = searchParams.get("lat"), lon = searchParams.get("lon"), city = searchParams.get("city");
    const urlKey = lat && lon ? `coords:${lat},${lon}` : city ? `city:${city.trim().toLowerCase()}` : "";
    if (!urlKey || urlKey === appliedUrlKeyRef.current) return;
    if (lat && lon) {
      appliedUrlKeyRef.current = urlKey;
      const latitude = Number(lat), longitude = Number(lon);
      const valid = Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
      if (!valid) { setUrlError("The link location is invalid — using the existing selection."); setSearchParams({}, { replace: true }); return; }
      setUrlError(null);
      selectLocation({ id: `${latitude},${longitude}`, name: searchParams.get("name") || "Pinned location", country: searchParams.get("country") ?? "", admin1: searchParams.get("admin1") ?? "", latitude, longitude, timezone: null }, { addToHistory: false });
      return;
    }
    let cancelled = false;
    import("../services/weatherService").then(({ searchLocations }) => {
      searchLocations(city, 1).then((found) => {
        if (cancelled) return; appliedUrlKeyRef.current = urlKey;
        if (found.length === 0) { setUrlError(`We couldn't find “${city}” from this link.`); return; }
        setUrlError(null); selectLocation(found[0], { addToHistory: false });
      }).catch(() => { if (!cancelled) { appliedUrlKeyRef.current = urlKey; setUrlError("The link location could not be loaded."); } });
    });
    return () => { cancelled = true; };
  }, [searchParams, selectLocation]);

  useEffect(() => { if (!selectedLocation || !Number.isFinite(selectedLocation.latitude) || !Number.isFinite(selectedLocation.longitude)) return; const key = `coords:${selectedLocation.latitude},${selectedLocation.longitude}`; if (appliedUrlKeyRef.current === key) return; appliedUrlKeyRef.current = key; setSearchParams({ lat: String(selectedLocation.latitude), lon: String(selectedLocation.longitude), name: selectedLocation.name }, { replace: true }); }, [selectedLocation, setSearchParams]);

  const handleSelectLocation = useCallback((location) => selectLocation(location), [selectLocation]);
  const handleToggleFavorite = useCallback(() => { if (!selectedLocation) return; isFavorite(selectedLocation.id) ? removeFavorite(selectedLocation.id) : addFavorite(selectedLocation); }, [addFavorite, isFavorite, removeFavorite, selectedLocation]);

  const forecastDays = weather?.daily ?? [];
  const activeDay = selectedForecastDay && forecastDays.some(d => d.date === selectedForecastDay) ? selectedForecastDay : (forecastDays[0]?.date ?? null);
  const isToday = activeDay && activeDay === forecastDays[0]?.date;

  const visibleHours = useMemo(() => {
    const h = (weather?.hourly ?? []).filter(hour => isSameDay(hour.time, activeDay));
    return settings.hourlyInterval === 3 ? h.filter((_, i) => i % 3 === 0) : h;
  }, [weather?.hourly, activeDay, settings.hourlyInterval]);

  const visibleForecast = useMemo(() => sortForecast(filterForecast(forecastDays, activeFilter, { hotThresholdC, windThresholdKmh }), sortOption), [forecastDays, activeFilter, hotThresholdC, windThresholdKmh, sortOption]);
  const statistics = useMemo(() => calculateWeatherStatistics(forecastDays), [forecastDays]);
  const localTimeLabel = useLocalClock(selectedLocation?.timezone ?? weather?.timezone ?? null, settings.timeFormat);
  const currentHourPrefix = weather?.current?.time?.slice(0, 13) ?? "";

  if (!selectedLocation) return (
    <div className="flex flex-col gap-5">
      {urlError && <ErrorMessage title="Link location problem" message={urlError} onDismiss={() => setUrlError(null)} />}
      <EmptyState icon={SearchX} title="No city selected" message="Search for a city above to see current conditions, hourly data and the forecast." />
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <RecentSearches history={searchHistory} onSelect={handleSelectLocation} onClear={clearSearchHistory} />
        <section className="card p-5" aria-label="Favorites preview"><h3 className="font-display text-base font-semibold mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-amber-300" fill="currentColor" aria-hidden="true" /> Favorites</h3><FavoritesPreview favorites={favorites.slice(0,3)} weatherById={weatherById} onOpen={handleSelectLocation} /><a href="#/favorites" className="ml-auto mt-3 block w-fit text-xs font-bold text-blue-300">View all →</a></section>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page flex flex-col gap-4">
      {urlError && <ErrorMessage title="Link location problem" message={urlError} onDismiss={() => setUrlError(null)} />}
      {loading && !weather && <DashboardSkeleton />}
      {error && <ErrorMessage title="Unable to load weather data." message={`${error} Check your connection and try again.`} onRetry={reload} />}
      {weather && (
        <>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <CurrentWeather location={selectedLocation} current={weather.current} today={forecastDays[0]} unit={temperatureUnit} theme={theme} timeFormat={settings.timeFormat} localTimeLabel={localTimeLabel} favoriteActive={isFavorite(selectedLocation.id)} onToggleFavorite={handleToggleFavorite} />
            <WeatherDetails current={weather.current} unit={temperatureUnit} timeFormat={settings.timeFormat} />
          </div>
          <HourlyWeather days={forecastDays} selectedDate={activeDay} onDateChange={setSelectedForecastDay} hours={visibleHours} unit={temperatureUnit} timeFormat={settings.timeFormat} currentHourPrefix={currentHourPrefix} isToday={isToday} />
          <Forecast days={visibleForecast} totalCount={forecastDays.length} unit={temperatureUnit} windUnit={settings.windUnit} timeFormat={settings.timeFormat} onResetFilter={() => setActiveFilter("all")} controlProps={{ activeFilter, onFilterChange: setActiveFilter, sortOption, onSortChange: setSortOption, hotThresholdC, windThresholdKmh, onHotThresholdChange: setHotThresholdC, onWindThresholdChange: setWindThresholdKmh, unit: temperatureUnit, windUnit: settings.windUnit }} />
          <WeatherStatistics statistics={statistics} unit={temperatureUnit} windUnit={settings.windUnit} />
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <RecentSearches history={searchHistory} onSelect={handleSelectLocation} onClear={clearSearchHistory} />
            <section className="card p-5" aria-labelledby="fav-preview-title"><h3 id="fav-preview-title" className="font-display text-base font-semibold mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-amber-300" fill="currentColor" aria-hidden="true" /> Favorites</h3><FavoritesPreview favorites={favorites.slice(0,3)} weatherById={weatherById} onOpen={handleSelectLocation} /><a href="#/favorites" className="ml-auto mt-3 block w-fit text-xs font-bold text-blue-300">View all →</a></section>
          </div>
        </>
      )}
    </div>
  );
}
