import { useEffect } from "react";
<<<<<<< HEAD
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";

=======
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import SiteLayout from "./components/shared/SiteLayout";
import AdminLayout from "./components/shared/AdminLayout";
>>>>>>> 4d91720bc27f62d9c96301a2e683f56b2cacf7cb
import Home from "./pages/Home";
import HeritageShop from "./pages/HeritageShop";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import AdminReviewPage from "./pages/AdminReview";
import AdminDatabase from "./components/admin/AdminDatabase.jsx";
import AdminChat from "./components/admin/AdminChat.jsx";
import GlobeHome from "./pages/GlobeHome.jsx";
import TrailExperience from "./pages/TrailExperience.jsx";
import VolunteerPage from "./pages/VolunteerPage";
import VolunteerUploadDetails from "./pages/VolunteerUploadDetails";
import EventPage from "./pages/EventPage";
import EventRegistration from "./pages/EventRegistration";
import AdminEvents from "./pages/AdminEvents";
import AdminEventCreate from "./pages/AdminEventCreate";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboardNew from "./pages/AdminDashboard";
import AdminShopPage from "./pages/AdminShop";

import "./App.css";

<<<<<<< HEAD
const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
};

function SiteLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

=======
>>>>>>> 4d91720bc27f62d9c96301a2e683f56b2cacf7cb
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
<<<<<<< HEAD
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/admin/volunteer-details"
              element={<VolunteerUploadDetails />}
            />
=======
    <Routes location={location}>
      
      {/* Site Layout Wrapped Routes (Gets Header & Footer automatically) */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        
        {/* Protected User Routes (Gets Header & Footer) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
          <Route path="/orders" element={<AnimatedPage><OrderHistory /></AnimatedPage>} />
          <Route path="/volunteer/*" element={<AnimatedPage><VolunteerPage /></AnimatedPage>} />
        </Route>
>>>>>>> 4d91720bc27f62d9c96301a2e683f56b2cacf7cb

        {/* Public Layout-Wrapped Routes */}
        <Route path="/events" element={<AnimatedPage><EventPage /></AnimatedPage>} />
        <Route path="/events/register" element={<AnimatedPage><EventRegistration /></AnimatedPage>} />
        <Route path="/shop" element={<AnimatedPage><HeritageShop /></AnimatedPage>} />
        <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
        <Route path="/trails" element={<AnimatedPage><GlobeHome /></AnimatedPage>} />
      </Route>

<<<<<<< HEAD
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboardNew />} />
          <Route path="/admin-shop" element={<AdminShopPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
=======
      {/* Standalone Public Routes (No Header & Footer) */}
      <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
      <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
      {/* Immersive trail — no global header/footer */}
      <Route path="/trails/:trailId" element={<AnimatedPage><TrailExperience /></AnimatedPage>} />

      {/* Protected Admin Routes (No Global Header & Footer, gets AdminSidebar layout) */}
      <Route element={<ProtectedRoute allowedRoles={["event_admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin-review" element={<AnimatedPage><AdminReviewPage /></AnimatedPage>} />
          <Route path="/admin-db" element={<AnimatedPage><AdminDatabase /></AnimatedPage>} />
          <Route path="/admin-chat" element={<AnimatedPage><AdminChat /></AnimatedPage>} />
          <Route path="/admin-dashboard" element={<AnimatedPage><AdminDashboardNew /></AnimatedPage>} />
          <Route path="/admin-shop" element={<AnimatedPage><AdminShopPage /></AnimatedPage>} />
          <Route path="/admin/events" element={<AnimatedPage><AdminEvents /></AnimatedPage>} />
          <Route path="/admin/events/create" element={<AnimatedPage><AdminEventCreate /></AnimatedPage>} />
        </Route>
        <Route
          path="/admin/volunteer-details"
          element={<AnimatedPage><VolunteerUploadDetails /></AnimatedPage>}
        />
      </Route>
    </Routes>
>>>>>>> 4d91720bc27f62d9c96301a2e683f56b2cacf7cb
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