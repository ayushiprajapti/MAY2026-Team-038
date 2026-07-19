import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SiteLayout from "./components/shared/SiteLayout";
import AdminLayout from "./components/shared/AdminLayout";
import Home from "./pages/Home";
import HeritageShop from "./pages/HeritageShop";
import Checkout from "./pages/Checkout";
import AdminPage from "./pages/AdminPage";
import AdminDatabase from "./components/admin/AdminDatabase.jsx";
import AdminChat from "./components/admin/AdminChat.jsx";
import GlobeHome from "./pages/GlobeHome.jsx";
import TrailExperience from "./pages/TrailExperience.jsx";
import VolunteerPage from "./pages/VolunteerPage";
import VolunteerUploadDetails from "./pages/VolunteerUploadDetails";
import EventPage from "./pages/EventPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboardNew from "./pages/AdminDashboard";
import AdminShopPage from "./pages/AdminShop";
import "./App.css";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Client-Side Route Protection Component
function ProtectedRoute({ allowedRoles }) {
  const storedUser = localStorage.getItem("intach_user");

  if (!storedUser) {
    // Not signed in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Role not authorized, redirect to home page
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Helper wrapper to animate transition for standalone page components
function AnimatedPage({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      
      {/* Site Layout Wrapped Routes (Gets Header & Footer automatically) */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        
        {/* Protected Volunteer Routes (Gets Header & Footer) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/volunteer/*" element={<VolunteerPage />} />
        </Route>

        {/* Public Layout-Wrapped Routes */}
        <Route path="/events" element={<EventPage />} />
        <Route path="/shop" element={<HeritageShop />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/trails" element={<GlobeHome />} />
      </Route>

      {/* Standalone Public Routes (No Header & Footer) */}
      <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
      <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
      {/* Immersive trail — no global header/footer */}
      <Route path="/trails/:trailId" element={<AnimatedPage><TrailExperience /></AnimatedPage>} />

      {/* Protected Admin Routes (No Global Header & Footer, gets AdminSidebar layout) */}
      <Route element={<ProtectedRoute allowedRoles={["event_admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-db" element={<AdminDatabase />} />
          <Route path="/admin-chat" element={<AdminChat />} />
          <Route path="/admin-dashboard" element={<AdminDashboardNew />} />
          <Route path="/admin-shop" element={<AdminShopPage />} />
        </Route>
        <Route
          path="/admin/volunteer-details"
          element={<AnimatedPage><VolunteerUploadDetails /></AnimatedPage>}
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AnimatedRoutes />
    </>
  );
}
