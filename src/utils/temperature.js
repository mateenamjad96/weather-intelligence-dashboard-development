// Temperature and wind values are stored once (Celsius / km-h) and
// converted at display time so we never keep duplicate state.

export function convertTemperature(celsius, unit = "celsius") {
  if (typeof celsius !== "number" || Number.isNaN(celsius)) return null;
  return unit === "fahrenheit" ? (celsius * 9) / 5 + 32 : celsius;
}

export function toCelsius(value, unit = "celsius") {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return unit === "fahrenheit" ? ((value - 32) * 5) / 9 : value;
}

export function formatTemperature(celsius, unit = "celsius") {
  const converted = convertTemperature(celsius, unit);
  return converted === null ? "—" : `${Math.round(converted)}°`;
}

export function convertWindSpeed(kmh, unit = "kmh") {
  if (typeof kmh !== "number" || Number.isNaN(kmh)) return null;
  return unit === "mph" ? kmh * 0.621371 : kmh;
}

export function toKmh(value, unit = "kmh") {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return unit === "mph" ? value / 0.621371 : value;
}

export function formatWindSpeed(kmh, unit = "kmh") {
  const converted = convertWindSpeed(kmh, unit);
  if (converted === null) return "—";
  return `${Math.round(converted)} ${unit === "mph" ? "mph" : "km/h"}`;
}

export function formatPrecipitation(mm) {
  if (typeof mm !== "number" || Number.isNaN(mm)) return "—";
  return `${mm} mm`;
}
