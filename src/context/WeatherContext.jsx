import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_SETTINGS, mergeWithDefaults } from "../utils/settings";

const HISTORY_LIMIT = 5;

const WeatherContext = createContext(null);

function isValidLocation(location) {
  return Boolean(
    location &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
}

export function WeatherProvider({ children }) {
  const [storedSettings, setStoredSettings] = useLocalStorage("wid.settings", DEFAULT_SETTINGS);
  const [theme, setTheme] = useLocalStorage("wid.theme", DEFAULT_SETTINGS.theme);
  const [temperatureUnit, setTemperatureUnit] = useLocalStorage("wid.unit", DEFAULT_SETTINGS.temperatureUnit);
  const [favorites, setFavorites] = useLocalStorage("wid.favorites", []);
  const [searchHistory, setSearchHistory] = useLocalStorage("wid.searchHistory", []);
  const [lastLocation, setLastLocation] = useLocalStorage("wid.lastLocation", null);

  const settings = useMemo(() => mergeWithDefaults(storedSettings), [storedSettings]);

  const [selectedLocation, setSelectedLocation] = useState(() => {
    const shouldRestore = mergeWithDefaults(storedSettings).rememberLastLocation;
    return shouldRestore && isValidLocation(lastLocation) ? lastLocation : null;
  });

  // Sync: the <html> class drives every dark-mode style in the app.
  useEffect(() => {
    const darkMode = theme === "dark";
    document.documentElement.classList.toggle("dark", darkMode);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", darkMode ? "#0b111d" : "#eef4ff");
  }, [theme]);

  const addSearchHistory = useCallback(
    (location) => {
      setSearchHistory((previous) => [location, ...previous.filter((item) => item.id !== location.id)].slice(0, HISTORY_LIMIT));
    },
    [setSearchHistory]
  );

  const clearSearchHistory = useCallback(() => setSearchHistory([]), [setSearchHistory]);

  const selectLocation = useCallback(
    (location, { addToHistory = true } = {}) => {
      if (!isValidLocation(location)) return false;
      setSelectedLocation(location);
      setLastLocation(location);
      if (addToHistory) addSearchHistory(location);
      return true;
    },
    [addSearchHistory, setLastLocation]
  );

  useEffect(() => {
    if (!selectedLocation || isValidLocation(selectedLocation)) return;
    setSelectedLocation(null);
    setLastLocation(null);
  }, [selectedLocation, setLastLocation]);

  const addFavorite = useCallback(
    (location) => {
      if (favorites.some((favorite) => favorite.id === location.id)) return false;
      setFavorites((previous) =>
        previous.some((favorite) => favorite.id === location.id) ? previous : [...previous, location]
      );
      return true;
    },
    [favorites, setFavorites]
  );

  const removeFavorite = useCallback(
    (favoriteId) => {
      setFavorites((previous) => previous.filter((favorite) => favorite.id !== favoriteId));
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (locationId) => favorites.some((favorite) => favorite.id === locationId),
    [favorites]
  );

  const saveSettings = useCallback(
    (nextValues) => {
      const merged = mergeWithDefaults(nextValues);
      setStoredSettings(merged);
      setTheme(merged.theme);
      setTemperatureUnit(merged.temperatureUnit);
    },
    [setStoredSettings, setTemperatureUnit, setTheme]
  );

  const value = useMemo(
    () => ({
      selectedLocation,
      selectLocation,
      theme,
      setTheme,
      temperatureUnit,
      setTemperatureUnit,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      searchHistory,
      addSearchHistory,
      clearSearchHistory,
      lastLocation,
      settings,
      saveSettings,
    }),
    [
      selectedLocation,
      selectLocation,
      theme,
      setTheme,
      temperatureUnit,
      setTemperatureUnit,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      searchHistory,
      addSearchHistory,
      clearSearchHistory,
      lastLocation,
      settings,
      saveSettings,
    ]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useAppContext() {
  const context = useContext(WeatherContext);
  if (!context) throw new Error("useAppContext must be used inside WeatherProvider");
  return context;
}
