import eventIllustration from "../../assets/event-illustration.png";

export default function EventCoordinator() {
  return (
    <main className="heritage-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 border-b border-[#D7C3A8] pb-6 text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A26B1D]">
            Event Registration
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium leading-tight tracking-tight text-[#7F1D1D] sm:text-5xl">
            Create Heritage Event
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#5F4631] sm:text-lg">
            Organize and promote heritage events for volunteers, visitors, and
            local communities.
          </p>
        </header>

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
            <form className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#4B3328]">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="Enter event title"
                  className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#4B3328]">
                    Event Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#4B3328]">
                    Event Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#4B3328]">
                  Venue
                </label>
                <input
                  type="text"
                  placeholder="Enter venue / location"
                  className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#4B3328]">
                  Participant Limit
                </label>
                <input
                  type="number"
                  placeholder="Enter maximum participants"
                  className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#4B3328]">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#4B3328]">
                    Category
                  </label>
                  <select className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]">
                    <option>Heritage Walk</option>
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Exhibition</option>
                    <option>Awareness Drive</option>
                    <option>Volunteer Activity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#4B3328]">
                  Event Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe the event..."
                  className="w-full resize-y rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="reset"
                  className="w-full rounded-lg border border-[#7F1D1D] px-6 py-2.5 font-medium text-[#7F1D1D] transition hover:bg-[#F3E2C6] sm:w-auto"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#C98716] px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-[#A96D0F] sm:w-auto"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
