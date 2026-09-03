import { FILTER_OPTIONS, SORT_OPTIONS } from "../../utils/forecastFilters";
import { convertTemperature, toCelsius, convertWindSpeed, toKmh } from "../../utils/temperature";

function ThresholdInput({ id, label, value, onValueChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="label-xs">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min="0"
        max="70"
        step="1"
        className="input h-9 w-24 py-0 text-xs"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </div>
  );
}

export default function ForecastControls({
  activeFilter,
  onFilterChange,
  sortOption,
  onSortChange,
  hotThresholdC,
  windThresholdKmh,
  onHotThresholdChange,
  onWindThresholdChange,
  unit,
  windUnit,
}) {
  const handleHotInput = (raw) => {
    if (raw === "") return onHotThresholdChange(30);
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 0) onHotThresholdChange(toCelsius(parsed, unit));
  };

  const handleWindInput = (raw) => {
    if (raw === "") return onWindThresholdChange(20);
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 0) onWindThresholdChange(toKmh(parsed, windUnit));
  };

  return (
    <div className="flex flex-wrap items-end gap-x-5 gap-y-3 rounded-xl border border-[var(--card-border)] bg-[var(--chip-bg)] p-3">
      <fieldset>
        <legend className="label-xs mb-2">Filter days</legend>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map((option) => {
            const active = activeFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onFilterChange(option.id)}
                className={`h-8 rounded-lg border px-3 text-xs font-semibold transition ${
                  active
                    ? "border-transparent bg-accent text-white shadow-md shadow-blue-500/30"
                    : "text-dim border-[var(--card-border)] hover:text-[var(--text-primary)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {activeFilter === "hot" && (
        <ThresholdInput
          id="hot-threshold"
          label={`Min high temp (°${unit === "fahrenheit" ? "F" : "C"})`}
          value={Math.round(convertTemperature(hotThresholdC, unit))}
          onValueChange={handleHotInput}
        />
      )}
      {activeFilter === "windy" && (
        <ThresholdInput
          id="wind-threshold"
          label={`Min wind (${windUnit === "mph" ? "mph" : "km/h"})`}
          value={Math.round(convertWindSpeed(windThresholdKmh, windUnit))}
          onValueChange={handleWindInput}
        />
      )}

      <div className="ml-auto flex items-end gap-2">
        <label htmlFor="forecast-sort" className="label-xs pb-2">
          Sort by
        </label>
        <select
          id="forecast-sort"
          className="input h-9 w-auto min-w-[170px] py-0 text-xs"
          value={sortOption}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
