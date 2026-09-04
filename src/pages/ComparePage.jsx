import { useCallback, useState } from "react";
import { ArrowLeftRight, MapPin } from "lucide-react";
import { useAppContext } from "../context/WeatherContext";
import { useComparisonWeather } from "../hooks/useComparisonWeather";
import SearchField from "../components/search/SearchField";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import { Skeleton } from "../components/common/Loading";
import ComparisonWeatherCard from "../components/compare/ComparisonWeatherCard";
import ComparisonMetrics from "../components/compare/ComparisonMetrics";
import TemperatureComparisonChart from "../components/compare/TemperatureComparisonChart";

function isSameLocation(first, second) {
  return Boolean(
    first &&
    second &&
    first.latitude === second.latitude &&
    first.longitude === second.longitude
  );
}

function CitySelector({ label, location, onSelect, inputId }) {
  const region = location ? [location.admin1, location.country].filter(Boolean).join(", ") : "";
  return (
    <div className="min-w-0">
      <h2 className="label-xs mb-2">{label}</h2>
      {location && (
        <div className="mb-2 flex min-w-0 items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2">
          <MapPin className="h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
          <span className="min-w-0">
            <strong className="block truncate text-sm">{location.name}</strong>
            <span className="text-dim block truncate text-xs">{region || "Selected location"}</span>
          </span>
        </div>
      )}
      <SearchField
        id={inputId}
        placeholder={`Search ${label.toLowerCase()}...`}
        onSelectLocation={onSelect}
        minQueryLength={3}
        debounceMs={400}
      />
    </div>
  );
}

function WeatherResult({ location, state, unit, windUnit }) {
  if (state.loading) return <Skeleton className="h-80 rounded-[1.25rem]" />;
  if (state.error) {
    return (
      <ErrorMessage
        title={`Unable to load ${location.name}`}
        message={state.error}
        onRetry={state.reload}
      />
    );
  }
  if (!state.weather?.current) {
    return <ErrorMessage title={`No weather data for ${location.name}`} message="Current conditions are unavailable for this location." onRetry={state.reload} />;
  }
  return <ComparisonWeatherCard location={location} weather={state.weather} unit={unit} windUnit={windUnit} />;
}

export default function ComparePage() {
  const { temperatureUnit, settings } = useAppContext();
  const [cities, setCities] = useState([null, null]);
  const [selectionError, setSelectionError] = useState(null);
  const cityA = cities[0];
  const cityB = cities[1];
  const weatherA = useComparisonWeather(cityA);
  const weatherB = useComparisonWeather(cityB);

  const selectCityA = useCallback((location) => {
    if (isSameLocation(location, cityB)) {
      setSelectionError("City A and City B must be different locations.");
      return false;
    }
    setCities((current) => [location, current[1]]);
    setSelectionError(null);
    return true;
  }, [cityB]);

  const selectCityB = useCallback((location) => {
    if (isSameLocation(location, cityA)) {
      setSelectionError("City A and City B must be different locations.");
      return false;
    }
    setCities((current) => [current[0], location]);
    setSelectionError(null);
    return true;
  }, [cityA]);

  const swapCities = () => {
    if (!cityA || !cityB) return;
    setCities(([first, second]) => [second, first]);
    setSelectionError(null);
  };

  const bothSelected = Boolean(cityA && cityB);
  const bothReady = Boolean(weatherA.weather?.current && weatherB.weather?.current);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10">
          <ArrowLeftRight className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">Compare Cities</h1>
          <p className="text-dim text-sm">Compare weather conditions and forecasts side by side.</p>
        </div>
      </div>

      <section className="card relative z-10 p-5" aria-label="Choose cities to compare">
        <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <CitySelector label="City A" location={cityA} onSelect={selectCityA} inputId="compare-city-a" />
          <button
            type="button"
            className="btn btn-ghost mx-auto h-10 w-10 rounded-xl p-0 sm:mb-0"
            onClick={swapCities}
            disabled={!bothReady}
            aria-label="Swap City A and City B"
            title="Swap cities"
          >
            <ArrowLeftRight className="h-4 w-4 rotate-90 sm:rotate-0" aria-hidden="true" />
          </button>
          <CitySelector label="City B" location={cityB} onSelect={selectCityB} inputId="compare-city-b" />
        </div>
        {selectionError && <p className="text-warn mt-3 text-sm" role="alert">{selectionError}</p>}
      </section>

      {!cityA && !cityB && (
        <EmptyState
          icon={ArrowLeftRight}
          title="Choose two cities"
          message="Search for City A and City B above to compare their current weather and next 24 hours."
        />
      )}

      {(cityA || cityB) && !bothSelected && (
        <EmptyState
          icon={MapPin}
          title="Select the second city"
          message={`Choose ${cityA ? "City B" : "City A"} to start the side-by-side comparison.`}
        />
      )}

      {bothSelected && (
        <>
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <WeatherResult location={cityA} state={weatherA} unit={temperatureUnit} windUnit={settings.windUnit} />
            <WeatherResult location={cityB} state={weatherB} unit={temperatureUnit} windUnit={settings.windUnit} />
          </div>

          {bothReady && (
            <>
              <ComparisonMetrics
                cityA={cityA}
                cityB={cityB}
                weatherA={weatherA.weather}
                weatherB={weatherB.weather}
                unit={temperatureUnit}
                windUnit={settings.windUnit}
              />
              <TemperatureComparisonChart
                cityA={cityA}
                cityB={cityB}
                weatherA={weatherA.weather}
                weatherB={weatherB.weather}
                unit={temperatureUnit}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
