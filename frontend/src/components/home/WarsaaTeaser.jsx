export default function WarsaaTeaser() {
  const products = [
    {
      name: "Handcrafted Copper Carafe",
      category: "Tambat Metalware",
      price: "₹1,850",
      description: "Directly beaten and shaped by Pune's traditional coppersmiths using centuries-old techniques.",
      icon: (
        <div className="w-full h-40 bg-heritage-bronze/10 rounded flex items-center justify-center border border-heritage-bronze/15">
          <svg className="h-16 w-16 text-heritage-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    },
    {
      name: "Pune Heritage Map",
      category: "Publications",
      price: "₹120",
      description: "A meticulously illustrated foldout guide mapping historical Peshwa wadas, shrines, and old lanes.",
      icon: (
        <div className="w-full h-40 bg-heritage-red/10 rounded flex items-center justify-center border border-heritage-red/15">
          <svg className="h-16 w-16 text-heritage-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
      )
    },
    {
      name: '"Pune, Queen of the Deccan"',
      category: "Books",
      price: "₹650",
      description: "The definitive historical compilation detailing Pune's urban growth, climate, and architectural legacy.",
      icon: (
        <div className="w-full h-40 bg-heritage-green/10 rounded flex items-center justify-center border border-heritage-green/15">
          <svg className="h-16 w-16 text-heritage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <section id="warsaa" className="bg-heritage-cream-light py-20 sm:py-28 border-y border-heritage-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start mb-16">
          
          <div className="lg:col-span-5 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-heritage-red font-semibold block mb-3">
              Warsaa Shop
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-heritage-espresso leading-tight mb-6">
              Supporting Pune's Artisan Guilds
            </h2>
            <p className="text-base text-heritage-charcoal leading-relaxed">
              Located at the historic Shaniwar Wada fortress, **Warsaa — The Heritage Shop** is INTACH Pune's retail arm. Every purchase directly sustains traditional crafts, funding artisan livelihood development and chapter preservation programs.
            </p>
            <div className="mt-8 p-4 rounded bg-[#F9EBD4] border border-heritage-border/40">
              <h4 className="font-serif font-bold text-heritage-espresso mb-1 text-sm">
                Visit Us at Shaniwar Wada
              </h4>
              <p className="text-xs text-heritage-charcoal/80">
                Open Daily: 10:00 AM – 7:00 PM. Browse our curated collection of heritage maps, copper pots, and publications.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 text-left">
            <div className="border border-heritage-border/60 bg-heritage-cream/10 p-6 sm:p-8 rounded relative overflow-hidden">
              <span className="text-[10px] font-mono uppercase tracking-wider text-heritage-charcoal/50 block mb-2">
                A Revenue-Generating Cause
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-espresso mb-4">
                Preservation through commerce
              </h3>
              <p className="text-sm text-heritage-charcoal/90 leading-relaxed mb-6">
                Artisanal families in tambat (copperbeat) and burud (cane weaving) clusters have worked around Pune for centuries. Warsaa provides these communities with a fair-trade, modern retail channel, bridging historic craftsmanship with modern buyers.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-10 sm:mt-12">
                <span className="px-3 py-1 bg-heritage-red/10 border border-heritage-red/20 text-heritage-red rounded text-xs font-medium">
                  Fair Trade Certified
                </span>
                <span className="px-3 py-1 bg-heritage-green/10 border border-heritage-green/20 text-heritage-green rounded text-xs font-medium">
                  Direct Livelihood Support
                </span>
                <span className="px-3 py-1 bg-heritage-bronze/10 border border-heritage-bronze/20 text-heritage-bronze rounded text-xs font-medium">
                  Heritage-Linked Materials
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Product Teaser Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((prod) => (
            <div
              key={prod.name}
              className="group p-5 rounded border border-heritage-border/40 bg-[#F9EBD4]/20 hover:bg-[#F9EBD4]/50 transition-all duration-300 text-left flex flex-col"
            >
              {prod.icon}
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-heritage-charcoal/60">
                    {prod.category}
                  </span>
                  <h4 className="font-serif font-bold text-heritage-espresso text-lg mt-0.5">
                    {prod.name}
                  </h4>
                </div>
                <span className="font-mono font-bold text-heritage-espresso text-base shrink-0 mt-0.5">
                  {prod.price}
                </span>
              </div>
              <p className="text-xs text-heritage-charcoal/80 leading-relaxed mt-2.5 flex-grow">
                {prod.description}
              </p>
              
              <button className="mt-6 w-full py-2 bg-heritage-espresso text-heritage-cream text-xs font-medium rounded hover:bg-heritage-espresso/90 transition-colors flex items-center justify-center gap-1">
                <span>View Details</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Marketplace Redirect Link */}
        <div className="mt-16 text-center">
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault();
              alert("Navigating to the new Warsaa Online Marketplace Page...");
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-heritage-red hover:bg-heritage-red/90 text-[#FFFDF9] rounded font-medium shadow-md hover:shadow-lg transition-all duration-200 text-base"
          >
            <span>Visit the Online Marketplace</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
