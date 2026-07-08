import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Three Pillars", href: "#pillars" },
    { name: "Get Involved", href: "#get-involved" },
    { name: "Education", href: "#education" },
    { name: "Warsaa Shop", href: "#warsaa" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFFDF9]/95 border-b border-heritage-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-heritage-red flex items-center justify-center text-[#F9EBD4] font-serif font-bold text-xl shadow-sm">
              I
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-tight text-heritage-espresso leading-tight">
                INTACH PUNE
              </span>
              <span className="font-sans text-xs tracking-wider text-heritage-charcoal/80 uppercase font-medium">
                Heritage Conservation chapter
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-sans text-sm font-medium text-heritage-charcoal hover:text-heritage-red transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-heritage-red after:transition-all after:duration-350 hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#get-involved"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded bg-heritage-red text-[#FFFDF9] hover:bg-heritage-red/90 transition-all duration-200 shadow-sm hover:shadow"
            >
              Join Us
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-heritage-charcoal hover:text-heritage-red hover:bg-heritage-cream-dark/50 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${isOpen ? "block animate-fadeIn" : "hidden"} md:hidden bg-[#F9EBD4] border-b border-heritage-border/40`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-heritage-charcoal hover:text-heritage-red hover:bg-heritage-cream-dark/40 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 px-3">
            <a
              href="#get-involved"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded bg-heritage-red text-[#FFFDF9] hover:bg-heritage-red/90 font-medium transition-all"
            >
              Join Us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
