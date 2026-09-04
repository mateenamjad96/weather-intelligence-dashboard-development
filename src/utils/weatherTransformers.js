import { RAINY_CODES } from "./weatherCodes";

// Open-Meteo answers with parallel arrays (time[], temperature_2m[], ...).
// These transformers turn them into plain application objects so UI
// components never touch raw API shapes.

const COMPASS_POINTS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

export function compassDirection(degrees) {
  if (typeof degrees !== "number" || Number.isNaN(degrees)) return "—";
  const index = Math.round(degrees / 22.5) % COMPASS_POINTS.length;
  return COMPASS_POINTS[index];
}

function findCurrentHourIndex(hourly, currentTime) {
  if (!hourly?.time || !currentTime) return -1;
  const currentHourPrefix = currentTime.slice(0, 13);
  return hourly.time.findIndex((time) => time.startsWith(currentHourPrefix));
}

export function transformCurrentWeather(current, daily, hourly) {
  if (!current) return null;
  const hourIndex = findCurrentHourIndex(hourly, current.time);
  return {
    time: current.time ?? null,
    temperature: current.temperature_2m ?? null,
    feelsLike: current.apparent_temperature ?? null,
    humidity: current.relative_humidity_2m ?? null,
    precipitation: current.precipitation ?? 0,
    cloudCover: current.cloud_cover ?? null,
    pressure: current.surface_pressure ?? null,
    windSpeed: current.wind_speed_10m ?? null,
    windDirection: current.wind_direction_10m ?? null,
    windDirectionLabel: compassDirection(current.wind_direction_10m),
    weatherCode: current.weather_code ?? 0,
    isDay: current.is_day !== 0,
    uvIndex: hourly?.uv_index?.[hourIndex] ?? daily?.uv_index_max?.[0] ?? null,
    sunrise: daily?.sunrise?.[0] ?? null,
    sunset: daily?.sunset?.[0] ?? null,
    precipitationProbability: daily?.precipitation_probability_max?.[0] ?? null,
  };
}

export function transformHourlyForecast(hourly) {
  const times = hourly?.time ?? [];
  return times.map((time, index) => ({
    time,
    temperature: hourly.temperature_2m?.[index] ?? null,
    feelsLike: hourly.apparent_temperature?.[index] ?? null,
    precipitation: hourly.precipitation?.[index] ?? 0,
    precipitationProbability: hourly.precipitation_probability?.[index] ?? null,
    windSpeed: hourly.wind_speed_10m?.[index] ?? null,
    weatherCode: hourly.weather_code?.[index] ?? 0,
  }));
}

export function transformDailyForecast(daily) {
  const dates = daily?.time ?? [];
  return dates.map((date, index) => ({
    id: date,
    date,
    minTemperature: daily.temperature_2m_min?.[index] ?? null,
    maxTemperature: daily.temperature_2m_max?.[index] ?? null,
    weatherCode: daily.weather_code?.[index] ?? 0,
    precipitation: daily.precipitation_sum?.[index] ?? 0,
    precipitationProbability: daily.precipitation_probability_max?.[index] ?? null,
    sunrise: daily.sunrise?.[index] ?? null,
    sunset: daily.sunset?.[index] ?? null,
    maxWindSpeed: daily.wind_speed_10m_max?.[index] ?? null,
    uvIndexMax: daily.uv_index_max?.[index] ?? null,
  }));
}

export function transformWeatherResponse(data, { fallbackTimezone = null, airQuality = null } = {}) {
  const current = transformCurrentWeather(data?.current, data?.daily, data?.hourly);
  return {
    timezone: data?.timezone ?? fallbackTimezone,
    current: current
      ? {
          ...current,
          airQuality: airQuality
            ? { usAqi: airQuality.us_aqi ?? null, pm2_5: airQuality.pm2_5 ?? null }
            : null,
        }
      : null,
    hourly: transformHourlyForecast(data?.hourly),
    daily: transformDailyForecast(data?.daily),
  };
}

export function isRainyDay(day) {
  return (day?.precipitation ?? 0) > 0 || RAINY_CODES.includes(day?.weatherCode);
}
