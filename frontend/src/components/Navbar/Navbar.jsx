export default function Navbar({ activePage, onNavigate }) {
  const navItemClass = (page) =>
    `rounded-full px-3 py-1.5 transition hover:bg-[#F3E2C6] hover:text-[#7F1D1D] ${
      activePage === page ? "bg-[#F3E2C6] font-semibold text-[#7F1D1D]" : ""
    }`;

  return (
    <nav className="sticky top-0 z-30 border-b border-[#D7C3A8] bg-[#F8ECD7]/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="text-left">
          <h1 className="font-serif text-2xl font-medium leading-tight tracking-tight text-[#7F1D1D] sm:text-3xl">
            Intach
            <span className="ml-2 block font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#5F4631] sm:inline">
              Pune Chapter
            </span>
          </h1>
        </div>

        <ul className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#3F3329] sm:gap-3 sm:text-base lg:justify-end">
          <li onClick={() => onNavigate("home")} className={navItemClass("home")} role="button" tabIndex={0}>
            Home
          </li>

          <li onClick={() => onNavigate("map")} className={navItemClass("map")} role="button" tabIndex={0}>
            Map
          </li>

          <li
            onClick={() => onNavigate("volunteer")}
            className={navItemClass("volunteer")}
            role="button"
            tabIndex={0}
          >
            Submit Site
          </li>

          <li
            onClick={() => onNavigate("events")}
            className={navItemClass("events")}
            role="button"
            tabIndex={0}
          >
            Events
          </li>

          <li
            onClick={() => onNavigate("review")}
            className={navItemClass("review")}
            role="button"
            tabIndex={0}
          >
            Review Queue
          </li>

          <li>
            <button
              type="button"
              onClick={() => alert("Signed out successfully")}
              className="rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2 text-[#7F1D1D] transition hover:bg-[#F3E2C6]"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
