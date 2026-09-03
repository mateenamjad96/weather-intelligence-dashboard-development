// Service layer: every Open-Meteo URL is built here, never inside components.

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation",
  "cloud_cover",
  "wind_speed_10m",
  "wind_direction_10m",
  "surface_pressure",
  "weather_code",
  "is_day",
];

const HOURLY_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation",
  "precipitation_probability",
  "wind_speed_10m",
  "weather_code",
  "uv_index",
];

const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "sunrise",
  "sunset",
  "wind_speed_10m_max",
  "uv_index_max",
];

async function getJson(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error("Unable to reach the weather service. Check your connection and try again.");
  }
  if (!response.ok) {
    throw new Error(`The weather service responded with an error (status ${response.status}).`);
  }
  return response.json();
}

function mapGeocodingResult(result) {
  return {
    id: result.id != null ? String(result.id) : `${result.latitude},${result.longitude}`,
    name: result.name ?? "Unknown location",
    country: result.country ?? "",
    countryCode: result.country_code ?? "",
    admin1: result.admin1 ?? "",
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone ?? null,
  };
}

export async function searchLocations(query, count = 5, signal) {
  const params = new URLSearchParams({ name: query, count: String(count), format: "json" });
  const data = await getJson(`${GEOCODING_URL}?${params.toString()}`, signal);
  if (!data || !Array.isArray(data.results)) {
    throw new Error("The geocoding service returned an unexpected response.");
  }
  return data.results
    .filter((result) => Number.isFinite(result?.latitude) && Number.isFinite(result?.longitude))
    .map(mapGeocodingResult);
}

export async function fetchWeather(latitude, longitude, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS.join(","),
    hourly: HOURLY_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    timezone: "auto",
    forecast_days: "7",
    wind_speed_unit: "kmh",
  });
  const data = await getJson(`${FORECAST_URL}?${params.toString()}`, signal);
  if (!data?.daily?.time?.length || !data?.current) {
    throw new Error("The weather service returned an unexpected response.");
  }
  return data;
}

export async function fetchAirQuality(latitude, longitude, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "us_aqi,pm2_5",
    timezone: "auto",
  });
  const data = await getJson(`${AIR_QUALITY_URL}?${params.toString()}`, signal);
  return data?.current ?? null;
}

// Lightweight request used by the Favorites page (current conditions only).
export async function fetchCurrentWeather(latitude, longitude, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS.join(","),
    timezone: "auto",
    forecast_days: "1",
    wind_speed_unit: "kmh",
  });
  const data = await getJson(`${FORECAST_URL}?${params.toString()}`, signal);
  if (!data?.current) {
    throw new Error("The weather service returned an unexpected response.");
  }
  return data.current;
}
