export default function Footer() {
  return (
    <footer className="bg-heritage-espresso text-heritage-cream-light pt-16 pb-8 border-t border-heritage-red/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Section 1: Brand / Bio */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-heritage-red flex items-center justify-center text-[#F9EBD4] font-serif font-bold text-lg">
                I
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-heritage-cream">
                INTACH PUNE
              </span>
            </div>
            <p className="text-sm text-heritage-cream-light/80 leading-relaxed max-w-md">
              Established in 1986, INTACH Pune is the local chapter of India's largest heritage conservation NGO. We are dedicated to documenting, protecting, and raising public awareness around Pune's built, natural, and living heritage.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-heritage-cream mb-6">
              Heritage Chapters
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#about" className="text-heritage-cream-light/80 hover:text-heritage-bronze transition-colors">
                  About & Mission
                </a>
              </li>
              <li>
                <a href="#pillars" className="text-heritage-cream-light/80 hover:text-heritage-bronze transition-colors">
                  Three Focus Areas
                </a>
              </li>
              <li>
                <a href="#get-involved" className="text-heritage-cream-light/80 hover:text-heritage-bronze transition-colors">
                  Heritage Walks
                </a>
              </li>
              <li>
                <a href="#get-involved" className="text-heritage-cream-light/80 hover:text-heritage-bronze transition-colors">
                  Craft Workshops
                </a>
              </li>
              <li>
                <a href="#education" className="text-heritage-cream-light/80 hover:text-heritage-bronze transition-colors">
                  Schools & Students
                </a>
              </li>
              <li>
                <a href="#warsaa" className="text-heritage-cream-light/80 hover:text-heritage-bronze transition-colors">
                  Warsaa Heritage Shop
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-heritage-cream mb-6">
              Contact & Connect
            </h3>
            <ul className="space-y-4 text-sm text-heritage-cream-light/80">
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-heritage-bronze shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-xs text-heritage-cream-light/50">General Inquiries</span>
                  <a href="mailto:intachpune@gmail.com" className="hover:text-heritage-bronze transition-colors break-all">
                    intachpune@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-heritage-bronze shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-xs text-heritage-cream-light/50">Warsaa Shop Support</span>
                  <a href="mailto:warsaaheritage@gmail.com" className="hover:text-heritage-bronze transition-colors break-all">
                    warsaaheritage@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-heritage-bronze shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">
                  Warsaa Shop, Shaniwar Wada, Pune, MH, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-heritage-border/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-heritage-cream-light/60">
          <p>
            &copy; {new Date().getFullYear()} INTACH Pune Chapter. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="https://www.intach.org" target="_blank" rel="noopener noreferrer" className="hover:text-heritage-cream transition-colors flex items-center gap-1">
              National INTACH
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
