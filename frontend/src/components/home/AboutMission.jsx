import shaniwarWada from "../../assets/home/shaniwar-wada.jpeg";

export default function AboutMission() {
  return (
    <section
      id="about"
      className="bg-heritage-cream-light py-20 sm:py-28 border-y border-heritage-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title above columns */}
        <div className="text-left mb-12 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-heritage-red font-semibold block mb-3">
            About the Movement
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-heritage-espresso leading-tight">
            Forty Years of Heritage Preservation
          </h2>
          <div className="w-16 h-1 bg-heritage-red rounded mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left Column: Image */}
          <div className="lg:col-span-5 text-left">
            <div className="relative rounded overflow-hidden shadow-md border border-heritage-border/30 group">
              <img
                src={shaniwarWada}
                alt="Shaniwar Wada Fort in Pune"
                className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-heritage-espresso/80 to-transparent p-4">
                <span className="text-xs font-mono text-heritage-cream uppercase tracking-wider block">
                  Historic Landmark
                </span>
                <span className="font-serif text-sm font-semibold text-[#FFFDF9] mt-0.5 block">
                  Shaniwar Wada Fort, Pune
                </span>
              </div>
            </div>
            <p className="font-serif text-base italic text-heritage-charcoal/70 leading-relaxed mt-4">
              "A society is defined not only by what it creates, but also by
              what it refuses to destroy."
            </p>
          </div>

          {/* Description & Mission Pillars Column */}
          <div className="lg:col-span-7 text-left space-y-8 sm:space-y-12">
            {/* National Movement Detail */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-heritage-espresso">
                The National Context
              </h3>
              <p className="font-sans text-base sm:text-lg text-heritage-charcoal leading-relaxed">
                INTACH (Indian National Trust for Art and Cultural Heritage) is
                a premier national NGO founded in 1984, dedicated to heritage
                conservation across India. It works through a vast network of
                local chapters. In 1986, the Pune Chapter was established,
                embarking on four decades of active work in the city.
              </p>
            </div>

            {/* Core Mission Statement */}
            <div className="bg-[#F9EBD4] p-6 sm:p-8 rounded border border-heritage-border/40 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-heritage-red" />
              <h3 className="font-serif text-xl font-bold text-heritage-espresso mb-3">
                Our Core Mission
              </h3>
              <p className="font-sans text-base text-heritage-charcoal leading-relaxed">
                We believe in preserving the identity of Pune by documenting,
                protecting, and raising public awareness around the city's built
                heritage, natural ecosystems, and living artisanal crafts. Our
                efforts connect the past to future generations, reinforcing
                local pride and civic identity.
              </p>
            </div>

            {/* Quote Block / Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-heritage-espresso mb-2">
                  Documenting the Past
                </h4>
                <p className="text-sm text-heritage-charcoal/80 leading-relaxed">
                  Rigorous listing and surveying of architectural landmarks,
                  local rivers, and ancient artisan lanes to create an
                  authoritative archive of Pune's historical timeline.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-heritage-espresso mb-2">
                  Protecting the Future
                </h4>
                <p className="text-sm text-heritage-charcoal/80 leading-relaxed">
                  Engaging in legal defense, public advocacy, and hands-on
                  conservation workshops to ensure our natural and architectural
                  treasures survive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
