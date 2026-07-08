import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function GetInvolved() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Centered in Pune
      mapRef.current = L.map(mapContainerRef.current, {
        center: [18.5195, 73.8553],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      // Setup marker design
      const wadaIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="w-4 h-4 rounded-full bg-heritage-red border-2 border-white shadow flex items-center justify-center"><div class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const templeIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="w-4 h-4 rounded-full bg-heritage-bronze border-2 border-white shadow"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const riverIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="w-4 h-4 rounded-full bg-heritage-green border-2 border-white shadow"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      // Add markers
      L.marker([18.5192, 73.8553], { icon: wadaIcon })
        .addTo(mapRef.current)
        .bindPopup("<b>Shaniwar Wada</b><br>Core Architectural Heritage site.");

      L.marker([18.5205, 73.8560], { icon: templeIcon })
        .addTo(mapRef.current)
        .bindPopup("<b>Kasba Ganpati</b><br>17th-century Peshwa temple.");

      L.marker([18.5218, 73.8522], { icon: riverIcon })
        .addTo(mapRef.current)
        .bindPopup("<b>Mutha River Walk</b><br>Natural restoration trial zone.");
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  const activities = [
    {
      number: "01",
      numberColor: "text-heritage-red",
      title: "Heritage Walks",
      type: "Cultural Exploration",
      desc: "Weekly guided tours through historical wadas, old markets, and cantonment quarters.",
      highlights: "Kasba Peth, Shaniwar Wada to Vishrambaug Wada, Pune Cantonment, Food-heritage Trails."
    },
    {
      number: "02",
      numberColor: "text-heritage-bronze",
      title: "Craft Workshops",
      type: "Hands-on Learning",
      desc: "Direct masterclasses conducted by active traditional artisans to sustain rare handicraft skills.",
      highlights: "Tambat Coppersmithing, Burud Bamboo Weaving, Ganjifa Playing Card Painting."
    },
    {
      number: "03",
      numberColor: "text-heritage-green",
      title: "Natural Walks & Hikes",
      type: "Ecological Awareness",
      desc: "Guided nature and eco walks to observe flora, heritage trees, and ancient community sanctuaries.",
      highlights: "Devrai (Sacred Grove) hikes, old-growth forest walks, riverbank flora mapping."
    }
  ];

  return (
    <section id="get-involved" className="bg-heritage-cream-light py-20 sm:py-28 border-y border-heritage-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
          
          {/* Left Column: List of Activities */}
          <div className="lg:col-span-7 text-left space-y-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-heritage-red font-semibold block mb-3">
                Experience Pune
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-heritage-espresso leading-tight mb-6">
                Walks, Workshops & Hikes
              </h2>
              <p className="text-base text-heritage-charcoal/80 max-w-xl">
                Immerse yourself in Pune's history. We host educational programs, craft workshops, and walks for the general public, volunteers, and schools.
              </p>
            </div>

            <div className="space-y-6">
              {activities.map((act) => (
                <div
                  key={act.title}
                  className="flex flex-col sm:flex-row gap-6 p-6 rounded border border-heritage-border/30 bg-heritage-cream/10 hover:bg-[#FFFDF9] hover:border-heritage-border/60 transition-all duration-300 shadow-sm"
                >
                  <div className={`font-serif text-4xl sm:text-5xl font-extrabold tracking-tight ${act.numberColor} leading-none shrink-0`}>
                    {act.number}
                  </div>
                  <div className="flex-grow">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-heritage-charcoal/60 block mb-1">
                      {act.type}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-espresso leading-tight">
                      {act.title}
                    </h3>
                    <p className="text-sm text-heritage-charcoal/90 mt-2 leading-relaxed font-body">
                      {act.desc}
                    </p>
                    <div className="flex gap-2 items-start text-xs text-heritage-charcoal/70 mt-4 pt-3 border-t border-heritage-border/20">
                      <strong className="text-heritage-espresso font-mono text-[9px] uppercase tracking-wider mt-0.5">Featured Paths:</strong>
                      <span className="leading-normal">{act.highlights}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Portal Teaser and Mock Map Interaction */}
          <div className="lg:col-span-5 text-left">
            <div className="relative p-8 rounded bg-[#F9EBD4] border border-heritage-border shadow-md overflow-hidden">
              <span className="text-xs font-mono uppercase tracking-widest text-heritage-bronze font-semibold block mb-2">
                Live Interactive Map
              </span>
              <h3 className="font-serif text-2xl font-bold text-heritage-espresso mb-4">
                Explore Pune's Heritage & Active Trails
              </h3>
              <p className="text-sm text-heritage-charcoal/80 leading-relaxed mb-6">
                Locate documented heritage monuments, botanical trees, and sacred groves in real-time. Use the map below to search trails and find active chapter restoration coordinates.
              </p>

              {/* Leaflet Map Div Container */}
              <div
                ref={mapContainerRef}
                className="h-72 w-full rounded bg-heritage-cream-dark border border-heritage-border shadow-inner z-10"
              />

              {/* Placeholder button/link that opens the new page */}
              <div className="mt-6">
                <a
                  href="/trails-map"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Redirecting to the new Interactive Trails & Map Page...");
                  }}
                  className="w-full py-3 bg-heritage-espresso hover:bg-heritage-espresso/90 text-heritage-cream text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Full Screen Trails Map</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
