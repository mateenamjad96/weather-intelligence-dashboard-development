import { Plus } from "lucide-react";
import FavoriteCard from "./FavoriteCard";

export default function FavoritesList({
  favorites,
  weatherById,
  loadingWeather,
  unit,
  windUnit,
  updatedLabel,
  onOpen,
  onRemove,
  onAddNew,
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {favorites.map((favorite) => (
        <li key={favorite.id}>
          <FavoriteCard
            location={favorite}
            current={weatherById?.[favorite.id] ?? null}
            loading={loadingWeather}
            unit={unit}
            windUnit={windUnit}
            updatedLabel={updatedLabel}
            onOpen={onOpen}
            onRemove={onRemove}
          />
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onAddNew}
          className="hover:border-[var(--card-border-hover)] hover:bg-[var(--chip-bg)] flex h-full min-h-[240px] w-full flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-[var(--card-border)] p-6 text-center transition"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--chip-bg)]">
            <Plus className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-semibold">Add New Location</span>
          <span className="text-dim max-w-[220px] text-xs">Search any city to get real-time weather updates.</span>
        </button>
      </li>
    </ul>
  );
}
