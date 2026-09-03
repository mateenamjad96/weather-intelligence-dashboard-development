import { ArrowDown, ArrowUp, Clock, Droplets, Gauge, Leaf, Star, Wind } from "lucide-react";
import { formatWeatherTime } from "../../utils/dateUtils";
import { getWeatherInfo } from "../../utils/weatherCodes";
import { formatTemperature, formatWindSpeed } from "../../utils/temperature";
import WeatherIcon from "./WeatherIcon";

function getAtmosphere(weatherCode, isDay, isDarkTheme) {
  if (!isDarkTheme) {
    if (weatherCode >= 95) return { background: "linear-gradient(145deg, #f5f3ff 0%, #e0e7ff 52%, #eef2ff 100%)", glow: "rgba(139,92,246,.16)", accent: "rgba(250,204,21,.16)" };
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return { background: "linear-gradient(145deg, #f0f9ff 0%, #dbeafe 52%, #ecfeff 100%)", glow: "rgba(14,165,233,.17)", accent: "rgba(56,189,248,.14)" };
    if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) return { background: "linear-gradient(145deg, #ffffff 0%, #e0f2fe 52%, #f1f5f9 100%)", glow: "rgba(125,211,252,.2)", accent: "rgba(148,163,184,.12)" };
    if (weatherCode === 45 || weatherCode === 48) return { background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 52%, #f1f5f9 100%)", glow: "rgba(148,163,184,.16)", accent: "rgba(203,213,225,.16)" };
    if (!isDay) return { background: "linear-gradient(145deg, #f1f5ff 0%, #dbeafe 52%, #e8edff 100%)", glow: "rgba(99,102,241,.15)", accent: "rgba(96,165,250,.14)" };
    if (weatherCode <= 1) return { background: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 48%, #fef3c7 100%)", glow: "rgba(250,204,21,.22)", accent: "rgba(56,189,248,.16)" };
    return { background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 52%, #eff6ff 100%)", glow: "rgba(96,165,250,.16)", accent: "rgba(148,163,184,.14)" };
  }
  if (!isDay) return { background: "linear-gradient(145deg, #070b18 0%, #111b35 52%, #091120 100%)", glow: "rgba(96,165,250,.24)", accent: "rgba(129,140,248,.18)", stars: true };
  if (weatherCode >= 95) return { background: "linear-gradient(145deg, #111827 0%, #263451 48%, #151c2e 100%)", glow: "rgba(167,139,250,.25)", accent: "rgba(250,204,21,.12)" };
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return { background: "linear-gradient(145deg, #0b1727 0%, #16405b 52%, #0b1c2c 100%)", glow: "rgba(56,189,248,.25)", accent: "rgba(14,165,233,.16)" };
  if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) return { background: "linear-gradient(145deg, #172033 0%, #526782 50%, #243247 100%)", glow: "rgba(224,242,254,.3)", accent: "rgba(186,230,253,.2)" };
  if (weatherCode === 45 || weatherCode === 48) return { background: "linear-gradient(145deg, #18212e 0%, #52606d 52%, #202b38 100%)", glow: "rgba(203,213,225,.2)", accent: "rgba(148,163,184,.17)" };
  if (weatherCode <= 1) return { background: "linear-gradient(145deg, #082f60 0%, #0b69a3 52%, #073b6b 100%)", glow: "rgba(250,204,21,.28)", accent: "rgba(56,189,248,.2)" };
  return { background: "linear-gradient(145deg, #101722 0%, #344354 52%, #18222f 100%)", glow: "rgba(148,163,184,.22)", accent: "rgba(96,165,250,.15)" };
}

function getAirQualityLevel(aqi) {
  if (typeof aqi !== "number" || Number.isNaN(aqi)) return null;
  if (aqi <= 50) return { label: "Good", tone: "text-emerald-400", dot: "bg-emerald-400" };
  if (aqi <= 100) return { label: "Moderate", tone: "text-amber-400", dot: "bg-amber-400" };
  if (aqi <= 150) return { label: "Sensitive", tone: "text-orange-400", dot: "bg-orange-400" };
  if (aqi <= 200) return { label: "Unhealthy", tone: "text-red-400", dot: "bg-red-400" };
  if (aqi <= 300) return { label: "Very unhealthy", tone: "text-purple-400", dot: "bg-purple-400" };
  return { label: "Hazardous", tone: "text-rose-500", dot: "bg-rose-500" };
}

export default function CurrentWeather({
  location, current, today, unit, theme, timeFormat, localTimeLabel, favoriteActive, onToggleFavorite,
}) {
  const info = getWeatherInfo(current?.weatherCode);
  const unitSymbol = unit === "fahrenheit" ? "F" : "C";
  const isDay = current?.isDay !== false;
  const isDarkTheme = theme === "dark";
  const atmosphere = getAtmosphere(current?.weatherCode ?? 3, isDay, isDarkTheme);
  const airQuality = getAirQualityLevel(current?.airQuality?.usAqi);
  const heroColors = isDarkTheme
    ? { "--hero-text": "#ffffff", "--hero-muted": "rgba(255,255,255,.65)", "--hero-faint": "rgba(255,255,255,.55)", "--hero-panel": "rgba(0,0,0,.20)", "--hero-panel-soft": "rgba(255,255,255,.10)", "--hero-panel-hover": "rgba(255,255,255,.15)", "--hero-border": "rgba(255,255,255,.15)", "--hero-warm": "#fcd34d", "--hero-cool": "#7dd3fc" }
    : { "--hero-text": "#0f172a", "--hero-muted": "#526176", "--hero-faint": "#64748b", "--hero-panel": "rgba(255,255,255,.58)", "--hero-panel-soft": "rgba(255,255,255,.54)", "--hero-panel-hover": "rgba(255,255,255,.78)", "--hero-border": "rgba(71,85,105,.16)", "--hero-warm": "#d97706", "--hero-cool": "#0284c7" };

  return (
    <section className="current-weather-card card reveal relative overflow-hidden border-[var(--hero-border)] text-[var(--hero-text)]" aria-labelledby="current-weather-title" style={{ background: atmosphere.background, ...heroColors }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(650px 280px at 85% 10%, ${atmosphere.glow}, transparent 66%), radial-gradient(520px 260px at 6% 105%, ${atmosphere.accent}, transparent 65%)` }} />
      {atmosphere.stars && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 16% 22%, white 0 1px, transparent 1.5px), radial-gradient(circle at 74% 17%, white 0 1px, transparent 1.5px), radial-gradient(circle at 88% 64%, white 0 1px, transparent 1.5px), radial-gradient(circle at 48% 42%, white 0 1px, transparent 1.5px)" }} />}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-12 opacity-[0.09]"><WeatherIcon code={current?.weatherCode} isDay={isDay} animate className="h-72 w-72" label={info.description} /></div>
      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${isDarkTheme ? "from-black/30" : "from-blue-900/5"} to-transparent`} />

      <div className="current-weather-content relative flex h-full flex-col p-6 lg:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="current-weather-title" className="current-weather-location font-display truncate text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{location.name}</h2>
            <p className="mt-0.5 text-sm text-[var(--hero-muted)]">{[location.admin1, location.country].filter(Boolean).join(", ") || "—"}</p>
          </div>
          <button type="button" onClick={onToggleFavorite} aria-pressed={favoriteActive} className="current-weather-favorite inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--hero-border)] bg-[var(--hero-panel-soft)] px-2.5 text-[11px] font-semibold text-[var(--hero-text)] shadow-lg shadow-black/10 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[var(--hero-panel-hover)]" title={favoriteActive ? "Remove from favorites" : "Save to favorites"}>
            <Star className={`h-3.5 w-3.5 ${favoriteActive ? "text-[var(--hero-warm)]" : "text-[var(--hero-muted)]"}`} fill={favoriteActive ? "currentColor" : "none"} aria-hidden="true" />
            {favoriteActive ? "Saved to Favorites" : "Save to Favorites"}
          </button>
        </div>

        <p className="current-weather-meta mt-2 flex items-center gap-1.5 text-xs text-[var(--hero-faint)]">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Local time: {localTimeLabel}
          {current?.time && <span> · Updated at {formatWeatherTime(current.time, timeFormat)} local</span>}
        </p>

        <div className="current-weather-reading mt-5 flex flex-1 flex-wrap items-center gap-5 lg:gap-7">
          <WeatherIcon code={current?.weatherCode} isDay={isDay} animate className="current-weather-icon h-20 w-20 shrink-0 sm:h-24 sm:w-24" label={info.description} />
          <div className="min-w-[150px]">
            <p className="current-weather-temperature font-display text-7xl font-extrabold leading-[0.85] tracking-[-0.07em] sm:text-8xl">
              {formatTemperature(current?.temperature, unit)}<span className="ml-1 align-top text-2xl font-semibold tracking-normal text-[var(--hero-muted)]">{unitSymbol}</span>
            </p>
            <p className="current-weather-condition mt-3 text-xl font-semibold leading-none">{info.description}</p>
            <p className="mt-1 text-sm text-[var(--hero-muted)]">Feels like <span className="font-semibold text-[var(--hero-cool)]">{formatTemperature(current?.feelsLike, unit)}</span></p>
          </div>

          {(today?.maxTemperature != null || today?.minTemperature != null) && (
            <div className="current-weather-range ml-auto flex gap-2 self-center">
              {today?.maxTemperature != null && <span className="current-weather-range-chip flex items-center gap-1.5 rounded-xl border border-[var(--hero-border)] bg-[var(--hero-panel)] px-3 py-2 text-xs font-semibold backdrop-blur-sm"><ArrowUp className="h-3.5 w-3.5 text-[var(--hero-warm)]" aria-hidden="true" /><span className="text-[var(--hero-muted)]">H</span> {formatTemperature(today.maxTemperature, unit)}</span>}
              {today?.minTemperature != null && <span className="current-weather-range-chip flex items-center gap-1.5 rounded-xl border border-[var(--hero-border)] bg-[var(--hero-panel)] px-3 py-2 text-xs font-semibold backdrop-blur-sm"><ArrowDown className="h-3.5 w-3.5 text-[var(--hero-cool)]" aria-hidden="true" /><span className="text-[var(--hero-muted)]">L</span> {formatTemperature(today.minTemperature, unit)}</span>}
            </div>
          )}
        </div>

        <div className="current-weather-chips mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--hero-border)] bg-[var(--hero-panel)] px-3 py-2 text-xs font-semibold text-[var(--hero-text)] backdrop-blur-sm"><Wind className="h-3.5 w-3.5 text-[var(--hero-cool)]" aria-hidden="true" /> {formatWindSpeed(current?.windSpeed, "kmh")} {current?.windDirectionLabel}</span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--hero-border)] bg-[var(--hero-panel)] px-3 py-2 text-xs font-semibold text-[var(--hero-text)] backdrop-blur-sm"><Droplets className="h-3.5 w-3.5 text-[var(--hero-cool)]" aria-hidden="true" /> {current?.humidity != null ? `${current.humidity}%` : "—"}</span>
          {current?.pressure != null && <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--hero-border)] bg-[var(--hero-panel)] px-3 py-2 text-xs font-semibold text-[var(--hero-text)] backdrop-blur-sm"><Gauge className="h-3.5 w-3.5 text-[var(--hero-muted)]" aria-hidden="true" /> {Math.round(current.pressure)} hPa</span>}
          {airQuality && (
            <span className="ml-auto inline-flex items-center gap-2 rounded-xl border border-[var(--hero-border)] bg-[var(--hero-panel)] px-3 py-2 text-xs font-semibold text-[var(--hero-text)] backdrop-blur-sm" title={current.airQuality.pm2_5 != null ? `PM2.5: ${Math.round(current.airQuality.pm2_5)} μg/m³` : "U.S. Air Quality Index"}>
              <Leaf className={`h-3.5 w-3.5 ${airQuality.tone}`} aria-hidden="true" />
              <span className="text-[var(--hero-muted)]">Air quality</span>
              <span className={`h-1.5 w-1.5 rounded-full ${airQuality.dot}`} aria-hidden="true" />
              <strong className={airQuality.tone}>{Math.round(current.airQuality.usAqi)} · {airQuality.label}</strong>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
