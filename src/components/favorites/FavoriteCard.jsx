import { ArrowRight, CloudRain, Droplets, Star, Trash2, Wind } from "lucide-react";
import { getWeatherDescription } from "../../utils/weatherCodes";
import { formatPrecipitation, formatTemperature, formatWindSpeed } from "../../utils/temperature";
import { Skeleton } from "../common/Loading";
import WeatherIcon from "../weather/WeatherIcon";

export default function FavoriteCard({ location, current, loading, unit, windUnit, updatedLabel, onOpen, onRemove }) {
  const unitSymbol = unit === "fahrenheit" ? "F" : "C";
  const region = [location.admin1, location.country].filter(Boolean).join(", ");

  return (
    <article className="card card-interactive relative h-full overflow-hidden">
      {current && (
        <div className="pointer-events-none absolute -right-5 -top-5 opacity-15">
          <WeatherIcon code={current.weather_code} isDay={current.is_day !== 0} className="h-28 w-28" />
        </div>
      )}
      <div className="relative flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display flex items-center gap-2 text-lg font-semibold">
              <span className="truncate">{location.name}</span>
              <Star className="h-4 w-4 shrink-0 text-amber-400" fill="currentColor" aria-label="Saved location" />
            </h3>
            <p className="text-dim truncate text-xs">{region || "—"}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          {loading ? (
            <>
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            </>
          ) : current ? (
            <>
              <WeatherIcon
                code={current.weather_code}
                isDay={current.is_day !== 0}
                className="h-12 w-12"
                label={getWeatherDescription(current.weather_code)}
              />
              <div>
                <p className="font-display text-4xl font-semibold">
                  {formatTemperature(current.temperature_2m, unit)}
                  <span className="text-dim text-lg font-medium">{unitSymbol}</span>
                </p>
                <p className="text-dim text-sm">{getWeatherDescription(current.weather_code)}</p>
              </div>
            </>
          ) : (
            <p className="text-dim text-sm">Current conditions unavailable right now.</p>
          )}
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--card-border)] pt-3">
          <div>
            <dt className="label-xs">Humidity</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
              <Droplets className="text-rain h-3.5 w-3.5" aria-hidden="true" />
              {current?.relative_humidity_2m != null ? `${current.relative_humidity_2m}%` : "—"}
            </dd>
          </div>
          <div>
            <dt className="label-xs">Wind</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
              <Wind className="text-rain h-3.5 w-3.5" aria-hidden="true" />
              {formatWindSpeed(current?.wind_speed_10m, windUnit)}
            </dd>
          </div>
          <div>
            <dt className="label-xs">Precip</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
              <CloudRain className="text-rain h-3.5 w-3.5" aria-hidden="true" />
              {formatPrecipitation(current?.precipitation)}
            </dd>
          </div>
        </dl>

        {updatedLabel && !loading && (
          <p className="text-dim mt-3 flex items-center gap-1.5 text-[11px]">
            <span className="bg-accent inline-block h-1.5 w-1.5 rounded-full" aria-hidden="true" />
            {updatedLabel}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button type="button" className="btn btn-ghost h-9 flex-1" onClick={() => onOpen(location)}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Open
          </button>
          <button
            type="button"
            className="btn btn-ghost h-9 px-3"
            onClick={() => onRemove(location.id)}
            aria-label={`Remove ${location.name} from favorites`}
            title="Remove from favorites"
          >
            <Trash2 className="h-4 w-4 text-rose-400" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
