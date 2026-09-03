import { useEffect, useState } from "react";

function readStorageValue(key, fallbackValue) {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return fallbackValue;
    return JSON.parse(stored);
  } catch {
    // corrupted JSON or blocked storage: fall back instead of crashing
    return fallbackValue;
  }
}

export function useLocalStorage(key, fallbackValue) {
  const [value, setValue] = useState(() => readStorageValue(key, fallbackValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable: state still works for this session
    }
  }, [key, value]);

  return [value, setValue];
}
