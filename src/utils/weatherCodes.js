// Central mapping of Open-Meteo WMO weather codes to readable descriptions,
// icon keys and colour tones. Components never switch on raw codes.

const WEATHER_CODES = {
  0: { description: "Clear", icon: "clear", tone: "sun" },
  1: { description: "Mainly Clear", icon: "clear", tone: "sun" },
  2: { description: "Partly Cloudy", icon: "partly", tone: "sun" },
  3: { description: "Overcast", icon: "cloud", tone: "cloud" },
  45: { description: "Fog", icon: "fog", tone: "cloud" },
  48: { description: "Rime Fog", icon: "fog", tone: "cloud" },
  51: { description: "Light Drizzle", icon: "drizzle", tone: "rain" },
  53: { description: "Drizzle", icon: "drizzle", tone: "rain" },
  55: { description: "Dense Drizzle", icon: "drizzle", tone: "rain" },
  56: { description: "Freezing Drizzle", icon: "drizzle", tone: "rain" },
  57: { description: "Freezing Drizzle", icon: "drizzle", tone: "rain" },
  61: { description: "Light Rain", icon: "rain", tone: "rain" },
  63: { description: "Rain", icon: "rain", tone: "rain" },
  65: { description: "Heavy Rain", icon: "rain", tone: "rain" },
  66: { description: "Freezing Rain", icon: "rain", tone: "rain" },
  67: { description: "Freezing Rain", icon: "rain", tone: "rain" },
  71: { description: "Light Snow", icon: "snow", tone: "snow" },
  73: { description: "Snow", icon: "snow", tone: "snow" },
  75: { description: "Heavy Snow", icon: "snow", tone: "snow" },
  77: { description: "Snow Grains", icon: "snow", tone: "snow" },
  80: { description: "Light Showers", icon: "rain", tone: "rain" },
  81: { description: "Showers", icon: "rain", tone: "rain" },
  82: { description: "Violent Showers", icon: "rain", tone: "rain" },
  85: { description: "Snow Showers", icon: "snow", tone: "snow" },
  86: { description: "Snow Showers", icon: "snow", tone: "snow" },
  95: { description: "Thunderstorm", icon: "storm", tone: "storm" },
  96: { description: "Thunderstorm, Hail", icon: "storm", tone: "storm" },
  99: { description: "Thunderstorm, Hail", icon: "storm", tone: "storm" },
};

const FALLBACK_WEATHER = { description: "Unknown", icon: "cloud", tone: "cloud" };

export const RAINY_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] ?? FALLBACK_WEATHER;
}

export function getWeatherDescription(code) {
  return getWeatherInfo(code).description;
}

export function getUvLevel(uvIndex) {
  if (typeof uvIndex !== "number" || Number.isNaN(uvIndex)) return null;
  if (uvIndex < 3) return { label: "Low", tone: "text-emerald-400" };
  if (uvIndex < 6) return { label: "Moderate", tone: "text-amber-400" };
  if (uvIndex < 8) return { label: "High", tone: "text-warn" };
  if (uvIndex < 11) return { label: "Very High", tone: "text-red-400" };
  return { label: "Extreme", tone: "text-red-500" };
}
