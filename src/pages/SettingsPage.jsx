import { Settings2 } from "lucide-react";
import SettingsForm from "../components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="settings-page flex flex-col gap-7 rounded-[1.25rem] p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--subtle-border)] bg-[var(--chip-bg)]">
          <Settings2 className="h-6 w-6 text-blue-400" aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold leading-tight">Settings</h1>
          <p className="text-dim text-sm">Manage your SkyPulse preferences</p>
        </div>
      </div>
      <SettingsForm />
    </div>
  );
}
