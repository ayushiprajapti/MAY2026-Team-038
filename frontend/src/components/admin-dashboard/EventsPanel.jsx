import React from "react";

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

const statusBg = (status) => {
  const map = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-100",
    draft: "bg-heritage-cream-dark/60 text-heritage-charcoal/80 border-heritage-border/30",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-heritage-cream-dark/60 text-heritage-charcoal/80 border-heritage-border/30",
  };
  return map[status] || "bg-heritage-cream-dark/60 text-heritage-charcoal/80 border-heritage-border/30";
};

export default function EventsPanel({ todayEvents = [], upcomingEvents = [] }) {
  const rows = [
    ...todayEvents.map((e) => ({ ...e, timingLabel: "Today" })),
    ...upcomingEvents.map((e) => ({ ...e, timingLabel: "Upcoming" })),
  ];

  return (
    <div className="bg-heritage-cream-light p-6 md:p-8 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="font-serif text-2xl font-semibold text-heritage-espresso">
              Chapter Events
            </h4>
            <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
              Daily schedule and upcoming cultural programs
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-heritage-bronze bg-heritage-cream px-2.5 py-1 rounded border border-heritage-border/40">
            Today
          </span>
        </div>

        {rows.length === 0 ? (
          <p className="text-xs text-heritage-charcoal/50 font-sans py-6 text-center">
            No events scheduled today or in the next few days.
          </p>
        ) : (
          <div className="space-y-6">
            {rows.map((event) => (
              <div
                key={event.id}
                className="relative pl-6 border-l-2 border-heritage-border/60 text-left"
              >
                <div
                  className={`absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full border-2 border-heritage-cream-light ${
                    event.timingLabel === "Today"
                      ? "bg-heritage-red shadow-[0_0_8px_rgba(140,45,25,0.4)]"
                      : "bg-heritage-border"
                  }`}
                />

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-sans font-bold text-heritage-red uppercase tracking-wider">
                    {event.timingLabel}
                  </span>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusBg(event.status)}`}>
                    {event.status}
                  </span>
                </div>

                <h5 className="font-serif text-base font-semibold text-heritage-espresso">
                  {event.title}
                </h5>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-heritage-charcoal/70 font-sans">
                  <span className="flex items-center gap-1 font-medium text-heritage-bronze">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.venue || "Venue TBD"}
                  </span>
                  <span className="text-heritage-charcoal/30">|</span>
                  <span>{formatDate(event.event_date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => alert("Redirecting to full Chapter Calendar...")}
        className="w-full mt-6 py-3 border border-heritage-bronze text-heritage-bronze font-sans text-xs font-semibold uppercase tracking-wider rounded hover:bg-heritage-bronze hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
      >
        View Full Calendar
      </button>
    </div>
  );
}
