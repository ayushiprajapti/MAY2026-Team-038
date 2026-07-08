import heroImg from "../../assets/home/hero.png";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#FCFAF2]">
      {/* Full Width Map Image - Cropped from the top */}
      <div className="w-full relative z-0 pointer-events-none overflow-hidden">
        <img
          src={heroImg}
          alt="Pune Heritage Background Map"
          className="w-full h-auto block -mt-[100px]"
        />
      </div>

      {/* Action Buttons Directly on Background */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex flex-wrap justify-center gap-4 px-4">
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
    </section>
  );
}
