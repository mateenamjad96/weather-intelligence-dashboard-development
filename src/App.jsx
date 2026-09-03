import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <WeatherProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/weather" element={<DashboardPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/weather" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </WeatherProvider>
  );
}
