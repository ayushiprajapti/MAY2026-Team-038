export default function ThreePillars() {
  const pillars = [
    {
      id: "built",
      title: "Built & Architectural Heritage",
      accentColor: "text-heritage-red",
      borderColor: "border-heritage-red/20",
      bgColor: "bg-heritage-cream-light hover:bg-[#FFFDF9]",
      bannerBg: "bg-heritage-red/5",
      icon: (
        <svg className="h-8 w-8 text-heritage-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: "Listing and surveying historical structures to secure legislative protection and conservation actions.",
      bullets: [
        "Surveyed and listed hundreds of heritage structures in Pune.",
        "Lists officially adopted by Pune Municipal Corporation (PMC).",
        "Pioneering surveys in Mahabaleshwar, Panchgani, and Konkan Coast.",
      ],
      tag: "Architectural Preservation"
    },
    {
      id: "natural",
      title: "Natural Heritage",
      accentColor: "text-heritage-green",
      borderColor: "border-heritage-green/20",
      bgColor: "bg-heritage-cream-light hover:bg-[#FFFDF9]",
      bannerBg: "bg-heritage-green/5",
      icon: (
        <svg className="h-8 w-8 text-heritage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Protecting local eco-systems, waterways, and ancient botanical groves from urbanization.",
      bullets: [
        "Active advocacy and restoration plans for Pune's rivers.",
        "Documenting old-growth trees and Devrais (sacred groves).",
        "Environmental litigation before the National Green Tribunal (NGT).",
      ],
      tag: "Eco & Environment"
    },
    {
      id: "crafts",
      title: "Crafts & Intangible Heritage",
      accentColor: "text-heritage-bronze",
      borderColor: "border-heritage-bronze/20",
      bgColor: "bg-heritage-cream-light hover:bg-[#FFFDF9]",
      bannerBg: "bg-heritage-bronze/5",
      icon: (
        <svg className="h-8 w-8 text-heritage-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: "Supporting endangered artisan communities and ensuring their knowledge is passed on.",
      bullets: [
        "Documenting Tambat (coppersmiths) and Burud (bamboo weavers).",
        "Promoting Kumbhar (potters) and Manyar (bangle artisans).",
        "Hands-on craft learning workshops for public engagement.",
      ],
      tag: "Living Culture"
    }
  ];

  return (
    <section id="pillars" className="bg-[#F9EBD4] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-heritage-red font-semibold">
            What We Focus On
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-heritage-espresso mt-3 mb-6">
            The Three Focus Areas
          </h2>
          <p className="text-base sm:text-lg text-heritage-charcoal/80 leading-relaxed">
            Our work spans across architectural listing, ecological action, and documentation of local artisan guilds to protect Pune's complete history.
          </p>
        </div>

        {/* Pillars Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className={`flex flex-col rounded border ${pillar.borderColor} ${pillar.bgColor} shadow-sm hover:shadow-md transition-all duration-300 p-8 text-left group`}
            >
              {/* Header Box */}
              <div className="mb-6 text-left">
                <span className={`text-xs font-mono tracking-wider font-semibold uppercase ${pillar.accentColor}`}>
                  {pillar.tag}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-espresso mt-1">
                  {pillar.title}
                </h3>
              </div>

              {/* Main Blurb */}
              <p className="text-sm text-heritage-charcoal/90 leading-relaxed mb-8 flex-grow">
                {pillar.description}
              </p>

              {/* Specific Bullet Points */}
              <div className="border-t border-heritage-border/30 pt-6">
                <span className="text-xs font-mono uppercase tracking-widest text-heritage-charcoal/50 block mb-4">
                  Key Achievements & Initiatives
                </span>
                <ul className="space-y-3.5">
                  {pillar.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-heritage-charcoal/80">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${pillar.accentColor.replace("text-", "bg-")}`} />
                      <span className="leading-normal">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
