export const DEFAULT_SETTINGS = {
  theme: "dark",
  temperatureUnit: "celsius",
  defaultView: "hourly",
  hourlyInterval: 1,
  windUnit: "kmh",
  timeFormat: "12h",
  autoRefreshMinutes: 30,
  rememberLastLocation: true,
};

export const SETTINGS_CHOICES = {
  theme: ["dark", "light"],
  temperatureUnit: ["celsius", "fahrenheit"],
  defaultView: ["seven-day", "hourly"],
  hourlyInterval: [1, 3],
  windUnit: ["kmh", "mph"],
  timeFormat: ["12h", "24h"],
  autoRefreshMinutes: [0, 15, 30, 60],
  rememberLastLocation: [true, false],
};

// Validation keeps corrupted LocalStorage or bad input from reaching the app.
export function validateSettings(values) {
  const errors = {};
  Object.keys(DEFAULT_SETTINGS).forEach((key) => {
    const allowed = SETTINGS_CHOICES[key];
    if (!allowed || !allowed.includes(values?.[key])) {
      errors[key] = "Please choose one of the available options.";
    }
  });
  return errors;
}

export function mergeWithDefaults(values) {
  return { ...DEFAULT_SETTINGS, ...(values ?? {}) };
}
