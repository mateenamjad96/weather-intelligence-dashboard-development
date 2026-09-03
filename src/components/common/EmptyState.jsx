export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction, className = "" }) {
  return (
    <div className={`card flex flex-col items-center justify-center gap-3 p-10 text-center ${className}`}>
      {Icon && (
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "var(--chip-bg)", border: "1px solid var(--card-border)" }}
        >
          <Icon className="text-accent-soft h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {message && <p className="text-dim max-w-sm text-sm">{message}</p>}
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary mt-1" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
