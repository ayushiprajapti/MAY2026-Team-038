import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { listProducts } from "../../api/shop";
import { list as listEvents } from "../../api/events";
import { listPending } from "../../api/heritage";

// Stays under the backend's 60s cache TTL so caches never go fully cold
// while an admin is browsing the admin section.
const WARM_INTERVAL_MS = 45_000;

function warmAdminCaches() {
  // Fire-and-forget: these calls exist purely to keep server-side caches
  // warm so whichever admin tab gets opened next answers instantly.
  // Failures are ignored - the visited page just falls back to its own
  // normal (slower) fetch.
  listProducts().catch(() => {});
  listEvents().catch(() => {});
  listPending({ status: "all" }).catch(() => {}); // matches AdminDatabase's default filter
}

export default function AdminLayout() {
  const location = useLocation();
  const { pathname } = location;

  let activePage = "dashboard";
  if (pathname.includes("/admin-shop")) activePage = "shop";
  else if (pathname.includes("/admin/events")) activePage = "events";
  else if (pathname.includes("/admin-db")) activePage = "database";
  else if (pathname.includes("/admin-chat")) activePage = "chat";
  else if (pathname === "/admin-review") activePage = "old-admin";

  // Runs once per mount of the admin layout (which persists across
  // navigation between admin tabs) and stops when the admin leaves the
  // admin section entirely - e.g. on logout.
  useEffect(() => {
    warmAdminCaches();
    const id = setInterval(warmAdminCaches, WARM_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex bg-[#f8ecd7] min-h-screen text-heritage-espresso w-full">
      <AdminSidebar activePage={activePage} />
      <div className="flex-1 ml-80 min-h-screen flex flex-col overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
