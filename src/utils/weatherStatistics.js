import { isRainyDay } from "./weatherTransformers";

// All statistics are derived from the forecast array on demand.
// They are never stored in state.

function numbersOnly(values) {
  return values.filter((value) => typeof value === "number" && !Number.isNaN(value));
}

export function calculateAverageTemperature(forecastDays) {
  const dailyMeans = numbersOnly(
    forecastDays.map((day) =>
      typeof day.maxTemperature === "number" && typeof day.minTemperature === "number"
        ? (day.maxTemperature + day.minTemperature) / 2
        : null
    )
  );
  if (dailyMeans.length === 0) return null;
  return dailyMeans.reduce((sum, value) => sum + value, 0) / dailyMeans.length;
}

export function calculateTotalPrecipitation(forecastDays) {
  return forecastDays.reduce((sum, day) => sum + (day.precipitation ?? 0), 0);
}

export function calculateMaximumWindSpeed(forecastDays) {
  const speeds = numbersOnly(forecastDays.map((day) => day.maxWindSpeed));
  return speeds.length ? Math.max(...speeds) : null;
}

export function calculateWeatherStatistics(forecastDays) {
  if (!forecastDays?.length) {
    return {
      highestTemperature: null,
      lowestTemperature: null,
      averageTemperature: null,
      totalPrecipitation: 0,
      maximumWindSpeed: null,
      rainyDays: 0,
    };
  }
  const highs = numbersOnly(forecastDays.map((day) => day.maxTemperature));
  const lows = numbersOnly(forecastDays.map((day) => day.minTemperature));
  return {
    highestTemperature: highs.length ? Math.max(...highs) : null,
    lowestTemperature: lows.length ? Math.min(...lows) : null,
    averageTemperature: calculateAverageTemperature(forecastDays),
    totalPrecipitation: calculateTotalPrecipitation(forecastDays),
    maximumWindSpeed: calculateMaximumWindSpeed(forecastDays),
    rainyDays: forecastDays.filter((day) => isRainyDay(day)).length,
  };
}
