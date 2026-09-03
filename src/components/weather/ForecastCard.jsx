import { Droplets, Sunrise, Sunset, Wind } from "lucide-react";
import { formatWeatherDate, formatWeatherTime, getDayLabel } from "../../utils/dateUtils";
import { getWeatherDescription } from "../../utils/weatherCodes";
import { formatTemperature, formatWindSpeed } from "../../utils/temperature";
import WeatherIcon from "./WeatherIcon";

export default function ForecastCard({ day, index, unit, windUnit, timeFormat }) {
  const desc = getWeatherDescription(day.weatherCode);
  return (
    <article className="card-interactive flex h-full flex-col gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--subtle-bg)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-sm font-semibold">{getDayLabel(day.date, index)}</p>
          <p className="text-[var(--text-secondary)] text-xs">{formatWeatherDate(day.date, { month: "short", day: "numeric" })}</p>
        </div>
        <WeatherIcon code={day.weatherCode} className="h-7 w-7" label={desc} />
      </div>
      <p className="text-[var(--text-secondary)] text-sm">{desc}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-amber-300">{formatTemperature(day.maxTemperature, unit)}</span>
        <span className="text-rain text-sm font-semibold">{formatTemperature(day.minTemperature, unit)}</span>
      </div>
      <dl className="mt-auto pt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-[var(--text-secondary)] border-t border-[var(--subtle-border)]">
        <div className="flex items-center gap-1.5"><Droplets className="h-3 w-3 text-rain" aria-hidden="true" />{day.precipitation} mm{day.precipitationProbability != null ? ` · ${day.precipitationProbability}%` : ""}</div>
        <div className="flex items-center gap-1.5"><Wind className="h-3 w-3" aria-hidden="true" />{formatWindSpeed(day.maxWindSpeed, windUnit)}</div>
        <div className="flex items-center gap-1.5"><Sunrise className="h-3 w-3 text-amber-300" aria-hidden="true" />{formatWeatherTime(day.sunrise, timeFormat)}</div>
        <div className="flex items-center gap-1.5"><Sunset className="h-3 w-3 text-orange-400" aria-hidden="true" />{formatWeatherTime(day.sunset, timeFormat)}</div>
      </dl>
    </article>
  );
}
