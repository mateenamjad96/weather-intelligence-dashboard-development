import { isRainyDay } from "./weatherTransformers";

export const FILTER_OPTIONS = [
  { id: "all", label: "All Days" },
  { id: "rainy", label: "Rainy Days" },
  { id: "hot", label: "High Temperature" },
  { id: "precipitation", label: "Days With Precipitation" },
  { id: "windy", label: "Strong Wind" },
];

export const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "hottest", label: "Highest Temperature" },
  { id: "coldest", label: "Lowest Temperature" },
  { id: "windiest", label: "Highest Wind Speed" },
  { id: "wettest", label: "Highest Precipitation" },
];

export const DEFAULT_HOT_THRESHOLD_C = 30;
export const DEFAULT_WIND_THRESHOLD_KMH = 20;

const FILTER_PREDICATES = {
  all: () => true,
  rainy: (day) => isRainyDay(day),
  hot: (day, thresholds) => (day.maxTemperature ?? -Infinity) >= thresholds.hotThresholdC,
  precipitation: (day) => (day.precipitation ?? 0) > 0,
  windy: (day, thresholds) => (day.maxWindSpeed ?? 0) >= thresholds.windThresholdKmh,
};

export function filterForecast(forecastDays, filterId, thresholds = {}) {
  const {
    hotThresholdC = DEFAULT_HOT_THRESHOLD_C,
    windThresholdKmh = DEFAULT_WIND_THRESHOLD_KMH,
  } = thresholds;
  const predicate = FILTER_PREDICATES[filterId] ?? FILTER_PREDICATES.all;
  return forecastDays.filter((day) => predicate(day, { hotThresholdC, windThresholdKmh }));
}

const SORT_COMPARATORS = {
  default: (a, b) => a.date.localeCompare(b.date),
  hottest: (a, b) => (b.maxTemperature ?? -Infinity) - (a.maxTemperature ?? -Infinity),
  coldest: (a, b) => (a.minTemperature ?? Infinity) - (b.minTemperature ?? Infinity),
  windiest: (a, b) => (b.maxWindSpeed ?? 0) - (a.maxWindSpeed ?? 0),
  wettest: (a, b) => (b.precipitation ?? 0) - (a.precipitation ?? 0),
};

// Always sorts a copy — the source forecast array is never mutated.
export function sortForecast(forecastDays, sortId) {
  const comparator = SORT_COMPARATORS[sortId] ?? SORT_COMPARATORS.default;
  return [...forecastDays].sort(comparator);
}
