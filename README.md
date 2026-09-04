# SkyPulse

A frontend-only weather application built with **React (JavaScript) + Vite + React Router + Tailwind CSS**.
It shows current conditions, hourly forecasts and a 7-day forecast for any city, with favorites,
search history, filtering, sorting, statistics, dark/light themes and Celsius/Fahrenheit units.
All weather data comes live from the free **Open-Meteo** APIs.

---

## Features

- **Location search** (Open-Meteo Geocoding) with controlled input, submit + debounced suggestions,
  loading / error / empty states, stale-request cancellation (`AbortController`) and result selection.
- **URL location state**: `/weather?lat=31.5204&lon=74.3587` or `/weather?city=Lahore` loads that location;
  invalid links show friendly feedback without breaking the app. The URL is kept shareable on selection.
- **Current weather hero**: temperature, feels-like, condition, icon, high/low, wind, humidity,
  pressure, local time of the location and last-updated time.
- **Weather details**: temperature, feels-like, humidity, wind speed + direction, precipitation,
  UV index (with level), sunrise, sunset, cloud cover — missing fields render as `—`, never crash.
- **Hourly forecast** with day selection (Today / Tomorrow / …), horizontal scroll and "Now" highlight.
- **7-day forecast** cards with day name (via `Intl`), min/max, condition, precipitation, wind, sunrise/sunset.
- **Filtering** (All / Rainy / High Temperature / With Precipitation / Strong Wind, with editable
  thresholds) and **sorting** (default, hottest, coldest, windiest, wettest) — both derived, never stored.
- **Statistics** computed with `map/filter/reduce/Math.*`: highest, lowest, average temperature,
  total precipitation, maximum wind, rainy-day count.
- **Favorites**: add / remove / duplicate prevention / persistence / open-as-active-location,
  plus live current conditions per card (one lightweight request each, in parallel).
- **Search history**: latest 5, de-duplicated, persisted, selectable, clearable — kept separate from favorites.
- **Settings page** with a real controlled form: theme, temperature unit, forecast display preference,
  wind unit, time format, auto refresh, remember-last-location — with validation, save and reset.
- **Dark & light themes** and **°C / °F** switching applied app-wide instantly and persisted.
- **LocalStorage persistence** through a safe `useLocalStorage` hook (corrupted JSON falls back).
- Responsive (1920 → 390px), accessible (semantic HTML, labels, focus states, keyboard friendly).

## Technology Stack

| Layer      | Choice                                    |
| ---------- | ----------------------------------------- |
| UI         | React 19 (JavaScript, function components) |
| Build      | Vite                                       |
| Routing    | React Router (`HashRouter` for static hosting) |
| Styling    | Tailwind CSS v4 + small CSS design tokens  |
| Icons      | lucide-react                               |
| Data       | Open-Meteo Geocoding + Forecast APIs (`fetch`) |
| State      | React Context + hooks + LocalStorage       |

No backend, no database, no Redux, no TypeScript.

## Installation

```bash
npm install
```

## How to Run

```bash
npm run dev      # development server
npm run build    # production build (dist/)
npm run preview  # preview the production build
```

## API Information

- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search?name=<query>&count=5&format=json`
- **Forecast**: `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=..&hourly=..&daily=..&timezone=auto&forecast_days=7`

No API key is required. All URL construction lives in `src/services/weatherService.js`.

## Folder Structure

```
src/
  components/
    common/      Loading, ErrorMessage, EmptyState, SegmentedControl, ToggleSwitch
    layout/      AppLayout, Sidebar, Header
    search/      SearchField, SearchBar, SearchResults, LocationCard, RecentSearches
    weather/     CurrentWeather, WeatherDetails, HourlyWeather(+Card), Forecast(+Card),
                 ForecastControls, WeatherStatistics, WeatherIcon
    favorites/   FavoriteCard, FavoritesList
    settings/    SettingsForm
  context/       WeatherContext.jsx (shared app state + provider)
  hooks/         useLocalStorage, useWeather, useLocationSearch, useLocalClock
  pages/         DashboardPage, FavoritesPage, SettingsPage
  services/      weatherService.js (all fetch calls + URL building)
  utils/         temperature, dateUtils, weatherCodes, weatherTransformers,
                 weatherStatistics, forecastFilters, settings
  App.jsx        router + provider
  main.jsx       entry point
```

## Architecture Explanation

Data flows in one direction:

`Page → custom hook (useWeather) → service (weatherService) → Open-Meteo → transformers (utils) → React state → components`.

- **Services** own URLs and response validation; components never build API URLs.
- **Transformers** convert Open-Meteo parallel arrays into plain objects (`{ time, temperature, … }`).
- **Pages** own page-level state (filters, sort, selected forecast day) and pass props down.
- **Children** communicate up through callback props (`onSelect`, `onRemove`, `onFilterChange`, …).
- **Context** only holds genuinely shared state: selected location, theme, unit, favorites,
  history, settings. Search input and filters stay local.

See `ARCHITECTURE.md` for the flow diagram.

## State Management Explanation

- **State**: `selectedLocation`, `theme`, `temperatureUnit`, `favorites`, `searchHistory`,
  `settings` (Context, persisted); `weather/loading/error` (useWeather); `query/results/…`
  (useLocationSearch); `activeFilter`, `sortOption`, `selectedForecastDay`, thresholds, form draft (pages).
- **Derived (never state)**: filtered/sorted forecast, statistics, converted temperatures,
  `isFavorite`, hourly slice for the selected day, dirty-check in settings.
- **useEffect** is used only for synchronization: fetching on location change, auto refresh
  interval, theme class on `<html>`, LocalStorage writes, URL sync, ticking clock.
- **useMemo** is used for the forecast filter/sort pipeline and statistics (recomputed only when
  their inputs change). **useCallback** is used for callbacks passed into memo-sensitive children
  (e.g. `handleSelectLocation`, `reload`).
- State is never mutated: favorites/history use spread + filter; sorting always copies first.

## Custom Hooks Explanation

- **useLocalStorage(key, fallback)** – lazy-initializes from LocalStorage with safe `JSON.parse`
  (corrupted data falls back), then keeps storage in sync via an effect.
- **useWeather(location, { refreshMinutes })** – fetch + transform + `loading/error` + `reload`,
  refetches on location change and on an optional interval.
- **useLocationSearch(onSelect)** – query/results/loading/error, debounced suggestions,
  `AbortController` cancellation, submit + select handlers.
- **useLocalClock(timeZone, timeFormat)** – 30s ticking label for the location's local time.

## Known Limitations

- Hash-based routing (`#/weather?lat=..`) is used so deep links survive static hosting.
- Favorite-card conditions require one extra request per favorite (parallel, current-only).
- No offline mode / PWA caching; no unit tests; no map view.
- Auto-detect location (geolocation) is intentionally not implemented.

## AI Tools Used

AI assistance was used for scaffolding and code generation during development.
See **AI_USAGE.md** for details, including what must be verified manually.

## What Was Personally Implemented

> Fill this section with your own contribution summary before submission
> (e.g. which components you wrote by hand, what you refactored, what you debugged).

- [ ] Your notes here.
