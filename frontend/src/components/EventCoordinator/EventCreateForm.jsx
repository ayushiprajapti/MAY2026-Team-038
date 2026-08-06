import { useState } from "react";
import eventIllustration from "../../assets/event-illustration.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { create, update } from "../../api/events";
import { ApiError } from "../../api/client";

const EVENT_TYPES = [
  { value: "heritage_walk", label: "Heritage Walk" },
  { value: "workshop", label: "Workshop" },
  { value: "quiz", label: "Quiz" },
  { value: "competition", label: "Competition" },
  { value: "cultural_event", label: "Cultural Event" },
];

// Backend times are "HH:MM:SS" or "HH:MM" — <input type="time"> wants "HH:MM".
function toInputTime(timeStr) {
  if (!timeStr) return "";
  return timeStr.slice(0, 5);
}

export default function EventCreateForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const eventToEdit = state?.event;
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveEvent = async (formEvent) => {
    formEvent.preventDefault();
    setError("");

    const form = new FormData(formEvent.currentTarget);
    const registrationDeadlineRaw = form.get("registrationDeadline");

    const payload = {
      title: form.get("title"),
      event_date: form.get("date"),
      start_time: form.get("startTime") || null,
      end_time: form.get("endTime") || null,
      venue: form.get("venue") || null,
      participant_limit: Number(form.get("limit")),
      registration_deadline: registrationDeadlineRaw ? new Date(registrationDeadlineRaw).toISOString() : null,
      event_type: form.get("category"),
      description: form.get("description") || null,
    };

    setIsSubmitting(true);
    try {
      if (eventToEdit) {
        await update(eventToEdit.id, payload);
      } else {
        if (!payload.start_time) {
          setError("Start time is required for a new event.");
          setIsSubmitting(false);
          return;
        }
        await create(payload);
      }
      navigate("/admin/events");
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 border-b border-[#D7C3A8] pb-6 text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A26B1D]">
            Event management
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium leading-tight tracking-tight text-[#7F1D1D] sm:text-5xl">
            {eventToEdit ? "Edit Heritage Event" : "Create Heritage Event"}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#5F4631] sm:text-lg">
            Organize and promote heritage events for volunteers, visitors, and local communities.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded font-sans">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
          <aside className="heritage-card hidden rounded-xl p-6 lg:block">
            <img
              src={eventIllustration}
              alt="Event planning illustration"
              className="mx-auto h-auto w-full max-w-[170px] object-contain"
            />
            <p className="mt-5 text-center text-sm leading-6 text-[#5F4631]">
              Plan walks, workshops, talks, and community heritage activities.
            </p>
          </aside>

          <div className="heritage-card rounded-xl p-4 sm:p-6 lg:p-8">
            <form className="space-y-5" onSubmit={saveEvent}>

              <label className="block text-sm font-semibold text-[#4B3328]">
                Event Title
                <input
                  required
                  name="title"
                  type="text"
                  defaultValue={eventToEdit?.title}
                  placeholder="Enter event title"
                  className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </label>

              <label className="block text-sm font-semibold text-[#4B3328]">
                Event Date
                <input
                  required
                  name="date"
                  type="date"
                  defaultValue={eventToEdit?.event_date}
                  className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-[#4B3328]">
                  Start Time
                  <input
                    name="startTime"
                    type="time"
                    defaultValue={toInputTime(eventToEdit?.start_time)}
                    className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </label>
                <label className="text-sm font-semibold text-[#4B3328]">
                  End Time
                  <input
                    name="endTime"
                    type="time"
                    defaultValue={toInputTime(eventToEdit?.end_time)}
                    className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold text-[#4B3328]">
                Venue
                <input
                  name="venue"
                  type="text"
                  defaultValue={eventToEdit?.venue}
                  placeholder="Enter venue / location"
                  className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </label>

              <label className="block text-sm font-semibold text-[#4B3328]">
                Participant Limit
                <input
                  required
                  name="limit"
                  type="number"
                  min="1"
                  defaultValue={eventToEdit?.participant_limit}
                  placeholder="Enter maximum participants"
                  className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-[#4B3328]">
                  Registration Deadline{" "}
                  {eventToEdit && <span className="font-normal">(optional)</span>}
                  <input
                    required={!eventToEdit}
                    name="registrationDeadline"
                    type="datetime-local"
                    className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </label>
                <label className="text-sm font-semibold text-[#4B3328]">
                  Category
                  <select
                    name="category"
                    defaultValue={eventToEdit?.event_type || "heritage_walk"}
                    className="mt-1 w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm font-semibold text-[#4B3328]">
                Event Description{" "}
                {eventToEdit && <span className="font-normal">(optional)</span>}
                <textarea
                  required={!eventToEdit}
                  name="description"
                  rows="4"
                  defaultValue={eventToEdit?.description}
                  placeholder="Describe the event..."
                  className="mt-1 w-full resize-y rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Link
                  to="/admin/events"
                  className="w-full rounded-lg border border-[#7F1D1D] px-6 py-2.5 text-center font-medium text-[#7F1D1D] transition hover:bg-[#F3E2C6] sm:w-auto"
                >
                  Back
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#C98716] px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-[#A96D0F] sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving…" : eventToEdit ? "Save changes" : "Publish Event"}
                </button>
              </div>

            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
