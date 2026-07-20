import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { events, userEventHistory } from "../../data/events";

const Icon = ({ name, className = "" }) => {
  const paths = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.87M16.5 3.13a4 4 0 0 1 0 7.75" /></>,
    arrow: <path d="m9 18 6-6-6-6" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>;
};

function EventCard({ event, onRegister, onRevoke, registered, compact = false }) {
  if (compact) {
    return (
      <article className="rounded-2xl border border-[#dfcda8] bg-[#fffaf0] p-4 shadow-[0_8px_24px_rgba(96,69,30,0.07)]">
        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] event-tag-${event.color}`}>{event.category}</span>
        <h4 className="mt-3 font-serif text-xl leading-tight text-[#392519]">{event.title}</h4>
        <div className="mt-4 space-y-2 font-sans text-sm text-[#755d48]">
          <span className="flex items-start gap-2"><Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-[#ad741d]" />{event.time}</span>
          <span className="flex items-start gap-2"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#ad741d]" />{event.place}</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eadcc2] pt-3">
          <span className="flex items-center gap-1 font-sans text-xs font-medium text-[#80705d]"><Icon name="users" className="h-4 w-4" />{event.seats}</span>
          <button onClick={() => registered ? onRevoke(event) : onRegister(event)} className={`shrink-0 rounded-lg px-3 py-2 font-sans text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#d39834] focus:ring-offset-2 ${registered ? "border border-[#9b4428] bg-transparent text-[#9b4428] hover:bg-[#f8e4d9]" : "bg-[#b87519] text-white hover:bg-[#925a0e]"}`}>
            {registered ? "Revoke" : "Register"}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="group grid grid-cols-[70px_1fr] gap-4 rounded-2xl border border-[#dfcda8] bg-[#fffaf0] p-4 shadow-[0_8px_24px_rgba(96,69,30,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(96,69,30,0.12)] sm:grid-cols-[76px_1fr_auto] sm:items-center sm:gap-5 sm:p-5">
      <div className="flex h-[72px] w-[62px] flex-col items-center justify-center rounded-xl border border-[#e4d3b2] bg-[#f8eedb] font-sans">
        <span className="text-[10px] font-bold tracking-[0.18em] text-[#a2651b]">{event.month}</span>
        <span className="font-serif text-3xl leading-8 text-[#4f321d]">{event.date}</span>
      </div>
      <div className="min-w-0">
        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] event-tag-${event.color}`}>{event.category}</span>
        <h3 className="mt-2 font-serif text-xl leading-tight text-[#392519] sm:text-2xl">{event.title}</h3>
        <div className="mt-3 flex flex-col gap-1.5 font-sans text-sm text-[#755d48] md:flex-row md:gap-5">
          <span className="flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4 text-[#ad741d]" />{event.time}</span>
          <span className="flex items-center gap-1.5"><Icon name="pin" className="h-4 w-4 text-[#ad741d]" />{event.place}</span>
        </div>
      </div>
      <div className="col-span-2 mt-1 flex items-center justify-between gap-3 sm:col-span-1 sm:mt-0 sm:flex-col sm:items-end">
        <span className="flex items-center gap-1 font-sans text-xs font-medium text-[#80705d]"><Icon name="users" className="h-4 w-4" />{event.seats}</span>
        <button onClick={() => registered ? onRevoke(event) : onRegister(event)} className={`rounded-lg px-4 py-2.5 font-sans text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#d39834] focus:ring-offset-2 ${registered ? "border border-[#9b4428] bg-transparent text-[#9b4428] hover:bg-[#f8e4d9]" : "bg-[#b87519] text-white hover:bg-[#925a0e]"}`}>
          {registered ? "Revoke" : "Register"}
        </button>
      </div>
    </article>
  );
}

