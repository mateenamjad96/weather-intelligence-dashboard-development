import { useEffect, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/WeatherContext";
import SegmentedControl from "../common/SegmentedControl";
import SearchField from "../search/SearchField";

export default function Header() {
  const { selectLocation, temperatureUnit, setTemperatureUnit, theme, setTheme } = useAppContext();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [now, setNow] = useState(() => new Date());

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

  const handleSelectLocation = (location) => { selectLocation(location); navigate("/weather"); };

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
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-2.5 gap-y-2 px-5 py-1.5 sm:px-7 lg:flex-nowrap lg:px-4">
        <div className="min-w-0 shrink-0 md:w-[210px] lg:w-[230px] xl:w-[260px]">
          <p className="truncate text-[10px] font-medium leading-tight text-[var(--text-secondary)] xl:text-[11px]">{dateLabel}</p>
          <p className="mt-0.5 truncate text-sm font-bold leading-tight xl:text-base">{greeting}, Mateen</p>
        </div>

        <div className="order-3 w-full min-w-[240px] flex-1 md:order-2 md:w-auto md:min-w-[280px]">
          <SearchField onSelectLocation={handleSelectLocation} id="header-city-search" placeholder="Search city..." />
        </div>

        <div className="order-2 ml-auto flex shrink-0 items-center gap-1.5 md:order-3">
          <SegmentedControl className="navbar-unit-control" ariaLabel="Temperature unit" options={[{value:"celsius",label:"°C"},{value:"fahrenheit",label:"°F"}]} value={temperatureUnit} onChange={setTemperatureUnit} />
          <button
            type="button"
            className="btn btn-ghost h-9 w-9 rounded-xl p-0"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />}
          </button>
          <button type="button" className="btn btn-ghost relative h-9 w-9 rounded-xl p-0" aria-label="Notifications (demo)" title="Notifications (demo)">
            <span className="relative">
              <Bell className="h-4 w-4 text-blue-500" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-[var(--header-bg)] bg-rose-500" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
