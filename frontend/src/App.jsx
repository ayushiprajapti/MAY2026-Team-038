import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import VolunteerPortal from "./components/VolunteerPortal/VolunteerPortal";
import EventCoordinator from "./components/EventCoordinator/EventCoordinator";

function App() {
  const [page, setPage] = useState("volunteer");

  return (
    <>
      <Navbar activePage={page} onNavigate={setPage} />

      {page === "volunteer" && <VolunteerPortal />}
      {page === "events" && <EventCoordinator />}

      {page === "home" && (
        <div className="heritage-page px-6 py-10 text-[#4B3328]">
          <div className="mx-auto max-w-7xl border-b border-[#D7C3A8] pb-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A26B1D]">
              Pune Chapter
            </p>
            <h1 className="mt-2 font-serif text-4xl font-medium text-[#7F1D1D] sm:text-5xl">
              Home
            </h1>
            <p className="mt-3 text-lg text-[#5F4631]">
              Welcome to INTACH Pune Chapter.
            </p>
          </div>
        </div>
      )}

      {page === "map" && (
        <div className="heritage-page px-6 py-10 text-[#4B3328]">
          <div className="mx-auto max-w-7xl border-b border-[#D7C3A8] pb-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A26B1D]">
              Explore
            </p>
            <h1 className="mt-2 font-serif text-4xl font-medium text-[#7F1D1D] sm:text-5xl">
              Map
            </h1>
            <p className="mt-3 text-lg text-[#5F4631]">
              Heritage map page will appear here.
            </p>
          </div>
        </div>
      )}

      {page === "review" && (
        <div className="heritage-page px-6 py-10 text-[#4B3328]">
          <div className="mx-auto max-w-7xl border-b border-[#D7C3A8] pb-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A26B1D]">
              Moderator Area
            </p>
            <h1 className="mt-2 font-serif text-4xl font-medium text-[#7F1D1D] sm:text-5xl">
              Review Queue
            </h1>
            <p className="mt-3 text-lg text-[#5F4631]">
              Submitted heritage sites will appear here.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
