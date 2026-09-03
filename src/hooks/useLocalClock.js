import { useEffect, useState } from "react";
import { formatLocalTimeNow } from "../utils/dateUtils";

// Ticking label such as "Mon, Aug 18, 11:35 AM" for the location timezone.
export function useLocalClock(timeZone, timeFormat = "12h") {
  const [label, setLabel] = useState(() => formatLocalTimeNow(timeZone, timeFormat));

  useEffect(() => {
    setLabel(formatLocalTimeNow(timeZone, timeFormat));
    const intervalId = setInterval(() => {
      setLabel(formatLocalTimeNow(timeZone, timeFormat));
    }, 30 * 1000);
    return () => clearInterval(intervalId);
  }, [timeZone, timeFormat]);

  return label;
}
