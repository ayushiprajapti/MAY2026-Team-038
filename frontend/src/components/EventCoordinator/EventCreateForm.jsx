import eventIllustration from "../../assets/event-illustration.png";
import { Link } from "react-router-dom";

// Shared version of the original EventPage creation form, used by admins.
export default function EventCreateForm() {
  return (
    <main className="heritage-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 border-b border-[#D7C3A8] pb-6 text-left"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A26B1D]">Event management</p><h1 className="mt-2 font-serif text-4xl font-medium leading-tight tracking-tight text-[#7F1D1D] sm:text-5xl">Create Heritage Event</h1><p className="mt-3 max-w-3xl text-base leading-7 text-[#5F4631] sm:text-lg">Organize and promote heritage events for volunteers, visitors, and local communities.</p></header>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
          <aside className="heritage-card hidden rounded-xl p-6 lg:block"><img src={eventIllustration} alt="Event planning illustration" className="mx-auto h-auto w-full max-w-[170px] object-contain" /><p className="mt-5 text-center text-sm leading-6 text-[#5F4631]">Plan walks, workshops, talks, and community heritage activities.</p></aside>
          <div className="heritage-card rounded-xl p-4 sm:p-6 lg:p-8"><form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
            <label className="block text-sm font-semibold text-[#4B3328]">Event Title<input required type="text" placeholder="Enter event title" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-[#4B3328]">Event Date<input required type="date" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label><label className="text-sm font-semibold text-[#4B3328]">Event Time<input required type="time" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label></div>
            <label className="block text-sm font-semibold text-[#4B3328]">Venue<input required type="text" placeholder="Enter venue / location" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label>
            <label className="block text-sm font-semibold text-[#4B3328]">Participant Limit<input required type="number" min="1" placeholder="Enter maximum participants" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-[#4B3328]">Registration Deadline<input required type="datetime-local" className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label><label className="text-sm font-semibold text-[#4B3328]">Category<select className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"><option>Heritage Walk</option><option>Workshop</option><option>Seminar</option><option>Exhibition</option><option>Awareness Drive</option><option>Volunteer Activity</option></select></label></div>
            <label className="block text-sm font-semibold text-[#4B3328]">Event Description<textarea required rows="4" placeholder="Describe the event..." className="mt-1 w-full resize-y rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]" /></label>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><Link to="/admin/events" className="w-full rounded-lg border border-[#7F1D1D] px-6 py-2.5 text-center font-medium text-[#7F1D1D] transition hover:bg-[#F3E2C6] sm:w-auto">Back</Link><button type="submit" className="w-full rounded-lg bg-[#C98716] px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-[#A96D0F] sm:w-auto">Publish Event</button></div>
          </form></div>
        </section>
      </div>
    </main>
  );
}
