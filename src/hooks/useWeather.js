import { useCallback, useEffect, useState } from "react";
import { fetchAirQuality, fetchWeather } from "../services/weatherService";
import {
  transformCurrentWeather,
  transformDailyForecast,
  transformHourlyForecast,
} from "../utils/weatherTransformers";

export function useWeather(location, { refreshMinutes = 0 } = {}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!location) {
      setWeather(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [data, airQuality] = await Promise.all([
        fetchWeather(location.latitude, location.longitude),
        fetchAirQuality(location.latitude, location.longitude).catch(() => null),
      ]);
      const transformedCurrent = transformCurrentWeather(data.current, data.daily, data.hourly);
      setWeather({
        timezone: data.timezone ?? location.timezone ?? null,
        current: {
          ...transformedCurrent,
          airQuality: airQuality
            ? { usAqi: airQuality.us_aqi ?? null, pm2_5: airQuality.pm2_5 ?? null }
            : null,
        },
        hourly: transformHourlyForecast(data.hourly),
        daily: transformDailyForecast(data.daily),
      });
    } catch (requestError) {
      setError(requestError?.message ?? "Unable to load weather data.");
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Sync: refetch whenever the selected location changes.
  useEffect(() => {
    reload();
  }, [reload]);

  // Sync: optional auto refresh interval coming from settings.
  useEffect(() => {
    if (!location || !refreshMinutes) return undefined;
    const intervalId = setInterval(reload, refreshMinutes * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [location, refreshMinutes, reload]);

  return { weather, loading, error, reload };
}
