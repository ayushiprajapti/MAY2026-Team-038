import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import HeritageShop from "./pages/HeritageShop";
import Checkout from "./pages/Checkout";
import AdminPage from "./pages/AdminPage";
import GlobeHome from "./pages/GlobeHome.jsx";
import TrailExperience from "./pages/TrailExperience.jsx";
import VolunteerPage from "./pages/VolunteerPage";
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

// Routes gets an explicit `location` prop (instead of relying on the
// live router context, as a bare <Outlet /> would) so the exiting page's
// matched route stays frozen on the old path while AnimatePresence
// animates it out — otherwise it flips to the new page mid-exit.
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardNew />} />
          <Route path="/admin-shop" element={<AdminShopPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/shop" element={<HeritageShop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/trails" element={<GlobeHome />} />
          <Route path="/trails/:trailId" element={<TrailExperience />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register", "/admin-dashboard", "/admin-shop"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!hideHeaderFooter && <Header />}
      <AnimatedRoutes />
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
