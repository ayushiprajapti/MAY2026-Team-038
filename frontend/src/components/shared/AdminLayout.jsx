import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
};

export default function AdminLayout() {
  const location = useLocation();
  const { pathname } = location;

  let activePage = "dashboard";
  if (pathname.includes("/admin-shop")) activePage = "shop";
  else if (pathname.includes("/admin-db")) activePage = "database";
  else if (pathname.includes("/admin-chat")) activePage = "chat";
  else if (pathname === "/admin") activePage = "old-admin";

  return (
    <div className="flex bg-[#f8ecd7] min-h-screen text-heritage-espresso w-full">
      <AdminSidebar activePage={activePage} />
      <div className="flex-1 ml-80 min-h-screen flex flex-col overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex-1 w-full h-full flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
