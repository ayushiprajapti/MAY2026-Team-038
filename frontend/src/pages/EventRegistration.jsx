import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function DetailIcon({ children }) {
  return <span className="mt-0.5 text-[#af751d]">{children}</span>;
}

export default function EventRegistration() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event;
  const [submitted, setSubmitted] = useState(false);

  if (!event) {
    return <main className="min-h-[55vh] bg-[#f7eddc] px-4 py-16 text-center"><h1 className="font-serif text-3xl text-[#422b1b]">Choose an event to register</h1><p className="mt-3 font-body text-[#755d48]">Please select an event from the events calendar or list.</p><Link to="/events" className="mt-6 inline-block rounded-lg bg-[#b87519] px-5 py-3 font-sans text-sm font-bold text-white">Browse events</Link></main>;
  }

  if (submitted) {
    return <main className="min-h-[55vh] bg-[#f7eddc] px-4 py-16 sm:px-6"><section className="mx-auto max-w-xl rounded-2xl border border-[#b9c29f] bg-[#fffaf0] p-8 text-center shadow-[0_12px_32px_rgba(96,69,30,0.1)] sm:p-12"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7eedc] text-3xl text-[#526348]">✓</div><p className="mt-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#6c804f]">Registration complete</p><h1 className="mt-2 font-serif text-3xl text-[#422b1b]">You’re on the list.</h1><p className="mt-4 font-body leading-7 text-[#755d48]">Thank you for registering for <strong>{event.title}</strong>. We’ll send your event details to the email address you provided.</p><button onClick={() => navigate("/events")} className="mt-7 rounded-lg bg-[#b87519] px-5 py-3 font-sans text-sm font-bold text-white hover:bg-[#925a0e]">Back to events</button></section></main>;
  }

  return (
    <main className="min-h-screen bg-[#f7eddc] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/events" className="font-sans text-sm font-bold text-[#9c6719] hover:text-[#74460d]">← Back to events</Link>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)] lg:items-start">
          <section className="order-2 rounded-2xl border border-[#dfcda8] bg-[#fffaf0] p-5 shadow-[0_10px_28px_rgba(96,69,30,0.08)] sm:p-8 lg:order-1">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#a2651b]">Event registration</p>
            <h1 className="mt-2 font-serif text-3xl text-[#422b1b] sm:text-4xl">Reserve your place</h1>
            <p className="mt-3 font-body leading-7 text-[#755d48]">Fill in your details below. Fields marked with an asterisk are required.</p>
            <form onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); const ids = JSON.parse(localStorage.getItem("intach-registered-events") || "[]"); const registrations = JSON.parse(localStorage.getItem("intach-event-registrations") || "[]"); if (!ids.includes(event.id)) localStorage.setItem("intach-registered-events", JSON.stringify([...ids, event.id])); localStorage.setItem("intach-event-registrations", JSON.stringify([...registrations.filter((registration) => registration.eventId !== event.id), { eventId: event.id, firstName: form.get("firstName"), lastName: form.get("lastName"), email: form.get("email"), phone: form.get("phone"), attendees: form.get("attendees"), note: form.get("note") }])); setSubmitted(true); }} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2"><label className="font-sans text-sm font-bold text-[#533824]">First name *<input required name="firstName" autoComplete="given-name" className="mt-2 block w-full rounded-lg border border-[#d9c29d] bg-[#fffdf8] px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[#d39834]" /></label><label className="font-sans text-sm font-bold text-[#533824]">Last name *<input required name="lastName" autoComplete="family-name" className="mt-2 block w-full rounded-lg border border-[#d9c29d] bg-[#fffdf8] px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[#d39834]" /></label></div>
              <div className="grid gap-5 sm:grid-cols-2"><label className="font-sans text-sm font-bold text-[#533824]">Email address *<input required type="email" name="email" autoComplete="email" className="mt-2 block w-full rounded-lg border border-[#d9c29d] bg-[#fffdf8] px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[#d39834]" /></label><label className="font-sans text-sm font-bold text-[#533824]">Phone number *<input required type="tel" name="phone" autoComplete="tel" className="mt-2 block w-full rounded-lg border border-[#d9c29d] bg-[#fffdf8] px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[#d39834]" /></label></div>
              <label className="font-sans text-sm font-bold text-[#533824]">Number of attendees *<input required type="number" name="attendees" min="1" max="10" defaultValue="1" inputMode="numeric" className="mt-2 block w-full rounded-lg border border-[#d9c29d] bg-[#fffdf8] px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[#d39834]" /></label>
              <label className="font-sans text-sm font-bold text-[#533824]">Anything we should know? <span className="font-normal text-[#8b735e]">(optional)</span><textarea name="note" rows="3" placeholder="Accessibility needs, questions, or a note for the coordinator" className="mt-2 block w-full resize-y rounded-lg border border-[#d9c29d] bg-[#fffdf8] px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[#d39834]" /></label>
              <label className="flex items-center gap-3 font-sans text-sm leading-5 text-[#684f3a]">
                <input required type="checkbox" className="h-5 w-5 shrink-0 rounded border-[#b99667] accent-[#ad741d]" />
                <span>I agree to receive event-related updates from INTACH Pune.</span>
              </label>
              <div className="border-t border-[#eadcc2] pt-5"><button type="submit" className="w-full rounded-lg bg-[#b87519] px-5 py-3 font-sans text-sm font-bold text-white shadow-sm transition hover:bg-[#925a0e] focus:outline-none focus:ring-2 focus:ring-[#d39834] focus:ring-offset-2 sm:w-auto">Confirm registration</button></div>
            </form>
          </section>
          <aside className="order-1 rounded-2xl border border-[#dfcda8] bg-[#f9efd9] p-5 lg:sticky lg:top-24 lg:order-2">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#a2651b]">Your selected event</p><h2 className="mt-3 font-serif text-2xl leading-tight text-[#422b1b]">{event.title}</h2><span className="mt-4 inline-block rounded-full bg-[#f1d6c2] px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a4527]">{event.category}</span>
            <div className="mt-5 space-y-3 border-t border-[#e2cda9] pt-5 font-sans text-sm leading-5 text-[#6e5540]"><p className="flex gap-2"><DetailIcon>◷</DetailIcon><span><strong className="block text-[#4f3523]">{event.month} {event.date}</strong>{event.time}</span></p><p className="flex gap-2"><DetailIcon>⌖</DetailIcon><span><strong className="block text-[#4f3523]">Venue</strong>{event.place}</span></p><p className="flex gap-2"><DetailIcon>◉</DetailIcon><span>{event.seats}</span></p></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
