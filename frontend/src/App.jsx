import { useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import HeritageShop from "./pages/HeritageShop";
import Checkout from "./pages/Checkout";
import AdminPage from "./pages/AdminPage";
import GlobeHome from "./pages/GlobeHome";
import TrailExperience from "./pages/TrailExperience";
import VolunteerPage from "./pages/VolunteerPage";
import VolunteerUploadDetails from "./pages/VolunteerUploadDetails";
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

          {/* Admin Module */}
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/admin/volunteer-details"
            element={<VolunteerUploadDetails />}
          />

          {/* Volunteer Module */}
          <Route path="/volunteer/*" element={<VolunteerPage />} />

          <Route path="/events" element={<EventPage />} />
          <Route path="/shop" element={<HeritageShop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/trails" element={<GlobeHome />} />
          <Route path="/trails/:trailId" element={<TrailExperience />} />
        </Route>
      </Routes>
    </>
  );
}