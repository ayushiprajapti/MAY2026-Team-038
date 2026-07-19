import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import SiteLayout from "./components/shared/SiteLayout";
import Home from "./pages/Home";
import HeritageShop from "./pages/HeritageShop";
import Checkout from "./pages/Checkout";
import AdminPage from "./pages/AdminPage";
import GlobeHome from "./pages/GlobeHome";
import TrailExperience from "./pages/TrailExperience";
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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          
          {/* Site Layout Wrapped Routes (Gets Header & Footer automatically) */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            
            {/* Admin Module */}
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/admin/volunteer-details"
              element={<VolunteerUploadDetails />}
            />

            <Route path="/volunteer/*" element={<VolunteerPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/shop" element={<HeritageShop />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/trails" element={<GlobeHome />} />
            <Route path="/trails/:trailId" element={<TrailExperience />} />
          </Route>

          {/* Standalone Routes (No Header & Footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboardNew />} />
          <Route path="/admin-shop" element={<AdminShopPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
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
