import { useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import HeritageShop from "./pages/HeritageShop";
import Checkout from "./pages/Checkout";
import AdminPage from "./pages/AdminPage";
import AdminDatabase from "./components/admin/AdminDatabase.jsx";
import AdminChat from "./components/admin/AdminChat.jsx";
import GlobeHome from "./pages/GlobeHome.jsx";
import TrailExperience from "./pages/TrailExperience.jsx";
import VolunteerPage from "./pages/VolunteerPage";
import EventPage from "./pages/EventPage";
import "./App.css";

function SiteLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-db" element={<AdminDatabase />} />
          <Route path="/admin-chat" element={<AdminChat />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/shop" element={<HeritageShop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/trails" element={<GlobeHome />} />
        </Route>
        {/* Immersive trail — no global header/footer */}
        <Route path="/trails/:trailId" element={<TrailExperience />} />
      </Routes>
    </>
  );
}
