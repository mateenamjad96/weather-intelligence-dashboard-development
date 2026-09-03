import {
  Cloud, CloudRain, Navigation, Sun, Sunrise, Sunset, Thermometer, ThermometerSun,
} from "lucide-react";
import { formatWeatherTime } from "../../utils/dateUtils";
import { getUvLevel } from "../../utils/weatherCodes";
import { formatPrecipitation, formatTemperature } from "../../utils/temperature";

function getSunPosition(currentTime, sunrise, sunset) {
  const now = Date.parse(currentTime);
  const start = Date.parse(sunrise);
  const end = Date.parse(sunset);
  const rawProgress = Number.isFinite(now) && Number.isFinite(start) && Number.isFinite(end) && end > start
    ? (now - start) / (end - start)
    : 0;
  const progress = Math.min(1, Math.max(0, rawProgress));
  const inverse = 1 - progress;

  return {
    x: inverse * inverse * 14 + 2 * inverse * progress * 160 + progress * progress * 306,
    y: inverse * inverse * 45 + 2 * inverse * progress * -12 + progress * progress * 45,
  };
}

export default function WeatherDetails({ current, unit, timeFormat }) {
  const uv = getUvLevel(current?.uvIndex);
  const sunPosition = getSunPosition(current?.time, current?.sunrise, current?.sunset);
  const tiles = [
    { icon: Thermometer, label: "Temperature", value: formatTemperature(current?.temperature, unit) },
    { icon: ThermometerSun, label: "Feels Like", value: formatTemperature(current?.feelsLike, unit) },
    { icon: Navigation, label: "Wind Direction", value: current?.windDirectionLabel ?? "—" },
    { icon: CloudRain, label: "Precipitation", value: formatPrecipitation(current?.precipitation) },
    { icon: Sun, label: "UV Index", value: current?.uvIndex != null ? `${Math.round(current.uvIndex)} (${uv?.label ?? "—"})` : "—", valueClass: uv?.tone },
    { icon: Cloud, label: "Cloud Cover", value: current?.cloudCover != null ? `${current.cloudCover}%` : "—" },
  ];

  return (
    <section className="weather-details-card card reveal p-5" aria-labelledby="weather-details-title" style={{ animationDelay:"80ms" }}>
      <h3 id="weather-details-title" className="weather-details-title font-display mb-3 text-base font-semibold">Weather Details</h3>
      <div className="weather-details-grid grid grid-cols-2 gap-2">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div key={tile.label} className="weather-detail-tile flex min-h-[48px] items-center gap-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--subtle-bg)] px-3 py-2 transition hover:-translate-y-0.5 hover:border-[var(--card-border-hover)]">
              <Icon className="h-4 w-4 shrink-0 text-blue-500" strokeWidth={2} aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">{tile.label}</p>
                <p className={`mt-0.5 truncate text-sm font-bold leading-tight ${tile.valueClass ?? ""}`}>{tile.value}</p>
              </div>
            </div>
          );
        })}

        <div className="sun-cycle-panel relative col-span-2 flex min-h-[104px] flex-col overflow-hidden rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-300/20 via-orange-300/15 to-rose-300/20 px-3 pb-2 pt-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] dark:border-orange-300/20 dark:from-amber-400/10 dark:via-orange-400/10 dark:to-rose-400/10">
          <div aria-hidden="true" className="absolute left-1/2 top-0 h-14 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/25 blur-2xl" />
          <span className="sr-only">Sun path from sunrise to sunset</span>
          <svg className="sun-path-graph relative h-12 w-full text-slate-500/35 dark:text-slate-400/30" viewBox="0 -18 320 68" preserveAspectRatio="none" aria-hidden="true">
            <line x1="10" y1="45" x2="310" y2="45" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 5" />
            <path d="M 14 45 Q 160 -12 306 45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
            <g transform={`translate(${sunPosition.x} ${sunPosition.y})`}>
              <circle r="11" fill="#f59e0b" opacity="0.18" />
              <circle r="7" fill="#fbbf24" />
              <circle r="4" fill="#fde68a" opacity="0.75" />
            </g>
          </svg>

          <div className="relative mt-auto grid w-full grid-cols-2 gap-4 px-0.5">
            <div className="flex min-w-0 items-center gap-2">
              <Sunrise className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-300" strokeWidth={2.2} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200/80">Sunrise</p>
                <p className="truncate text-sm font-extrabold">{formatWeatherTime(current?.sunrise, timeFormat)}</p>
              </div>
            </div>
            <div className="flex min-w-0 items-center justify-end gap-2 text-right">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-200/80">Sunset</p>
                <p className="truncate text-sm font-extrabold">{formatWeatherTime(current?.sunset, timeFormat)}</p>
              </div>
              <Sunset className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-300" strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
