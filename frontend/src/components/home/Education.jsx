export default function Education() {
  return (
    <section id="education" className="bg-[#F9EBD4] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-heritage-red font-semibold">
            Nurturing Young Minds
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-heritage-espresso mt-3 mb-6">
            For Schools & Students
          </h2>
          <p className="text-base sm:text-lg text-heritage-charcoal/80 leading-relaxed">
            We actively collaborate with schools, educators, and children across Pune to cultivate a deep curiosity for historical and biological preservation.
          </p>
        </div>

        {/* Dual Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Card 1: Heritage Quiz */}
          <div className="flex flex-col p-8 sm:p-10 rounded border border-heritage-border/30 bg-heritage-cream-light text-left relative hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-heritage-red/5 rounded-full filter blur-xl -z-10" />
            
            <span className="text-xs font-mono uppercase tracking-widest text-heritage-red font-semibold block mb-1">
              Annual Event
            </span>
            <h3 className="font-serif text-2xl font-bold text-heritage-espresso mb-4">
              The National Heritage Quiz
            </h3>
            <p className="text-sm sm:text-base text-heritage-charcoal/90 leading-relaxed mb-6 flex-grow">
              India's largest school quiz dedicated to history, architecture, environment, and culture. We conduct the regional Pune chapter rounds, drawing teams from dozens of local schools to compete for state and national titles.
            </p>

            <div className="border-t border-heritage-border/20 pt-6">
              <span className="text-xs font-mono text-heritage-charcoal/60 uppercase block mb-2">
                Participants:
              </span>
              <p className="text-xs sm:text-sm text-heritage-charcoal/85">
                Middle and High School students (Grades 7–10). Quiz questions range from local Maratha history to ancient Indian civilizations and biological conservation.
              </p>
            </div>
          </div>

          {/* Card 2: Young INTACH Clubs */}
          <div className="flex flex-col p-8 sm:p-10 rounded border border-heritage-border/30 bg-heritage-cream-light text-left relative hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-heritage-green/5 rounded-full filter blur-xl -z-10" />

            <span className="text-xs font-mono uppercase tracking-widest text-heritage-green font-semibold block mb-1">
              Year-Round Clubs
            </span>
            <h3 className="font-serif text-2xl font-bold text-heritage-espresso mb-4">
              Young INTACH Heritage Clubs
            </h3>
            <p className="text-sm sm:text-base text-heritage-charcoal/90 leading-relaxed mb-6 flex-grow">
              We help schools set up structured heritage clubs, giving kids an active framework to observe local history. Club members receive quarterly magazines, worksheets, and participate in special field trips led by chapter experts.
            </p>

            <div className="border-t border-heritage-border/20 pt-6">
              <span className="text-xs font-mono text-heritage-charcoal/60 uppercase block mb-2">
                Club Activities:
              </span>
              <p className="text-xs sm:text-sm text-heritage-charcoal/85">
                Compiling family histories, sketching old houses, taking schoolyard heritage tree counts, and volunteering at neighborhood cleanup drives.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
