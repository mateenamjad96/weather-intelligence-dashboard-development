import { Timer } from "lucide-react";
import { getDayLabel } from "../../utils/dateUtils";
import HourlyWeatherCard from "./HourlyWeatherCard";

export default function HourlyWeather({
  days, selectedDate, onDateChange, hours, unit, timeFormat, currentHourPrefix, isToday,
}) {
  return (
    <section className="card reveal p-5" aria-labelledby="hourly-forecast-title" style={{ animationDelay: "120ms" }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 id="hourly-forecast-title" className="font-display flex items-center gap-2 text-base font-semibold">
          <Timer className="text-blue-300 h-4 w-4" aria-hidden="true" /> Hourly Forecast
        </h3>
        <div className="seg scroll-slim max-w-full overflow-x-auto" role="group" aria-label="Forecast day">
          {days.map((day, idx) => (
            <button key={day.id} type="button" role="radio" aria-checked={day.date === selectedDate}
              onClick={() => onDateChange(day.date)} data-active={day.date === selectedDate}
              className="seg-btn shrink-0 text-xs">{getDayLabel(day.date, idx)}</button>
          ))}
        </div>
      </div>
      {hours.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] py-6 text-center">No hourly data available for this day.</p>
      ) : (
        <ul className="scroll-slim -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {hours.map((hour) => (
            <HourlyWeatherCard key={hour.time} hour={hour} unit={unit} timeFormat={timeFormat} isNow={isToday && hour.time.startsWith(currentHourPrefix)} />
          ))}
        </ul>
      )}
    </section>
  );
}
