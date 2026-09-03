import { LoaderCircle } from "lucide-react";

export function Spinner({ className = "h-5 w-5" }) {
  return <LoaderCircle className={`animate-spin ${className}`} aria-hidden="true" />;
}

export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}
