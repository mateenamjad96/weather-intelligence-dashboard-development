import { AlertTriangle, RotateCw, X } from "lucide-react";

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  retryLabel = "Try again",
  onRetry,
  onDismiss,
  compact = false,
}) {
  return (
    <div role="alert" className={`card flex items-start gap-3 ${compact ? "p-3" : "p-5"}`}>
      <AlertTriangle className="h-5 w-5 shrink-0 text-warn" aria-hidden="true" />
      <div className="flex-1 text-sm">
        <p className="font-semibold">{title}</p>
        {message && <p className="text-dim mt-1">{message}</p>}
        {onRetry && (
          <button type="button" className="btn btn-ghost mt-3 h-9" onClick={onRetry}>
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            {retryLabel}
          </button>
        )}
      </div>
      {onDismiss && (
        <button type="button" className="btn btn-ghost h-8 w-8 p-0" onClick={onDismiss} aria-label="Dismiss message">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
