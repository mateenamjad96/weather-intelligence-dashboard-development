# AI Usage Disclosure — Weather Intelligence Dashboard

> This document is a template for the developer to complete honestly.
> Replace every placeholder in angle brackets with your real experience.
> Do not claim verification steps you did not actually perform.

## AI Tools Used

- <Tool name + model, e.g. "Claude (Anthropic) via <environment>">
- <Any other tools, e.g. IDE autocomplete, grammar checker>

## Prompts Used

- <Paste or summarize the main prompts you used, e.g. "Build the app shell with sidebar
  routing per the assessment spec", "Review useWeather for correct useEffect cleanup">
- <Prompt iterations, e.g. "Asked to replace stored Fahrenheit values with derived conversion">

## Parts Generated / Assisted by AI

- <e.g. Initial component scaffolding for `components/weather/*`>
- <e.g. Tailwind class suggestions and the CSS design-token block in `index.css`>
- <e.g. Draft wording of README sections>

## Parts Modified Manually

- <e.g. Adjusted filter thresholds and validation rules>
- <e.g. Rewrote `ForecastControls` event handlers to match my own explanation>
- <e.g. Fixed layout issues seen while testing at 390px>

## Bugs Introduced by AI

- <e.g. "An early version stored both Celsius and Fahrenheit; removed during review">
- <e.g. "A generated effect depended on an object literal and refetched every render; fixed by
  memoizing the location object in context">
- <If none found yet: "None known at this time — see testing checklist for what was verified.">

## How Generated Code Was Verified

- <e.g. Ran `npm run dev` and exercised the manual testing checklist (TESTING_CHECKLIST.md)>
- <e.g. Checked the Network tab: one geocoding request per search, one forecast request per location>
- <e.g. Corrupted a LocalStorage key manually and confirmed the app fell back to defaults>
- <e.g. Read every generated hook and rewrote anything I could not explain in an interview>

## Interview Readiness

For each file I can explain: why the component exists, which state lives where and why,
which values are derived instead of stored, why each `useEffect` dependency exists,
how the service layer talks to Open-Meteo, and how errors surface to the user.
