import { useEffect, useState } from "react";
import { LocateFixed, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/WeatherContext";
import { reverseGeocodeLocation } from "../../services/weatherService";
import { Spinner } from "../common/Loading";
import SegmentedControl from "../common/SegmentedControl";
import SearchField from "../search/SearchField";

export default function Header() {
  const { selectLocation, temperatureUnit, setTemperatureUnit, theme, setTheme } = useAppContext();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!locationError) return undefined;
    const timeoutId = window.setTimeout(() => setLocationError(null), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [locationError]);

  const handleSelectLocation = (location) => { selectLocation(location); navigate("/weather"); };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location access is not supported by this browser.");
      return;
    }

    setLocating(true);
    setLocationError(null);

    const acceptPosition = async ({ coords }) => {
      const { latitude, longitude } = coords;
      let locationName = "My location";

      try {
        const resolvedLocation = await reverseGeocodeLocation(latitude, longitude);
        locationName = resolvedLocation.name;
      } catch {
        // The coordinates still work if the optional place-name lookup fails.
      }

      const accepted = selectLocation({
        id: `current:${latitude.toFixed(4)},${longitude.toFixed(4)}`,
        name: locationName,
        country: "",
        admin1: "Current position",
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
      });
      setLocating(false);
      setLocationError(null);
      if (accepted === false) {
        setLocationError("Your current location could not be used.");
        return;
      }
      navigate("/weather");
    };

    const showLocationError = (error) => {
      setLocating(false);
      if (error.code === error.PERMISSION_DENIED) {
        setLocationError("Location permission was denied. Enable it in your browser settings and try again.");
      } else if (error.code === error.TIMEOUT) {
        setLocationError("Finding your location took too long. Check your device location settings and try again.");
      } else {
        setLocationError("Location is unavailable. Turn on your device's location service and try again.");
      }
    };

    navigator.geolocation.getCurrentPosition(
      acceptPosition,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          showLocationError(error);
          return;
        }
        // Desktop computers often have no high-accuracy GPS provider. Retry
        // with Wi-Fi/network positioning before showing an error.
        navigator.geolocation.getCurrentPosition(
          acceptPosition,
          showLocationError,
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 900000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  };

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className={`header-bg sticky top-0 z-40 ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-2.5 gap-y-2 px-5 py-1.5 sm:px-7 lg:grid lg:grid-cols-[210px_minmax(0,1fr)_320px] lg:gap-x-4 lg:px-4">
        <div className="min-w-0 shrink-0 md:w-[175px] lg:w-auto">
          <p className="truncate text-[10px] font-medium leading-tight text-[var(--text-secondary)] xl:text-[11px]">{dateLabel}</p>
          <p className="mt-0.5 whitespace-nowrap text-sm font-bold leading-tight xl:text-base">{greeting}, Mateen</p>
        </div>

        <div className="order-3 w-full min-w-[240px] flex-1 md:order-2 md:w-auto md:min-w-[280px] lg:min-w-0 lg:max-w-[680px]">
          <SearchField onSelectLocation={handleSelectLocation} id="header-city-search" placeholder="Search city..." />
        </div>

        <div className="order-2 ml-auto flex shrink-0 items-center gap-1.5 md:order-3 lg:ml-0 lg:w-full lg:justify-between">
          <div className="flex items-center gap-1.5">
            <SegmentedControl className="navbar-unit-control" ariaLabel="Temperature unit" options={[{value:"celsius",label:"°C"},{value:"fahrenheit",label:"°F"}]} value={temperatureUnit} onChange={setTemperatureUnit} />
            <button
              type="button"
              className="btn btn-ghost h-9 whitespace-nowrap rounded-xl px-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              style={{ paddingInline: "0.25rem", fontSize: "0.75rem" }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-500" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
              <span className="hidden lg:inline">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>
          </div>
          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-xs font-semibold text-blue-500 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-wait disabled:opacity-60"
            onClick={handleUseMyLocation}
            disabled={locating}
            aria-label={locating ? "Finding your current location" : "Use my current location"}
            title={locating ? "Finding your location…" : "Use my current location"}
          >
            {locating ? <Spinner className="h-4 w-4" /> : <LocateFixed className="h-4 w-4" aria-hidden="true" />}
            <span>{locating ? "Finding location…" : "Use my location"}</span>
          </button>
        </div>
      </div>
      {locationError && (
        <div role="alert" className="card absolute right-4 top-[calc(100%+0.5rem)] max-w-sm px-4 py-3 text-xs text-[var(--text-primary)] shadow-xl">
          {locationError}
        </div>
      )}
    </header>
  );
}
