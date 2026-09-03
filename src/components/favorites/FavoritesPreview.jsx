import { ArrowRight, Clock, Star } from "lucide-react";
import { formatWeatherTime } from "../../utils/dateUtils";
import { formatTemperature, formatWindSpeed } from "../../utils/temperature";
import { getWeatherInfo } from "../../utils/weatherCodes";
import WeatherIcon from "../weather/WeatherIcon";

export default function FavoritesPreview({ favorites, weatherById, onOpen }) {
  return (
    <section className="card p-5" aria-labelledby="fav-preview-title">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 id="fav-preview-title" className="font-display text-base font-semibold flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-300" fill="currentColor" aria-hidden="true" /> Favorites
        </h3>
        <a href="#/favorites" onClick={(e) => { e.preventDefault(); onOpen({ id: "view-all" }); }} className="text-xs font-bold text-blue-300 hover:text-blue-200">View all →</a>
      </div>
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
                  <Star className="h-3.5 w-3.5 text-amber-300 shrink-0" fill="currentColor" aria-hidden="true" />
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
    </section>
  );
}
