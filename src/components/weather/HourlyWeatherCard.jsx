import { Droplets } from "lucide-react";
import { formatWeatherTime } from "../../utils/dateUtils";
import { formatTemperature } from "../../utils/temperature";
import WeatherIcon from "./WeatherIcon";

export default function HourlyWeatherCard({ hour, unit, timeFormat, isNow }) {
  const rainChance = hour.precipitationProbability ?? 0;
  return (
    <li
      className={`min-w-[96px] shrink-0 rounded-xl border p-3 text-center transition hover:-translate-y-0.5 ${
        isNow
          ? "border-[var(--color-accent)] bg-[rgba(59,130,246,0.14)]"
          : "border-[var(--card-border)] bg-[var(--chip-bg)]"
      }`}
    >
      <p className={`text-xs font-semibold ${isNow ? "text-accent-soft" : "text-dim"}`}>
        {isNow ? "Now" : formatWeatherTime(hour.time, timeFormat)}
      </p>
      <WeatherIcon code={hour.weatherCode} className="mx-auto my-2 h-6 w-6" />
      <p className="font-display text-base font-semibold">{formatTemperature(hour.temperature, unit)}</p>
      <p className="text-dim text-[11px]">Feels {formatTemperature(hour.feelsLike, unit)}</p>
      <p className={`mt-1 flex items-center justify-center gap-1 text-[11px] font-semibold ${rainChance > 0 ? "text-rain" : "text-dim"}`}>
        {rainChance > 0 ? (
          <>
            <Droplets className="h-3 w-3" aria-hidden="true" />
            {rainChance}%
          </>
        ) : (
          "No rain"
        )}
      </p>
    </li>
  );
}
