// Open-Meteo returns forecast times as strings that are already local to the
// location (timezone=auto), so we format those strings directly instead of
// converting them through the browser timezone.

function pad(value) {
  return String(value).padStart(2, "0");
}

export function formatWeatherDate(dateString, options = { weekday: "short", month: "short", day: "numeric" }) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatWeatherTime(isoTime, timeFormat = "12h") {
  if (!isoTime || !isoTime.includes("T")) return "—";
  const [rawHours, rawMinutes] = isoTime.split("T")[1]?.split(":") ?? [];
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "—";
  if (timeFormat === "24h") return `${pad(hours)}:${pad(minutes)}`;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${pad(minutes)} ${period}`;
}

export function isSameDay(hourIsoTime, dateString) {
  return typeof hourIsoTime === "string" && typeof dateString === "string" && hourIsoTime.startsWith(dateString);
}

export function getDayLabel(dateString, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return formatWeatherDate(dateString, { weekday: "long" });
}

// Live clock for the selected location. Falls back to the browser clock when
// the timezone is missing or unknown.
export function formatLocalTimeNow(timeZone, timeFormat = "12h") {
  const now = new Date();
  const options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: timeFormat !== "24h",
  };
  try {
    if (timeZone) return new Intl.DateTimeFormat("en-US", { ...options, timeZone }).format(now);
  } catch {
    // unknown timezone identifier -> fall through to browser time
  }
  return new Intl.DateTimeFormat("en-US", options).format(now);
}

export function formatRelativeMinutes(isoTimestamp) {
  if (!isoTimestamp) return "";
  const then = new Date(isoTimestamp).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 min ago";
  return `${minutes} min ago`;
}
