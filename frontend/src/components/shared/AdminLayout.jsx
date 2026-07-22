import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const location = useLocation();
  const { pathname } = location;

  let activePage = "dashboard";
  if (pathname.includes("/admin-shop")) activePage = "shop";
  else if (pathname.includes("/admin/events")) activePage = "events";
  else if (pathname.includes("/admin-db")) activePage = "database";
  else if (pathname.includes("/admin-chat")) activePage = "chat";
  else if (pathname === "/admin-review") activePage = "old-admin";

  return (
    <div className="flex bg-[#f8ecd7] min-h-screen text-heritage-espresso w-full">
      <AdminSidebar activePage={activePage} />
      <div className="flex-1 ml-80 min-h-screen flex flex-col overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
