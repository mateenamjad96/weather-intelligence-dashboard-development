# Manual Testing Checklist — SkyPulse

Tick each item in the browser before submission. Test at 1920 / 1440 / 1024 / 768 / 390 px widths.

## Search

- [ ] Empty search submit → inline hint, no request sent
- [ ] 1-character submit → "Enter at least 2 characters" message
- [ ] Valid search ("Lahore") → loading state, then results with name, region, country, lat/lon
- [ ] Invalid city ("Xyzabc123") → friendly "No locations found" empty state
- [ ] Typing 3+ characters → debounced suggestions appear without pressing Enter
- [ ] Submit still works immediately while debounce is pending
- [ ] Submit button disabled while a search is loading
- [ ] Network disconnected → friendly error text, no stack trace
- [ ] Selecting a result → input + results reset, weather loads for that location
- [ ] Very long input (60 chars) → input capped, layout does not break
- [ ] Clicking outside the dropdown closes it; Escape-friendly (button blur)

## URL state

- [ ] `#/weather?lat=31.5204&lon=74.3587&name=Lahore` loads Lahore on open
- [ ] `#/weather?city=Karachi` geocodes and loads Karachi
- [ ] `#/weather?lat=999&lon=abc` → friendly invalid-link banner, app still usable
- [ ] `#/weather?city=NowhereXYZ` → friendly "couldn't find" banner
- [ ] Selecting a location updates the URL without a page reload

## Dashboard

- [ ] Hero shows location, condition, temperature, feels-like, high/low, updated time
- [ ] Details list shows all 10 metrics; missing values show `—`
- [ ] Hourly tabs: Today / Tomorrow / other days switch the hour strip
- [ ] "Now" cell highlighted on today's strip
- [ ] 7-day cards show real day names/dates from the API (not hardcoded)
- [ ] Filters: All / Rainy / High Temperature / Precipitation / Strong Wind behave correctly
- [ ] Threshold inputs (temp/wind) change results; unit switch converts thresholds
- [ ] Sorting: default / hottest / coldest / windiest / wettest reorder cards immutably
- [ ] Filter with impossible threshold → "No days match" empty state + reset button
- [ ] Statistics match the visible 7-day data (spot-check one average by hand)
- [ ] Loading: skeletons on first load; "Refreshing…" indicator on manual/auto refetch
- [ ] Error: disconnect network, reload → friendly error + working "Try again"

## Units & theme

- [ ] °C ↔ °F switches every temperature instantly (hero, hourly, forecast, stats, favorites)
- [ ] Dark ↔ light theme switches entire app and persists after refresh
- [ ] Settings sidebar/header/controls stay in sync with the Settings page form

## Favorites

- [ ] Add favorite from hero → button becomes "Saved", count badge increments
- [ ] Adding the same location twice does not duplicate (guard works)
- [ ] Remove favorite → card disappears, badge decrements
- [ ] Refresh page → favorites persist
- [ ] Open favorite → dashboard loads it without a geocoding search
- [ ] Favorites page shows live conditions per card + "Updated …" label
- [ ] Sort favorites by recently added / name
- [ ] Empty favorites → empty state with CTA; dashed "Add New Location" tile navigates to search

## Search history

- [ ] Searching locations records up to 5 entries, newest first, no duplicates
- [ ] Clicking a history entry reloads that location (no new geocoding request)
- [ ] "Clear all" empties the list and persists empty after refresh

## LocalStorage

- [ ] Refresh restores: theme, unit, favorites, history, last location, settings
- [ ] Corrupt a key (DevTools → Application → LocalStorage → set `wid.favorites` to `{bad`)
      → app loads with defaults, no crash
- [ ] "Remember Last Location" off → refresh starts with no location selected

## Settings

- [ ] Form is fully controlled; changing selects updates the draft only
- [ ] "Unsaved changes" indicator appears when draft ≠ saved
- [ ] Save Settings persists (refresh keeps values) + success flash
- [ ] Reset to Defaults restores factory values in the draft
- [ ] Auto refresh = 15 min actually refetches (verify request in Network tab after interval)
- [ ] Hourly interval = 3 Hours thins the hourly strip
- [ ] Default view swaps hourly/7-day section order
- [ ] Time format 12h/24h changes every clock/sunrise/sunset label
- [ ] Wind unit km/h ↔ mph updates wind values everywhere

## Accessibility & keyboard

- [ ] Tab order reaches: skip link → nav → search → controls → cards
- [ ] All icon-only buttons expose names (aria-label/tooltip)
- [ ] Focus ring visible on every interactive element
- [ ] Search, filters, tabs, favorites and settings usable with keyboard only
- [ ] Headings hierarchy: one h1 per page, sections labelled

## Utility spot-checks (browser console or mental math)

- [ ] `convertTemperature(0, "fahrenheit") === 32`, `(100 → 212)`
- [ ] Average of [10, 20] daily means = 15
- [ ] Total precipitation sums daily `precipitation_sum`
- [ ] Weather code 61 → "Light Rain", 95 → "Thunderstorm", unknown code → "Unknown"
- [ ] Duplicate favorite detection returns false on second add
