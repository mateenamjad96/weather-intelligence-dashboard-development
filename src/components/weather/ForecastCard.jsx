import { Droplets, Sunrise, Sunset, Wind } from "lucide-react";
import { formatWeatherDate, formatWeatherTime, getDayLabel } from "../../utils/dateUtils";
import { getWeatherDescription } from "../../utils/weatherCodes";
import { formatTemperature, formatWindSpeed } from "../../utils/temperature";
import WeatherIcon from "./WeatherIcon";

export default function ForecastCard({ day, index, unit, windUnit, timeFormat }) {
  const desc = getWeatherDescription(day.weatherCode);
  const isToday = index === 0;
  return (
    <article
      aria-current={isToday ? "date" : undefined}
      className={`card-interactive flex h-full flex-col gap-1.5 rounded-xl border p-4 ${
        isToday
          ? "border-blue-400/50 bg-blue-500/10 shadow-[0_12px_30px_-20px_rgba(59,130,246,0.75)]"
          : "border-[var(--card-border)] bg-[var(--subtle-bg)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-sm font-semibold">{getDayLabel(day.date, index)}</p>
          <p className="text-[var(--text-secondary)] text-xs">{formatWeatherDate(day.date, { month: "short", day: "numeric" })}</p>
        </div>
        <WeatherIcon code={day.weatherCode} className="h-10 w-10 drop-shadow-sm" label={desc} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold leading-none text-amber-300">{formatTemperature(day.maxTemperature, unit)}</span>
        <span className="text-rain text-lg font-semibold leading-none">{formatTemperature(day.minTemperature, unit)}</span>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
      <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[10px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5"><Droplets className="h-3 w-3 text-rain" aria-hidden="true" />{day.precipitation} mm{day.precipitationProbability != null ? ` · ${day.precipitationProbability}%` : ""}</div>
        <div className="flex items-center gap-1.5"><Wind className="h-3 w-3" aria-hidden="true" />{formatWindSpeed(day.maxWindSpeed, windUnit)}</div>
        <div className="flex items-center gap-1.5"><Sunrise className="h-3 w-3 text-amber-300" aria-hidden="true" />{formatWeatherTime(day.sunrise, timeFormat)}</div>
        <div className="flex items-center gap-1.5"><Sunset className="h-3 w-3 text-orange-400" aria-hidden="true" />{formatWeatherTime(day.sunset, timeFormat)}</div>
      </dl>
    </article>
  );
}
