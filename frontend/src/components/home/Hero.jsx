export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F9EBD4] pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      {/* Decorative Heritage Backdrop */}
      <div className="absolute inset-y-0 right-0 -z-10 w-full max-w-3xl opacity-10 lg:opacity-20 pointer-events-none">
        <svg
          className="h-full w-full stroke-heritage-red/40 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="heritage-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              x="100%"
              y="-1"
            >
              <path d="M.5 40V.5H40" fill="none" />
              <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-heritage-bronze" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#heritage-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 text-left">
            {/* Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-heritage-espresso leading-[1.1] mb-6">
              Protecting the Soul of <span className="text-heritage-red italic">Pune's</span> Heritage
            </h1>

            {/* Description */}
            <p className="font-sans text-lg sm:text-xl text-heritage-charcoal/90 leading-relaxed max-w-2xl mb-16">
              INTACH Pune is the local chapter of India's largest heritage conservation NGO, dedicated to documenting, protecting, and raising public awareness around Pune's built, natural, and living traditions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-10 sm:mt-14">
              <a
                href="#get-involved"
                className="px-6 py-3.5 bg-heritage-red hover:bg-heritage-red/90 text-[#FFFDF9] rounded font-medium shadow-md hover:shadow-lg transition-all duration-200 text-base"
              >
                Book Heritage Walks
              </a>
              <a
                href="#pillars"
                className="px-6 py-3.5 bg-heritage-cream-dark hover:bg-heritage-cream-dark/80 text-heritage-espresso border border-heritage-border rounded font-medium transition-all duration-200 text-base"
              >
                Learn Our Focus
              </a>
            </div>

            {/* Quick Metrics / Stats Overlay */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-heritage-border/40 max-w-xl">
              <div>
                <span className="block font-serif text-3xl font-bold text-heritage-red">1986</span>
                <span className="block text-xs font-mono uppercase tracking-wider text-heritage-charcoal/70 mt-1">
                  Pune Estd.
                </span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-bold text-heritage-green">3</span>
                <span className="block text-xs font-mono uppercase tracking-wider text-heritage-charcoal/70 mt-1">
                  Focus Pillars
                </span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-bold text-heritage-bronze">10+</span>
                <span className="block text-xs font-mono uppercase tracking-wider text-heritage-charcoal/70 mt-1">
                  Artisan Tribes
                </span>
              </div>
            </div>
          </div>

          {/* Asymmetric Graphical Hero Callout */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative p-8 rounded bg-heritage-cream-light border border-heritage-border shadow-md rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-heritage-red/5 rounded-full filter blur-xl -z-10" />
              <span className="font-serif text-xs uppercase tracking-widest text-heritage-bronze font-semibold block mb-2">
                Digital Gateway
              </span>
              <h3 className="font-serif text-xl font-bold text-heritage-espresso mb-4 leading-snug">
                Opening up our conservation work online.
              </h3>
              <p className="text-sm text-heritage-charcoal/80 leading-relaxed mb-6">
                All booking records, heritage lists, artisan workshops, and shop purchases are moving from emails and phone logs to this interactive platform.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-heritage-red font-semibold">
                <span>View upcoming schedule</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
