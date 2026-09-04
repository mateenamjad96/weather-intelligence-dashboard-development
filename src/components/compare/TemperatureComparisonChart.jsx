import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartNoAxesCombined } from "lucide-react";
import { convertTemperature } from "../../utils/temperature";

function next24Hours(hourly, currentTime) {
  if (!Array.isArray(hourly) || hourly.length === 0) return [];
  const prefix = currentTime?.slice(0, 13);
  const currentIndex = prefix ? hourly.findIndex((hour) => hour.time?.startsWith(prefix)) : -1;
  return hourly.slice(Math.max(0, currentIndex), Math.max(0, currentIndex) + 24);
}

export default function TemperatureComparisonChart({ cityA, cityB, weatherA, weatherB, unit }) {
  const hoursA = next24Hours(weatherA.hourly, weatherA.current?.time);
  const hoursB = next24Hours(weatherB.hourly, weatherB.current?.time);
  const pointCount = Math.min(24, Math.max(hoursA.length, hoursB.length));
  const unitLabel = unit === "fahrenheit" ? "°F" : "°C";
  const data = Array.from({ length: pointCount }, (_, index) => ({
    hour: index,
    label: index === 0 ? "Now" : `+${index}h`,
    cityA: convertTemperature(hoursA[index]?.temperature, unit),
    cityB: convertTemperature(hoursB[index]?.temperature, unit),
  }));

  return (
    <section className="card min-w-0 p-5" aria-labelledby="temperature-comparison-title">
      <div className="flex items-start gap-2">
        <ChartNoAxesCombined className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
        <div>
          <h2 id="temperature-comparison-title" className="font-display text-base font-semibold">24-Hour Temperature Comparison</h2>
          <p className="text-dim mt-0.5 text-xs">Next 24 hours from each city’s current local hour.</p>
        </div>
      </div>

      <div className="mt-4 h-64 min-w-0" role="img" aria-label={`Line chart comparing ${cityA.name} and ${cityB.name} temperatures for the next 24 hours`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="var(--subtle-border)" strokeDasharray="4 5" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickFormatter={(value) => `${Math.round(value)}°`} tickLine={false} axisLine={false} width={44} />
            <Tooltip
              formatter={(value, name) => [`${Math.round(value)}${unitLabel}`, name]}
              contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", color: "var(--text-primary)" }}
              labelStyle={{ color: "var(--text-secondary)" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "var(--text-secondary)" }} />
            <Line type="monotone" dataKey="cityA" name={cityA.name} stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} connectNulls isAnimationActive={false} />
            <Line type="monotone" dataKey="cityB" name={cityB.name} stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} connectNulls isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
