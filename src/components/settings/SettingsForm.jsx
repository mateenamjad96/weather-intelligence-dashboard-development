import { useEffect, useState } from "react";
import {
  Check,
  CircleAlert,
  Info,
  MapPin,
  Moon,
  Palette,
  RefreshCw,
  Ruler,
  Save,
  SlidersHorizontal,
  Sun,
  Thermometer,
  ThermometerSun,
  RotateCcw,
} from "lucide-react";
import { useAppContext } from "../../context/WeatherContext";
import ErrorMessage from "../common/ErrorMessage";
import ToggleSwitch from "../common/ToggleSwitch";
import { DEFAULT_SETTINGS, validateSettings } from "../../utils/settings";

const FIELD_LABELS = {
  theme: "Theme",
  temperatureUnit: "Temperature unit",
  defaultView: "Default view",
  hourlyInterval: "Hourly interval",
  windUnit: "Wind speed unit",
  timeFormat: "Time format",
  autoRefreshMinutes: "Auto refresh",
  rememberLastLocation: "Remember last location",
};

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--chip-bg)]">
          <Icon className="text-accent-soft h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold">{title}</h2>
          <p className="text-dim text-xs">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function OptionCard({ active, onClick, icon: Icon, title, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        active
          ? "border-[var(--color-accent)] bg-[rgba(59,130,246,0.12)]"
          : "border-[var(--card-border)] bg-[var(--chip-bg)] hover:border-[var(--card-border-hover)]"
      }`}
    >
      <Icon className={`h-6 w-6 shrink-0 ${active ? "text-accent-soft" : "text-dim"}`} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="text-dim block text-xs">{description}</span>
      </span>
      {active ? (
        <span className="bg-accent flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
          <Check className="h-3 w-3" aria-hidden="true" />
        </span>
      ) : (
        <span className="h-5 w-5 shrink-0 rounded-full border border-[var(--card-border)]" />
      )}
    </button>
  );
}

function SelectField({ id, label, value, onChange, options, error }) {
  return (
    <div>
      <label htmlFor={id} className="label-xs mb-1.5 block">
        {label}
      </label>
      <select id={id} className="input h-10 w-full py-0 text-sm" value={String(value)} onChange={onChange}>
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-warn mt-1 text-xs">{error}</p>}
    </div>
  );
}

export default function SettingsForm() {
  const { settings, saveSettings, theme, temperatureUnit, lastLocation } = useAppContext();

  const buildDraft = () => ({
    theme,
    temperatureUnit,
    defaultView: settings.defaultView,
    hourlyInterval: settings.hourlyInterval,
    windUnit: settings.windUnit,
    timeFormat: settings.timeFormat,
    autoRefreshMinutes: settings.autoRefreshMinutes,
    rememberLastLocation: settings.rememberLastLocation,
  });

  const [draft, setDraft] = useState(buildDraft);
  const [savedSnapshot, setSavedSnapshot] = useState(buildDraft);
  const [errors, setErrors] = useState({});
  const [savedFlash, setSavedFlash] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(savedSnapshot);
  const errorList = Object.keys(errors);

  useEffect(() => {
    if (!savedFlash) return undefined;
    const timer = setTimeout(() => setSavedFlash(false), 2500);
    return () => clearTimeout(timer);
  }, [savedFlash]);

  const setField = (key, value) => setDraft((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateSettings(draft);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    saveSettings(draft);
    setSavedSnapshot(draft);
    setSavedFlash(true);
  };

  const handleReset = () => {
    setDraft({ ...DEFAULT_SETTINGS });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-5">
        <Section icon={Palette} title="Appearance" subtitle="Choose your preferred theme">
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              active={draft.theme === "dark"}
              onClick={() => setField("theme", "dark")}
              icon={Moon}
              title="Dark Mode"
              description="Easy on the eyes for low light conditions"
            />
            <OptionCard
              active={draft.theme === "light"}
              onClick={() => setField("theme", "light")}
              icon={Sun}
              title="Light Mode"
              description="Classic bright theme for daytime use"
            />
          </div>
        </Section>

        <Section icon={Thermometer} title="Temperature Unit" subtitle="Select your preferred temperature unit">
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              active={draft.temperatureUnit === "celsius"}
              onClick={() => setField("temperatureUnit", "celsius")}
              icon={Thermometer}
              title="Celsius (°C)"
              description="Metric temperature unit"
            />
            <OptionCard
              active={draft.temperatureUnit === "fahrenheit"}
              onClick={() => setField("temperatureUnit", "fahrenheit")}
              icon={ThermometerSun}
              title="Fahrenheit (°F)"
              description="Imperial temperature unit"
            />
          </div>
        </Section>

        <Section icon={Ruler} title="Forecast Display" subtitle="Choose how forecast information is presented">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="default-view"
              label="Default view"
              value={draft.defaultView}
              onChange={(event) => setField("defaultView", event.target.value)}
              error={errors.defaultView}
              options={[
                { value: "hourly", label: "Hourly First" },
                { value: "seven-day", label: "7-Day First" },
              ]}
            />
            <SelectField
              id="hourly-interval"
              label="Hourly interval"
              value={draft.hourlyInterval}
              onChange={(event) => setField("hourlyInterval", Number(event.target.value))}
              error={errors.hourlyInterval}
              options={[
                { value: 1, label: "1 Hour" },
                { value: 3, label: "3 Hours" },
              ]}
            />
          </div>
        </Section>

        <Section icon={SlidersHorizontal} title="Additional Preferences" subtitle="Customize your weather data display">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="wind-unit"
              label="Wind speed unit"
              value={draft.windUnit}
              onChange={(event) => setField("windUnit", event.target.value)}
              error={errors.windUnit}
              options={[
                { value: "kmh", label: "km/h" },
                { value: "mph", label: "mph" },
              ]}
            />
            <SelectField
              id="time-format"
              label="Time format"
              value={draft.timeFormat}
              onChange={(event) => setField("timeFormat", event.target.value)}
              error={errors.timeFormat}
              options={[
                { value: "12h", label: "12-Hour (AM/PM)" },
                { value: "24h", label: "24-Hour" },
              ]}
            />
          </div>
        </Section>

      </div>

      <div className="flex flex-col gap-5">
        <section className="card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--chip-bg)]">
              <MapPin className="text-accent-soft h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">Location Settings</h2>
              <p className="text-dim text-xs">Manage location preferences</p>
            </div>
          </div>
          <p className="label-xs mb-1">Default location on start</p>
          <p className="truncate rounded-xl border border-[var(--card-border)] bg-[var(--chip-bg)] px-3 py-2.5 text-sm font-semibold">
            {lastLocation
              ? [lastLocation.name, lastLocation.admin1, lastLocation.country].filter(Boolean).join(", ")
              : "Not set yet"}
          </p>
          <div className="mt-4">
            <ToggleSwitch
              checked={draft.rememberLastLocation}
              onChange={(checked) => setField("rememberLastLocation", checked)}
              label="Remember Last Location"
              description="Open the last viewed location on app start"
            />
          </div>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--chip-bg)]">
              <Info className="text-accent-soft h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">About</h2>
              <p className="text-dim text-xs">Application information</p>
            </div>
          </div>
          <dl className="flex flex-col gap-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-dim">Version</dt>
              <dd className="font-semibold">1.0.0</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-dim">Built with</dt>
              <dd className="font-semibold">ReactJS + Vite</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-dim">Weather data</dt>
              <dd className="font-semibold">Open-Meteo</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-dim">Storage</dt>
              <dd className="font-semibold">Browser LocalStorage</dd>
            </div>
          </dl>
        </section>

        <Section icon={RefreshCw} title="Data & Updates" subtitle="Data usage and update preferences">
          <div className="flex flex-col gap-4">
            <SelectField
              id="auto-refresh"
              label="Auto refresh weather"
              value={draft.autoRefreshMinutes}
              onChange={(event) => setField("autoRefreshMinutes", Number(event.target.value))}
              error={errors.autoRefreshMinutes}
              options={[
                { value: 0, label: "Off" },
                { value: 15, label: "Every 15 minutes" },
                { value: 30, label: "Every 30 minutes" },
                { value: 60, label: "Every hour" },
              ]}
            />
            <p className="text-dim -mt-1 text-xs">
              Auto refresh refetches the current location in the background while the dashboard is open.
            </p>
          </div>
        </Section>
      </div>

      {errorList.length > 0 && (
        <div className="xl:col-span-2">
          <ErrorMessage
            compact
            title="Please fix the highlighted fields"
            message={`Invalid values: ${errorList.map((key) => FIELD_LABELS[key] ?? key).join(", ")}.`}
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-3 xl:col-span-2">
        <div className="flex items-center gap-3 text-xs">
          {dirty && (
            <span className="text-warn flex items-center gap-1.5 font-semibold">
              <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
              Unsaved changes
            </span>
          )}
          {savedFlash && (
            <span className="fade-in flex items-center gap-1.5 font-semibold text-emerald-400">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Settings saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset to Defaults
          </button>
          <button type="submit" className="btn btn-primary">
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Settings
          </button>
        </div>
      </div>
    </form>
  );
}
