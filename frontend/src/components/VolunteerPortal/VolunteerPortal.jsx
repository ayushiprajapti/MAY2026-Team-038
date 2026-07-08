import eventIllustration from "../../assets/volunteer-illustration.png";

export default function VolunteerPortal() {
  return (
    <main className="heritage-page px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 border-b border-[#D7C3A8] pb-6 text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A26B1D]">
            Heritage Survey
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium leading-tight tracking-tight text-[#7F1D1D] sm:text-5xl">
            Volunteer Portal
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#5F4631] sm:text-lg">
            Help preserve our heritage by submitting details of historical sites
            and monuments.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
          <aside className="heritage-card hidden rounded-xl p-6 lg:block">
            <img
              src={eventIllustration}
              alt="Heritage volunteer illustration"
              className="mx-auto h-auto w-full max-w-[180px] object-contain"
            />
            <p className="mt-5 text-center text-sm leading-6 text-[#5F4631]">
              Record local sites, stories, condition details, and photographs
              for review.
            </p>
          </aside>

          <div className="heritage-card rounded-xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 text-left sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#8B1E1E] text-sm font-bold text-[#FFF8EC]">
                FORM
              </div>
              <div>
                <h2 className="font-serif text-2xl font-medium leading-tight text-[#7F1D1D] sm:text-3xl">
                  Submit New Heritage Discovery
                </h2>
                <p className="mt-1 text-[#5F4631]">
                  Please provide accurate information about the monument or
                  heritage site.
                </p>
              </div>
            </div>

            <hr className="mb-6 border-[#D7C3A8]" />

            <form className="space-y-6 text-left">
              <div>
                <label className="mb-2 block font-semibold text-[#4B3328]">
                  1. Monument / Site Name
                </label>
                <input
                  type="text"
                  placeholder="Enter monument or site name"
                  className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-[#4B3328]">
                    2. GPS Coordinates
                  </label>
                  <input
                    type="text"
                    placeholder="18.5204, 73.8567"
                    className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                  <p className="mt-2 text-sm text-[#6B5947]">
                    Format: Latitude, Longitude
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-[#4B3328]">
                    3. Historical Significance
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the history, importance, architecture, or cultural value."
                    className="w-full resize-y rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-[#4B3328]">
                    4. Upload Landmark Photo
                  </label>
                  <div className="rounded-xl border-2 border-dashed border-[#D7C3A8] bg-[#FFF8EC] p-4 text-center sm:p-6">
                    <p className="font-medium text-[#4B3328]">Choose an image</p>
                    <p className="mb-4 text-sm text-[#6B5947]">JPG, PNG, WEBP</p>
                    <input
                      type="file"
                      className="block w-full cursor-pointer text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#C98716] file:px-4 file:py-2 file:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-[#4B3328]">
                    5. Type of Site
                  </label>
                  <select className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]">
                    <option>Select type</option>
                    <option>Temple</option>
                    <option>Fort</option>
                    <option>Museum</option>
                    <option>Monument</option>
                    <option>Lake</option>
                    <option>Stepwell</option>
                    <option>Colonial Building</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-[#4B3328]">
                    6. Approximate Era / Period
                  </label>
                  <select className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]">
                    <option>Select Era</option>
                    <option>Ancient</option>
                    <option>Medieval</option>
                    <option>Mughal Period</option>
                    <option>Maratha Period</option>
                    <option>British Colonial</option>
                    <option>Modern</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-[#4B3328]">
                    7. Current Condition
                  </label>
                  <select className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]">
                    <option>Select Condition</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Needs Restoration</option>
                    <option>Partially Damaged</option>
                    <option>Severely Damaged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#4B3328]">
                  8. Address / Location
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter the complete address or nearby landmark..."
                  className="w-full resize-y rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#4B3328]">
                  9. Additional Notes
                </label>
                <textarea
                  rows="4"
                  placeholder="Any extra observations or useful information..."
                  className="w-full resize-y rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-[#4B3328]">
                    10. Contact Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-[#4B3328]">
                    Contact Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full rounded-lg border border-[#D7C3A8] bg-[#FFF8EC] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#C9903F]"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-[#4B3328]">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0 accent-[#8B1E1E]"
                />
                <span>
                  I confirm that the information submitted is true to the best
                  of my knowledge and that the uploaded photograph is taken by
                  me or I have permission to use it.
                </span>
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="reset"
                  className="w-full rounded-lg border border-[#7F1D1D] px-6 py-3 font-medium text-[#7F1D1D] transition hover:bg-[#F3E2C6] sm:w-auto"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#C98716] px-6 py-3 font-medium text-white shadow-sm transition hover:bg-[#A96D0F] sm:w-auto"
                >
                  Submit Survey
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
