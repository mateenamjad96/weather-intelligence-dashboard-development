import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Sidebar className="fixed inset-y-0 left-0 z-30 hidden w-[216px] lg:flex" />

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="fade-in absolute inset-y-0 left-0 w-[280px] p-3">
            <Sidebar className="h-full" onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[216px]">
        <Header />
        <main id="main-content" className="dashboard-main mx-auto w-full max-w-[1440px] px-4 pb-20 pt-6 sm:px-6 xl:px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
