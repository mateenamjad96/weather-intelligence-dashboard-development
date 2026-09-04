import { ArrowRight, Clock, MapPin } from "lucide-react";
import { formatWeatherTime } from "../../utils/dateUtils";
import { formatTemperature, formatWindSpeed } from "../../utils/temperature";
import { getWeatherInfo } from "../../utils/weatherCodes";
import WeatherIcon from "../weather/WeatherIcon";

export default function FavoritesPreview({ favorites, weatherById, onOpen }) {
  return (
    <div className="card p-5">
      {favorites.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">Save a location to see it here.</p>
      ) : (
        <ul className="space-y-1.5">
          {favorites.slice(0,3).map((favorite) => {
            const w = weatherById?.[favorite.id] ?? null;
            const info = w ? getWeatherInfo(w.weather_code ?? 0) : null;
            return (
              <li key={favorite.id}>
                <button type="button" onClick={() => onOpen(favorite)} className="hover:bg-[var(--control-hover-bg)] w-full text-left rounded-xl border border-transparent hover:border-[var(--control-hover-border)] px-3 py-2.5 transition flex items-center gap-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{favorite.name}</span>
                    <span className="text-[var(--text-secondary)] block truncate text-xs">{[favorite.admin1, favorite.country].filter(Boolean).join(", ") || "—"}</span>
                  </span>
                  {w && (
                    <span className="flex items-center gap-2 text-right shrink-0">
                      <WeatherIcon code={w.weather_code ?? 0} isDay={w.is_day !== 0} className="h-5 w-5" />
                      <span className="text-sm font-bold">{formatTemperature(w.temperature_2m, "celsius")}</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">{formatWindSpeed(w.wind_speed_10m, "kmh")}</span>
                    </span>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
