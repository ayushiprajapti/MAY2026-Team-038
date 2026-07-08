import { Routes, Route, Outlet } from "react-router-dom";
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

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<HeritageShop />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="/trails" element={<GlobeHome />} />
      <Route path="/trails/:trailId" element={<TrailExperience />} />
      <Route path="/volunteer" element={<VolunteerPage />} />
      <Route path="/events" element={<EventPage />} />
    </Routes>
  );
}
