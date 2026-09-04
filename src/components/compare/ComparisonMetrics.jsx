import { ArrowUp, CloudRain, Droplets, Sun, Thermometer, ThermometerSun, Wind } from "lucide-react";
import { formatPrecipitation, formatTemperature, formatWindSpeed } from "../../utils/temperature";

function formatUv(value) {
  return typeof value === "number" ? String(Math.round(value * 10) / 10) : "—";
}

function MetricValue({ rawValue, formattedValue, otherValue, cityName, metric }) {
  const isHigher = typeof rawValue === "number" && typeof otherValue === "number" && rawValue > otherValue;
  return (
    <span className={`inline-flex items-center justify-center gap-1 ${isHigher ? "font-semibold text-blue-400" : ""}`}>
      {formattedValue}
      {isHigher && (
        <ArrowUp className="h-3 w-3" aria-label={`${cityName} has the higher ${metric.toLowerCase()} value`} />
      )}
    </span>
  );
}

export default function ComparisonMetrics({ cityA, cityB, weatherA, weatherB, unit, windUnit }) {
  const a = weatherA.current;
  const b = weatherB.current;
  const metrics = [
    { label: "Temperature", icon: Thermometer, a: a?.temperature, b: b?.temperature, format: (value) => formatTemperature(value, unit) },
    { label: "Feels Like", icon: ThermometerSun, a: a?.feelsLike, b: b?.feelsLike, format: (value) => formatTemperature(value, unit) },
    { label: "Humidity", icon: Droplets, a: a?.humidity, b: b?.humidity, format: (value) => typeof value === "number" ? `${value}%` : "—" },
    { label: "Wind Speed", icon: Wind, a: a?.windSpeed, b: b?.windSpeed, format: (value) => formatWindSpeed(value, windUnit) },
    { label: "Precipitation", icon: CloudRain, a: a?.precipitation, b: b?.precipitation, format: formatPrecipitation },
    { label: "UV Index", icon: Sun, a: a?.uvIndex, b: b?.uvIndex, format: formatUv },
  ];

  return (
    <section className="card p-5" aria-labelledby="comparison-metrics-title">
      <h2 id="comparison-metrics-title" className="font-display text-base font-semibold">At a glance</h2>
      <p className="text-dim mt-0.5 text-xs">Higher values are highlighted for comparison, not ranked as better.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--text-secondary)]">
              <th className="w-2/5 pb-2 font-medium">Metric</th>
              <th className="pb-2 text-center font-semibold"><span className="block truncate">{cityA.name}</span></th>
              <th className="pb-2 text-center font-semibold"><span className="block truncate">{cityB.name}</span></th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <tr key={metric.label} className="border-t border-[var(--subtle-border)]">
                  <th scope="row" className="py-2.5 pr-2 text-left text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-blue-400" aria-hidden="true" />
                      {metric.label}
                    </span>
                  </th>
                  <td className="py-2.5 text-center text-xs">
                    <MetricValue rawValue={metric.a} otherValue={metric.b} formattedValue={metric.format(metric.a)} cityName={cityA.name} metric={metric.label} />
                  </td>
                  <td className="py-2.5 text-center text-xs">
                    <MetricValue rawValue={metric.b} otherValue={metric.a} formattedValue={metric.format(metric.b)} cityName={cityB.name} metric={metric.label} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
