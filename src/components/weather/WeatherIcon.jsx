import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";
import { getWeatherInfo } from "../../utils/weatherCodes";

const DAY_ICONS = {
  clear: Sun,
  partly: CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

const NIGHT_ICONS = {
  clear: Moon,
  partly: CloudMoon,
};

const TONE_CLASSES = {
  sun: "text-amber-400",
  night: "text-slate-300",
  cloud: "text-slate-400",
  fog: "text-slate-400",
  rain: "text-sky-400",
  snow: "text-cyan-300",
  storm: "text-orange-400",
};

export default function WeatherIcon({ code, isDay = true, className = "h-6 w-6", animate = false, label }) {
  const info = getWeatherInfo(code);
  const Icon = (isDay ? DAY_ICONS[info.icon] : NIGHT_ICONS[info.icon]) ?? DAY_ICONS[info.icon] ?? Cloud;
  const tone = !isDay && (info.icon === "clear" || info.icon === "partly") ? "night" : info.tone;
  const motionClass = animate ? (info.icon === "clear" ? "icon-spin-slow" : "icon-float") : "";
  const icon = (
    <Icon className={`${className} ${TONE_CLASSES[tone]} ${motionClass}`} strokeWidth={1.6} aria-hidden="true" />
  );
  if (label) {
    return (
      <span role="img" aria-label={label}>
        {icon}
      </span>
    );
  }
  return icon;
}
