import eventIllustration from "../../assets/event-illustration.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { events } from "../../data/events";

// Shared version of the original EventPage creation form, used by admins.
export default function EventCreateForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const eventToEdit = state?.event;
  const dateValue = eventToEdit ? `2026-${String(eventToEdit.monthIndex + 1).padStart(2, "0")}-${String(eventToEdit.date).padStart(2, "0")}` : "";
  const saveEvent = (formEvent) => {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    const date = new Date(`${form.get("date")}T00:00:00`);
    const currentEvents = JSON.parse(localStorage.getItem("intach-admin-events") || "null") || events;
    const eventId = eventToEdit?.id || Math.max(0, ...currentEvents.map((event) => event.id)) + 1;
    const nextEvent = { id: eventId, date: date.getDate(), month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(), monthIndex: date.getMonth(), title: form.get("title"), category: form.get("category"), time: form.get("time") || eventToEdit?.time || "Time to be confirmed", place: form.get("venue"), seats: `${form.get("limit")} seats available`, color: eventToEdit?.color || "ochre" };
    const nextEvents = eventToEdit ? currentEvents.map((event) => event.id === eventId ? nextEvent : event) : [...currentEvents, nextEvent];
    localStorage.setItem("intach-admin-events", JSON.stringify(nextEvents));
    navigate("/admin/events");
  };

  return (
    <main className="heritage-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 border-b border-[#D7C3A8] pb-6 text-left"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A26B1D]">Event management</p><h1 className="mt-2 font-serif text-4xl font-medium leading-tight tracking-tight text-[#7F1D1D] sm:text-5xl">{eventToEdit ? "Edit Heritage Event" : "Create Heritage Event"}</h1><p className="mt-3 max-w-3xl text-base leading-7 text-[#5F4631] sm:text-lg">Organize and promote heritage events for volunteers, visitors, and local communities.</p></header>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
          <aside className="heritage-card hidden rounded-xl p-6 lg:block"><img src={eventIllustration} alt="Event planning illustration" className="mx-auto h-auto w-full max-w-[170px] object-contain" /><p className="mt-5 text-center text-sm leading-6 text-[#5F4631]">Plan walks, workshops, talks, and community heritage activities.</p></aside>
          <div className="heritage-card rounded-xl p-4 sm:p-6 lg:p-8"><form className="space-y-5" onSubmit={saveEvent}>
            <label className="block text-sm font-semibold text-[#4B3328]">Event Title<input required name="title" type="text" defaultValue={eventToEdit?.title} placeholder="Enter event title" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-[#4B3328]">Event Date<input required name="date" type="date" defaultValue={dateValue} className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label><label className="text-sm font-semibold text-[#4B3328]">Event Time<input name="time" type="time" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label></div>
            <label className="block text-sm font-semibold text-[#4B3328]">Venue<input required name="venue" type="text" defaultValue={eventToEdit?.place} placeholder="Enter venue / location" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label>
            <label className="block text-sm font-semibold text-[#4B3328]">Participant Limit<input required name="limit" type="number" min="1" defaultValue={eventToEdit?.seats?.match(/\d+/)?.[0]} placeholder="Enter maximum participants" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-[#4B3328]">Registration Deadline {eventToEdit && <span className="font-normal">(optional)</span>}<input required={!eventToEdit} type="datetime-local" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label><label className="text-sm font-semibold text-[#4B3328]">Category<select name="category" defaultValue={eventToEdit?.category || "Heritage Walk"} className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"><option>Heritage Walk</option><option>Workshop</option><option>Heritage Talk</option><option>Volunteer Day</option><option>Seminar</option><option>Exhibition</option><option>Awareness Drive</option></select></label></div>
            <label className="block text-sm font-semibold text-[#4B3328]">Event Description {eventToEdit && <span className="font-normal">(optional)</span>}<textarea required={!eventToEdit} rows="4" placeholder="Describe the event..." className="mt-1 w-full resize-y rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><Link to="/admin/events" className="w-full rounded-lg border border-[#7F1D1D] px-6 py-2.5 text-center font-medium text-[#7F1D1D] transition hover:bg-[#F3E2C6] sm:w-auto">Back</Link><button type="submit" className="w-full rounded-lg bg-[#C98716] px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-[#A96D0F] sm:w-auto">{eventToEdit ? "Save changes" : "Publish Event"}</button></div>
          </form></div>
        </section>
      </div>
    </main>
  );
}
