import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { events } from "../data/events";

const demoRegistrations = [
  { eventId: 1, firstName: "Aarav", lastName: "Kulkarni", email: "aarav.kulkarni@example.com", phone: "+91 98765 43210", attendees: "2", note: "Interested in the architectural history of Shaniwar Wada." },
  { eventId: 1, firstName: "Meera", lastName: "Deshpande", email: "meera.deshpande@example.com", phone: "+91 98220 11452", attendees: "1", note: "" },
  { eventId: 1, firstName: "Rohan", lastName: "Patil", email: "rohan.patil@example.com", phone: "+91 98901 66741", attendees: "3", note: "Bringing two family members." },
];

export default function AdminEvents() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventList, setEventList] = useState(() => {
    const savedEvents = JSON.parse(localStorage.getItem("intach-admin-events") || "null");
    return savedEvents ? [...savedEvents, ...events.filter((event) => !savedEvents.some((savedEvent) => savedEvent.id === event.id))] : events;
  });
  const registrations = useMemo(() => [...demoRegistrations, ...JSON.parse(localStorage.getItem("intach-event-registrations") || "[]")], []);
  const getEventStatus = (event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(2026, event.monthIndex, event.date);
    if (eventDate.getTime() === today.getTime()) return "ongoing";
    return eventDate < today ? "completed" : "upcoming";
  };
  const filteredEvents = eventList.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || event.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (statusFilter === "all" || getEventStatus(event) === statusFilter);
  });
  const selectedEvent = eventList.find((event) => event.id === selectedId);
  const attendees = selectedEvent ? registrations.filter((registration) => registration.eventId === selectedEvent.id) : [];
  const deleteEvent = (event) => {
    if (!window.confirm(`Delete “${event.title}”? This cannot be undone.`)) return;
    const nextEvents = eventList.filter((item) => item.id !== event.id);
    localStorage.setItem("intach-admin-events", JSON.stringify(nextEvents));
    setEventList(nextEvents);
    setSelectedId(null);
  };

  return (
    <main className="min-h-screen bg-[#f7eddc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/admin" className="font-sans text-sm font-bold text-[#9c6719] hover:text-[#74460d]">Back to dashboard</Link>
        <div className="mt-5 flex flex-col justify-between gap-5 border-b border-[#dec9a3] pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#a2651b]">Coordinator workspace</p>
            <h1 className="mt-2 font-serif text-4xl text-[#422b1b]">Events</h1>
            <p className="mt-2 font-body text-[#755d48]">Select an event to view its registered users.</p>
          </div>
          <Link to="/admin/events/create" className="rounded-lg bg-[#b87519] px-4 py-2.5 text-center font-sans text-sm font-bold text-white transition hover:bg-[#925a0e]">Add event</Link>
        </div>

        {!selectedEvent ? (
          <section className="mt-7 overflow-hidden rounded-2xl border border-[#dfcda8] bg-[#fffaf0] shadow-[0_10px_28px_rgba(96,69,30,0.08)]">
            <div className="border-b border-[#eadcc2] p-5 sm:p-6">
              <h2 className="font-serif text-2xl text-[#422b1b]">All events</h2>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events" className="mt-4 w-full rounded-lg border border-[#d9c29d] bg-[#fffdf8] px-3 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-[#d39834]" />
              <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter events by status">
                {["all", "upcoming", "ongoing", "completed"].map((status) => <button key={status} onClick={() => setStatusFilter(status)} aria-pressed={statusFilter === status} className={`rounded-full px-3 py-2 font-sans text-xs font-bold capitalize transition ${statusFilter === status ? "bg-[#ad741d] text-white" : "border border-[#d9c29d] bg-[#fffdf8] text-[#755d48] hover:bg-[#f8ead0]"}`}>{status === "all" ? "All events" : `${status[0].toUpperCase()}${status.slice(1)}`}</button>)}
              </div>
            </div>
            <div className="divide-y divide-[#eadcc2]">
              {filteredEvents.map((event) => {
                const count = registrations.filter((registration) => registration.eventId === event.id).length;
                const isSelected = event.id === selectedId;
                return (
                  <article key={event.id} className={`flex flex-col gap-4 p-5 transition hover:bg-[#fff7e9] sm:flex-row sm:items-center sm:justify-between sm:p-6 ${isSelected ? "bg-[#fcf0d8]" : ""}`}>
                    <button onClick={() => setSelectedId(event.id)} aria-pressed={isSelected} className="min-w-0 text-left">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#a2651b]">{event.month} {event.date} · {event.category}</span>
                      <strong className="mt-1 block font-serif text-lg text-[#422b1b]">{event.title}</strong>
                      <span className="mt-1 block font-sans text-sm text-[#755d48]">{event.time} · {event.place}</span>
                    </button>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end"><span className={`shrink-0 rounded-full px-3 py-1.5 font-sans text-xs font-bold capitalize ${getEventStatus(event) === "completed" ? "bg-[#ece7df] text-[#6d6258]" : getEventStatus(event) === "ongoing" ? "bg-[#e2ebd5] text-[#526348]" : "bg-[#f3e1ba] text-[#80500f]"}`}>{getEventStatus(event)}</span><span className="shrink-0 rounded-full bg-[#f3e1ba] px-3 py-1.5 font-sans text-xs font-bold text-[#80500f]">{count} registered</span><button onClick={() => navigate("/admin/events/create", { state: { event } })} className="rounded-lg border border-[#b87519] px-3 py-2 font-sans text-xs font-bold text-[#925a0e] transition hover:bg-[#f8ead0]">Edit</button><button onClick={() => deleteEvent(event)} className="rounded-lg border border-[#9b4428] px-3 py-2 font-sans text-xs font-bold text-[#9b4428] transition hover:bg-[#f8e4d9]">Delete</button></div>
                  </article>
                );
              })}
              {!filteredEvents.length && <p className="p-6 font-body text-[#755d48]">No {statusFilter === "all" ? "events" : statusFilter} events match your search.</p>}
            </div>
          </section>
        ) : (
          <section className="mt-7 rounded-2xl border border-[#dfcda8] bg-[#fffaf0] shadow-[0_10px_28px_rgba(96,69,30,0.08)]">
            <div className="border-b border-[#eadcc2] p-6 sm:p-8">
              <button onClick={() => setSelectedId(null)} className="font-sans text-sm font-bold text-[#9c6719] hover:text-[#74460d]">← All events</button>
              <p className="mt-6 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#a2651b]">{selectedEvent.month} {selectedEvent.date} · {selectedEvent.time}</p>
              <h2 className="mt-2 font-serif text-3xl leading-tight text-[#422b1b] sm:text-4xl">{selectedEvent.title}</h2>
              <p className="mt-3 font-sans text-base text-[#755d48]">{selectedEvent.place}</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#a2651b]">Participant list</p><h3 className="mt-1 font-serif text-2xl text-[#422b1b]">Registered users <span className="font-sans text-base font-normal text-[#7d634b]">({attendees.length})</span></h3></div></div>
              {attendees.length ? <div className="mt-6 space-y-4">{attendees.map((person) => <article key={person.email} className="rounded-xl border border-[#eadcc2] bg-[#fffdf8] p-5"><p className="font-sans text-lg font-bold text-[#4f3523]">{person.firstName} {person.lastName}</p><p className="mt-3 font-sans text-sm text-[#755d48]">{person.email}</p><p className="mt-1 font-sans text-sm text-[#755d48]">{person.phone}</p><p className="mt-4 border-t border-[#eadcc2] pt-3 font-sans text-sm text-[#755d48]"><strong className="text-[#4f3523]">{person.attendees}</strong> attendee{person.attendees === "1" ? "" : "s"}</p>{person.note && <p className="mt-3 rounded-lg bg-[#faf1e1] p-3 font-sans text-sm leading-5 text-[#755d48]">{person.note}</p>}</article>)}</div> : <p className="mt-6 rounded-xl bg-[#faf1e1] p-5 font-body text-sm leading-6 text-[#795f47]">No one has registered for this event yet. Registrations submitted through the public event page will appear here.</p>}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
