import { Routes, Route } from "react-router-dom";
import VolunteerPortal from "../components/VolunteerPortal/VolunteerPortal";
import UploadHeritage from "../components/VolunteerPortal/UploadHeritage";
import UploadHistory from "../components/VolunteerPortal/UploadHistory";
import VolunteerProfile from "../components/VolunteerPortal/VolunteerProfile";

export default function VolunteerPage() {
  return (
    <Routes>
      <Route path="/" element={<VolunteerPortal />} />
      <Route path="/upload" element={<UploadHeritage />} />
      <Route path="/history" element={<UploadHistory />} />
      <Route path="/profile" element={<VolunteerProfile />} />
    </Routes>
  );
}