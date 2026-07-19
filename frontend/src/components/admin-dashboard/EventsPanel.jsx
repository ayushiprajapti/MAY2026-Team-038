import React from "react";

export default function EventsPanel() {
  // DBML Event instances with schema-aligned enums (event_type & status)
  const events = [
    {
      id: "ev-1",
      title: "Kasba Peth Heritage Walk",
      event_type: "heritage_walk", // DBML event_type enum
      event_date: "Today",
      start_time: "08:00 AM",
      end_time: "11:00 AM",
      venue: "Shaniwar Wada Gate",
      status: "published", // DBML event_status enum
      timingLabel: "Today",
      statusBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      id: "ev-2",
      title: "Tambat Copper Craft Workshop",
      event_type: "workshop", // DBML event_type enum
      event_date: "May 20, 2026",
      start_time: "10:30 AM",
      end_time: "01:30 PM",
      venue: "Tambat Ali, Kasba Peth",
      status: "published", // DBML event_status enum
      timingLabel: "Upcoming",
      statusBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      id: "ev-3",
      title: "Pune Queen of Deccan Book Quiz",
      event_type: "quiz", // DBML event_type enum
      event_date: "May 27, 2026",
      start_time: "04:00 PM",
      end_time: "06:00 PM",
      venue: "Warsaa Shop, Shaniwar Wada",
      status: "draft", // DBML event_status enum
      timingLabel: "Next Week",
      statusBg: "bg-heritage-cream-dark/60 text-heritage-charcoal/80 border-heritage-border/30",
    },
  ];

  const formatEventType = (type) => {
    return type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

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

        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="relative pl-6 border-l-2 border-heritage-border/60 text-left"
            >
              {/* Event Timeline Indicator */}
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
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${event.statusBg}`}>
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
                  {event.venue}
                </span>
                <span className="text-heritage-charcoal/30">|</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.start_time} - {event.event_date === "Today" ? event.end_time : event.event_date}
                </span>
              </div>

              <div className="mt-1 text-[10px] font-mono text-heritage-charcoal/50">
                Type: {formatEventType(event.event_type)}
              </div>
            </div>
          ))}
        </div>
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
