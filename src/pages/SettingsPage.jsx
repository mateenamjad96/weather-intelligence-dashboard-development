import SettingsForm from "../components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-dim text-sm">Customize your weather experience</p>
      </div>
      <SettingsForm />
    </div>
  );
}
