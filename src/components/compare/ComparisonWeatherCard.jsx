import { CloudRain, Droplets, MapPin, Sun, ThermometerSun, Wind } from "lucide-react";
import { getWeatherInfo } from "../../utils/weatherCodes";
import { formatPrecipitation, formatTemperature, formatWindSpeed } from "../../utils/temperature";
import WeatherIcon from "../weather/WeatherIcon";

function Detail({ icon: Icon, label, value, tone = "text-blue-400" }) {
  return (
    <div className="rounded-xl border border-[var(--subtle-border)] bg-[var(--chip-bg)] p-3">
      <dt className="label-xs flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${tone}`} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}

export default function ComparisonWeatherCard({ location, weather, unit, windUnit }) {
  const current = weather?.current;
  const info = getWeatherInfo(current?.weatherCode);
  const region = [location.admin1, location.country].filter(Boolean).join(", ");
  const uv = typeof current?.uvIndex === "number" ? Math.round(current.uvIndex * 10) / 10 : "—";

  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display truncate text-xl font-semibold">{location.name}</h2>
          <p className="text-dim mt-0.5 flex items-center gap-1.5 truncate text-xs">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" aria-hidden="true" />
            {region || "Location selected"}
          </p>
        </div>
        <WeatherIcon code={current?.weatherCode} isDay={current?.isDay !== false} className="h-16 w-16 shrink-0" label={info.description} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-5xl font-bold tracking-tight">{formatTemperature(current?.temperature, unit)}</p>
          <p className="mt-1 text-sm font-semibold">{info.description}</p>
        </div>
        <p className="text-dim text-right text-xs">
          Feels like
          <strong className="block text-base text-[var(--text-primary)]">{formatTemperature(current?.feelsLike, unit)}</strong>
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Detail icon={ThermometerSun} label="Feels like" value={formatTemperature(current?.feelsLike, unit)} />
        <Detail icon={Droplets} label="Humidity" value={current?.humidity != null ? `${current.humidity}%` : "—"} />
        <Detail icon={Wind} label="Wind speed" value={formatWindSpeed(current?.windSpeed, windUnit)} />
        <Detail icon={CloudRain} label="Precipitation" value={formatPrecipitation(current?.precipitation)} />
        <Detail icon={Sun} label="UV index" value={uv} tone="text-amber-400" />
      </dl>
    </article>
  );
}
