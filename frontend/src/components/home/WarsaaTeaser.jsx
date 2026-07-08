import copperCarafe from "../../assets/home/copper-carafe.jpg";
import heritageMap from "../../assets/home/heritage-map.jpg";
import puneBook from "../../assets/home/pune-book.jpg";

export default function WarsaaTeaser() {
  const products = [
    {
      name: "Handcrafted Copper Carafe",
      category: "Tambat Metalware",
      price: "₹1,850",
      description: "Directly beaten and shaped by Pune's traditional coppersmiths using centuries-old techniques.",
      image: copperCarafe
    },
    {
      name: "Pune Heritage Map",
      category: "Publications",
      price: "₹120",
      description: "A meticulously illustrated foldout guide mapping historical Peshwa wadas, shrines, and old lanes.",
      image: heritageMap
    },
    {
      name: '"Pune, Queen of the Deccan"',
      category: "Books",
      price: "₹650",
      description: "The definitive historical compilation detailing Pune's urban growth, climate, and architectural legacy.",
      image: puneBook
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
            <div className="border border-heritage-border/60 bg-heritage-cream p-6 sm:p-8 rounded relative overflow-hidden">
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
              className="group p-5 rounded border border-heritage-border/40 bg-heritage-cream hover:bg-heritage-cream-dark/45 transition-all duration-300 text-left flex flex-col"
            >
              <div className="w-full h-44 overflow-hidden rounded border border-heritage-border/30 bg-heritage-cream-light mb-4 shrink-0">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
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
