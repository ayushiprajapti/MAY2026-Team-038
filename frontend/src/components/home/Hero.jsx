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
                className="px-6 py-3.5 bg-heritage-red hover:bg-[#722111] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 text-[#FFFDF9] rounded font-medium shadow transition-all duration-300 text-base"
              >
                Book Heritage Walks
              </a>
              <a
                href="#pillars"
                className="px-6 py-3.5 bg-heritage-cream-dark hover:bg-[#ecdca6] hover:border-heritage-charcoal hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 text-heritage-espresso border border-heritage-border rounded font-medium transition-all duration-300 text-base"
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
          <div className="lg:col-span-4 hidden lg:block relative select-none">
            {/* Background offset card (dark cream shadow layer) */}
            <div className="absolute inset-0 bg-heritage-cream-dark/50 border border-heritage-border rounded transform translate-x-2.5 translate-y-3 -rotate-2" />
            
            {/* Foreground main card (light cream) */}
            <div className="relative p-6 sm:p-7 rounded bg-heritage-cream-light border border-heritage-border shadow-sm rotate-1 hover:rotate-0 transition-transform duration-350 text-left">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-heritage-bronze block mb-1">
                Digital Gateway
              </span>
              <h3 className="font-serif text-lg font-bold text-heritage-espresso leading-snug mb-2">
                Active Chapter Schedule
              </h3>
              <p className="text-[12px] text-heritage-charcoal/80 leading-normal mb-4">
                We are transitioning from telephone coordinator logs to this digital gateway.
              </p>

              {/* Mini Interactive Event List */}
              <div className="border-t border-heritage-border/30 pt-4 mb-4 space-y-3.5">
                {/* Event 1 */}
                <div className="flex items-start gap-3">
                  <div className="px-2 py-1 rounded bg-heritage-red/10 text-heritage-red text-center shrink-0">
                    <span className="block text-[10px] font-bold leading-none font-mono">12</span>
                    <span className="block text-[8px] uppercase tracking-wider font-mono">Jul</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-semibold text-heritage-espresso font-sans leading-tight">Kasba Peth Walk</h4>
                    <span className="text-[10px] text-heritage-red font-mono font-medium">9 slots remaining</span>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex items-start gap-3">
                  <div className="px-2 py-1 rounded bg-heritage-bronze/10 text-heritage-bronze text-center shrink-0">
                    <span className="block text-[10px] font-bold leading-none font-mono">19</span>
                    <span className="block text-[8px] uppercase tracking-wider font-mono">Jul</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-semibold text-heritage-espresso font-sans leading-tight">Tambat Craft Masterclass</h4>
                    <span className="text-[10px] text-heritage-bronze font-mono font-medium">5 slots remaining</span>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex items-start gap-3">
                  <div className="px-2 py-1 rounded bg-heritage-green/10 text-heritage-green text-center shrink-0">
                    <span className="block text-[10px] font-bold leading-none font-mono">26</span>
                    <span className="block text-[8px] uppercase tracking-wider font-mono">Jul</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-semibold text-heritage-espresso font-sans leading-tight">Mutha Riverbank Hike</h4>
                    <span className="text-[10px] text-heritage-green font-mono font-medium">Registration open</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <a
                href="#get-involved"
                className="flex items-center justify-between text-xs font-mono text-heritage-red font-semibold pt-2 border-t border-heritage-border/20 transition-all duration-200 group"
              >
                <span className="relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-heritage-red after:transition-all after:duration-300 group-hover:after:w-full">
                  View Trails Map
                </span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
