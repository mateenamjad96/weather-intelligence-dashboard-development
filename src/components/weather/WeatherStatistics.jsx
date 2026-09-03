import { useMemo } from "react";
import { BarChart3, CloudRain, Thermometer, ThermometerSnowflake, ThermometerSun, Umbrella, Wind } from "lucide-react";
import { formatTemperature, formatWindSpeed } from "../../utils/temperature";

export default function WeatherStatistics({ statistics, unit, windUnit }) {
  const tiles = useMemo(() => [
    { icon: ThermometerSun, label: "Highest Temp", value: formatTemperature(statistics.highestTemperature, unit), tone: "text-amber-300", bg: "rgba(245,158,11,0.12)" },
    { icon: ThermometerSnowflake, label: "Lowest Temp", value: formatTemperature(statistics.lowestTemperature, unit), tone: "text-rain", bg: "rgba(56,189,248,0.12)" },
    { icon: Thermometer, label: "Average Temp", value: formatTemperature(statistics.averageTemperature, unit), tone: "text-amber-200", bg: "rgba(245,158,11,0.10)" },
    { icon: CloudRain, label: "Total Precip", value: `${statistics.totalPrecipitation.toFixed(1)} mm`, tone: "text-rain", bg: "rgba(56,189,248,0.12)" },
    { icon: Wind, label: "Max Wind", value: formatWindSpeed(statistics.maximumWindSpeed, windUnit), tone: "text-blue-300", bg: "rgba(59,130,246,0.15)" },
    { icon: Umbrella, label: "Rainy Days", value: `${statistics.rainyDays}`, tone: "text-violet-300", bg: "rgba(139,92,246,0.14)" },
  ], [statistics, unit, windUnit]);

  return (
    <section className="card reveal p-5" aria-labelledby="statistics-title" style={{ animationDelay: "200ms" }}>
      <h3 id="statistics-title" className="font-display flex items-center gap-2 text-base font-semibold mb-1">
        <BarChart3 className="text-blue-300 h-4 w-4" aria-hidden="true" /> Weather Statistics
      </h3>
      <p className="text-[var(--text-secondary)] text-xs mb-4">Calculated from the 7-day forecast</p>
      <dl className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="rounded-xl border border-[var(--subtle-border)] bg-[var(--subtle-bg)] p-3.5 transition hover:-translate-y-0.5 hover:border-[var(--card-border-hover)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: t.bg }}>
                <Icon className={`h-4 w-4 ${t.tone}`} aria-hidden="true" />
              </span>
              <dt className="label-xs mt-2.5">{t.label}</dt>
              <dd className="font-display text-xl font-bold mt-0.5">{t.value}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
