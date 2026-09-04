import { useCallback, useEffect, useState } from "react";
import { fetchWeather } from "../services/weatherService";
import { transformWeatherResponse } from "../utils/weatherTransformers";

const comparisonWeatherCache = new Map();
const EMPTY_STATE = { key: null, weather: null, loading: false, error: null };

function getLocationKey(location) {
  if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return null;
  return `${location.latitude},${location.longitude}`;
}

// Fetches one comparison side independently. Results are cached by coordinates,
// so swapping the two selected cities reuses data instead of making new requests.
export function useComparisonWeather(location) {
  const key = getLocationKey(location);
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  const timezone = location?.timezone ?? null;
  const [state, setState] = useState(EMPTY_STATE);
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => {
    if (key) comparisonWeatherCache.delete(key);
    setRevision((value) => value + 1);
  }, [key]);

  useEffect(() => {
    if (!key) {
      setState(EMPTY_STATE);
      return undefined;
    }

    const cached = comparisonWeatherCache.get(key);
    if (cached) {
      setState({ key, weather: cached, loading: false, error: null });
      return undefined;
    }

    const controller = new AbortController();
    setState({ key, weather: null, loading: true, error: null });

    fetchWeather(latitude, longitude, controller.signal)
      .then((data) => transformWeatherResponse(data, { fallbackTimezone: timezone }))
      .then((weather) => {
        comparisonWeatherCache.set(key, weather);
        setState({ key, weather, loading: false, error: null });
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({ key, weather: null, loading: false, error: error?.message ?? "Unable to load weather data." });
      });

    return () => controller.abort();
  }, [key, latitude, longitude, revision, timezone]);

  if (!key) return { ...EMPTY_STATE, reload };
  if (state.key === key) return { ...state, reload };
  const cached = comparisonWeatherCache.get(key);
  if (cached) return { key, weather: cached, loading: false, error: null, reload };
  return { key, weather: null, loading: true, error: null, reload };
}