function HistoryCard({ event }) {
  return (
    <article className="grid grid-cols-[58px_1fr] gap-4 rounded-xl border border-[#dfcda8] bg-[#fffaf0] p-4 sm:grid-cols-[64px_1fr_auto] sm:items-center sm:gap-5 sm:p-5">
      <div className="flex h-[62px] w-[54px] flex-col items-center justify-center rounded-lg border border-[#e4d3b2] bg-[#f8eedb] font-sans">
        <span className="text-[9px] font-bold tracking-[0.14em] text-[#a2651b]">{event.month}</span>
        <span className="font-serif text-2xl leading-7 text-[#4f321d]">{event.date}</span>
      </div>
      <div className="min-w-0">
        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] event-tag-${event.color}`}>{event.category}</span>
        <h3 className="mt-2 font-serif text-lg leading-tight text-[#392519] sm:text-xl">{event.title}</h3>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-sans text-sm text-[#755d48]"><span>{event.time}</span><span>{event.place}</span></p>
      </div>
      <span className={`col-span-2 w-fit rounded-full px-3 py-1.5 font-sans text-xs font-bold sm:col-span-1 ${event.status === "Attended" ? "bg-[#e2ebd5] text-[#526348]" : "bg-[#f3e1ba] text-[#80500f]"}`}>{event.status}</span>
    </article>
  );
}

export default function EventCoordinator() {
  const navigate = useNavigate();
  const [view, setView] = useState("calendar");
  const [category, setCategory] = useState("All events");
  const [calendarMonth, setCalendarMonth] = useState(6);
  const [calendarYear, setCalendarYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState(19);
  const [registeredIds, setRegisteredIds] = useState(() => JSON.parse(localStorage.getItem("intach-registered-events") || "[]"));

  const shownEvents = useMemo(() => category === "All events" ? events : events.filter((event) => event.category === category), [category]);
  const calendarEvents = shownEvents.filter((event) => event.monthIndex === calendarMonth);
  const selectedEvents = calendarEvents.filter((event) => event.date === selectedDate);
  const categories = ["All events", ...new Set(events.map((event) => event.category))];
  const register = (event) => navigate("/events/register", { state: { event } });
  const revoke = (event) => {
    const nextIds = registeredIds.filter((id) => id !== event.id);
    localStorage.setItem("intach-registered-events", JSON.stringify(nextIds));
    const registrations = JSON.parse(localStorage.getItem("intach-event-registrations") || "[]");
    localStorage.setItem("intach-event-registrations", JSON.stringify(registrations.filter((registration) => registration.eventId !== event.id)));
    setRegisteredIds(nextIds);
  };

  const monthName = new Date(calendarYear, calendarMonth).toLocaleString("en-US", { month: "long" });
  const days = Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }, (_, i) => i + 1);
  const firstDayOffset = new Date(calendarYear, calendarMonth, 1).getDay();
  const changeMonth = (direction) => {
    const nextDate = new Date(calendarYear, calendarMonth + direction, 1);
    setCalendarMonth(nextDate.getMonth());
    setCalendarYear(nextDate.getFullYear());
    setSelectedDate(1);
  };

  return (
    <main className="min-h-screen bg-[#f7eddc] pb-16">
      <section className="border-b border-[#e3d0ad] bg-[#fbf4e6] px-4 py-11 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#ad741d]">INTACH Pune Chapter</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-[#3a2719] sm:text-5xl">Heritage happens when we gather.</h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-7 text-[#6e5540] sm:text-lg">Discover walks, conversations and hands-on sessions that keep Pune’s living heritage close to its people.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-[#dec9a3] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#a2651b]">Plan your visit</p>
            <h2 className="mt-1 font-serif text-3xl text-[#442d1d]">Upcoming events</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="event-category">Filter events</label>
            <select id="event-category" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-[#d9c29d] bg-[#fffaf0] px-3 py-2.5 font-sans text-sm text-[#5e442f] outline-none focus:ring-2 focus:ring-[#d39834]">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="flex rounded-lg border border-[#d9c29d] bg-[#fffaf0] p-1" aria-label="Choose event view">
              <button onClick={() => setView("calendar")} aria-pressed={view === "calendar"} className={`flex items-center gap-2 rounded-md px-3 py-2 font-sans text-sm font-bold ${view === "calendar" ? "bg-[#ad741d] text-white" : "text-[#765b42]"}`}><Icon name="calendar" className="h-4 w-4" /><span>Calendar</span></button>
              <button onClick={() => setView("list")} aria-pressed={view === "list"} className={`flex items-center gap-2 rounded-md px-3 py-2 font-sans text-sm font-bold ${view === "list" ? "bg-[#ad741d] text-white" : "text-[#765b42]"}`}><Icon name="list" className="h-4 w-4" /><span>List</span></button>
            </div>
          </div>
        </div>

        {view === "calendar" ? (
          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
            <section className="overflow-hidden rounded-2xl border border-[#dfcda8] bg-[#fffaf0] shadow-[0_10px_28px_rgba(96,69,30,0.08)]">
              <div className="flex items-center justify-between border-b border-[#eadcc2] px-5 py-4 sm:px-7"><button onClick={() => changeMonth(-1)} className="font-sans text-sm font-bold text-[#9c6719]" aria-label="Previous month">←</button><h3 className="font-serif text-2xl text-[#422b1b]">{monthName} {calendarYear}</h3><button onClick={() => changeMonth(1)} className="font-sans text-sm font-bold text-[#9c6719]" aria-label="Next month">→</button></div>
              <div className="grid grid-cols-7 border-b border-[#eadcc2] bg-[#faf1e1] px-2 sm:px-4">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="py-3 text-center font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#8d7256] sm:text-xs">{day}</div>)}</div>
              <div className="grid grid-cols-7 p-2 sm:p-4">
                {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`} className="min-h-[68px] border-b border-r border-[#f0e5d2] sm:min-h-[94px]" />)}
                {days.map((day) => {
                  const dayEvents = calendarEvents.filter((event) => event.date === day);
                  const active = selectedDate === day;
                  const today = calendarYear === 2026 && calendarMonth === 6 && day === 19;
                  return <button key={day} onClick={() => setSelectedDate(day)} className={`min-h-[68px] border-b border-r border-[#f0e5d2] p-1 text-left transition hover:bg-[#fff6e8] sm:min-h-[94px] sm:p-2 ${active ? "bg-[#fcf0d8]" : ""}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full font-sans text-xs ${today ? "bg-[#a96918] font-bold text-white" : "text-[#604833]"}`}>{day}</span>{dayEvents.map((event) => <span key={event.id} className={`mt-1 block truncate rounded px-1 py-0.5 font-sans text-[8px] font-bold sm:text-[10px] calendar-${event.color}`}>{event.title}</span>)}</button>;
                })}
              </div>
            </section>
            <aside className="rounded-2xl border border-[#dfcda8] bg-[#fffaf0] p-5 shadow-[0_10px_28px_rgba(96,69,30,0.08)] sm:p-6">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#a2651b]">{calendarYear === 2026 && calendarMonth === 6 && selectedDate === 19 ? "Today · " : ""}{monthName} {selectedDate}</p>
              <h3 className="mt-1 font-serif text-2xl text-[#442d1d]">On this day</h3>
              <div className="mt-5 space-y-4">{selectedEvents.length ? selectedEvents.map((event) => <EventCard key={event.id} event={event} compact onRegister={register} onRevoke={revoke} registered={registeredIds.includes(event.id)} />) : <p className="rounded-xl bg-[#faf1e1] p-4 font-body text-sm leading-6 text-[#795f47]">No matching events today. Pick another highlighted date, or browse the full list.</p>}</div>
            </aside>
          </div>
        ) : (
          <section className="mt-7 space-y-4">{shownEvents.map((event) => <EventCard key={event.id} event={event} onRegister={register} onRevoke={revoke} registered={registeredIds.includes(event.id)} />)}</section>
        )}

        <section className="mt-14 border-t border-[#dec9a3] pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#a2651b]">Your journey with us</p>
              <h2 className="mt-1 font-serif text-3xl text-[#442d1d]">Your event history</h2>
              <p className="mt-2 font-body text-[#755d48]">Events you attended or registered for in the past.</p>
            </div>
            <span className="font-sans text-sm text-[#7d634b]">{userEventHistory.length} past events</span>
          </div>
          <div className="mt-6 space-y-3">{userEventHistory.map((event) => <HistoryCard key={event.id} event={event} />)}</div>
        </section>
      </section>
    </main>
  );
}
