import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { name: "Heritage Trails", to: "/trails" },
    { name: "Events", to: "/events" },
    { name: "Marketplace", to: "/shop" },
    { name: "Admin", to: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-[1100] backdrop-blur-md bg-heritage-cream-light/95 border-b border-heritage-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="INTACH Pune Logo" className="w-14 h-14 object-contain" />
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-lg tracking-tight text-heritage-espresso leading-tight">
                INTACH PUNE
              </span>
              <span className="font-sans text-xs tracking-wider text-heritage-charcoal/80 uppercase font-medium">
                Heritage Conservation chapter
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="font-sans text-sm font-medium text-heritage-espresso hover:text-heritage-red transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-heritage-red after:transition-all after:duration-350 hover:after:w-full"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Profile Dropdown Component */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-heritage-cream border border-heritage-border flex items-center justify-center text-heritage-espresso hover:border-heritage-red hover:text-heritage-red transition-all shadow-sm focus:outline-none cursor-pointer"
                aria-label="User profile menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded border border-heritage-border/60 bg-heritage-cream-light shadow-md z-50 py-2 text-left animate-fadeIn">
                  <div className="px-4 py-2 border-b border-heritage-border/20">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-heritage-charcoal/50">Signed in as</span>
                    <span className="block text-sm font-semibold text-heritage-espresso">Pune Coordinator</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert("Opening Shopping Cart...");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-heritage-charcoal hover:bg-heritage-cream/30 hover:text-heritage-red transition-colors flex items-center gap-2 font-sans font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>View Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert("Opening Profile Settings...");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-heritage-charcoal hover:bg-heritage-cream/30 hover:text-heritage-red transition-colors flex items-center gap-2 font-sans font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Profile Settings</span>
                  </button>

                  <div className="border-t border-heritage-border/20 my-1" />

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert("Logging out...");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-heritage-red hover:bg-heritage-red/5 transition-colors flex items-center gap-2 font-sans font-semibold cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

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
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${isOpen ? "block animate-fadeIn" : "hidden"} md:hidden bg-heritage-cream-light border-b border-heritage-border/40`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-left">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-heritage-espresso hover:text-heritage-red hover:bg-heritage-cream-dark/40 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Profile Actions */}
          <div className="pt-4 mt-4 border-t border-heritage-border/40 px-3">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-heritage-charcoal/50 mb-2">My Account</span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert("Opening Shopping Cart...");
                }}
                className="w-full text-left py-2 text-sm text-heritage-charcoal hover:text-heritage-red font-sans font-medium flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>View Cart</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert("Opening Profile Settings...");
                }}
                className="w-full text-left py-2 text-sm text-heritage-charcoal hover:text-heritage-red font-sans font-medium flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Profile Settings</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert("Logging out...");
                }}
                className="w-full text-left py-2 text-sm text-heritage-red hover:text-heritage-red/80 font-sans font-semibold flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
