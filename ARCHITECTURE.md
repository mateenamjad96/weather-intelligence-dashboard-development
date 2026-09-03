# Architecture — Weather Intelligence Dashboard

## Flow diagram

```
            User
             │  (clicks, typing, routing)
             ▼
      React Application
             │
             ▼
   Pages / Components
   DashboardPage · FavoritesPage · SettingsPage
   (layout: AppLayout → Sidebar + Header)
             │  props down / callbacks up
             ▼
   Custom Hooks / Context
   useWeather · useLocationSearch · useLocalStorage · useLocalClock
   WeatherContext (selectedLocation, theme, unit, favorites, history, settings)
             │
             ▼
        Service Layer
        services/weatherService.js
        searchLocations() · fetchWeather() · fetchCurrentWeather()
             │  fetch + URLSearchParams + response validation
             ▼
        Open-Meteo API
        geocoding-api.open-meteo.com · api.open-meteo.com
             │
             ▼
        JSON Response
        parallel arrays: time[], temperature_2m[], weather_code[], …
             │
             ▼
        Transformation (utils/weatherTransformers.js)
        transformCurrentWeather · transformHourlyForecast · transformDailyForecast
             │
             ▼
        React State
        { weather, loading, error }  +  derived values (filter/sort/stats)
             │
             ▼
             UI
        hero · details · hourly · forecast · statistics · favorites
```

## Layer responsibilities

| Layer        | Files                                  | Responsibility                                             |
| ------------ | -------------------------------------- | ---------------------------------------------------------- |
| Routing      | `App.jsx`                              | 3 routes + layout route, no full reloads                   |
| Layout       | `components/layout/*`                  | shell, navigation, global search, unit/theme controls      |
| Pages        | `pages/*`                              | page state (filters, sort, day), composition               |
| Context      | `context/WeatherContext.jsx`           | cross-route shared state + actions                         |
| Hooks        | `hooks/*`                              | side effects: fetching, storage, clock, search lifecycle   |
| Services     | `services/weatherService.js`           | URL construction, fetch, HTTP/validation errors            |
| Transformers | `utils/weatherTransformers.js`         | API arrays → app objects                                   |
| Pure utils   | `utils/*`                              | conversion, formatting, filtering, sorting, statistics     |
| Components   | `components/**`                        | presentation + local UI state only                         |

## State map

| Value                    | Kind     | Lives in                          |
| ------------------------ | -------- | --------------------------------- |
| selectedLocation         | state    | Context (persisted lastLocation)  |
| theme / temperatureUnit  | state    | Context (LocalStorage)            |
| favorites / searchHistory| state    | Context (LocalStorage)            |
| settings                 | state    | Context (LocalStorage)            |
| weather / loading / error| state    | useWeather                        |
| query / results / …      | state    | useLocationSearch                 |
| activeFilter / sortOption / selectedForecastDay / thresholds | state | DashboardPage |
| settings draft / errors  | state    | SettingsForm                      |
| filteredForecast         | derived  | DashboardPage (useMemo)           |
| sortedForecast           | derived  | DashboardPage (useMemo)           |
| statistics               | derived  | DashboardPage (useMemo)           |
| displayed temperatures   | derived  | convertTemperature at render time |
| isFavorite               | derived  | Context selector (Array.some)     |
| hourly slice for day     | derived  | DashboardPage (useMemo)           |

## LocalStorage keys

`wid.settings`, `wid.theme`, `wid.unit`, `wid.favorites`, `wid.searchHistory`, `wid.lastLocation`

All reads/writes go through `useLocalStorage`, which survives corrupted JSON.

## Extending the app (change-request friendly)

- Max-N favorites → guard inside `addFavorite` (one line).
- New filter (e.g. precipitation > 10mm) → add predicate in `utils/forecastFilters.js`.
- New unit (Kelvin) → extend `utils/temperature.js` + one settings choice.
- Comparison view → new page consuming `useWeather` twice; transformers already reusable.
