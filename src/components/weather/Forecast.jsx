import { CalendarDays } from "lucide-react";
import EmptyState from "../common/EmptyState";
import ForecastCard from "./ForecastCard";
import ForecastControls from "./ForecastControls";

export default function Forecast({ days, totalCount, unit, windUnit, timeFormat, onResetFilter, controlProps }) {
  return (
    <section className="card reveal p-5" aria-labelledby="forecast-title" style={{ animationDelay: "160ms" }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 id="forecast-title" className="font-display flex items-center gap-2 text-base font-semibold">
          <CalendarDays className="text-accent-soft h-4 w-4" aria-hidden="true" />
          7-Day Forecast
          <span className="text-dim text-xs font-medium">
            showing {days.length} of {totalCount} days
          </span>
        </h3>
      </div>

      <ForecastControls {...controlProps} />

      {days.length === 0 ? (
        <EmptyState
          className="mt-4 border-dashed"
          icon={CalendarDays}
          title="No days match this filter"
          message="The current filter hides every day of this forecast. Adjust the threshold or reset the filter."
          actionLabel="Reset filter"
          onAction={onResetFilter}
        />
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {days.map((day, index) => (
            <li key={day.id}>
              <ForecastCard day={day} index={index} unit={unit} windUnit={windUnit} timeFormat={timeFormat} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
