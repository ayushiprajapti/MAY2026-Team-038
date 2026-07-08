import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send data to the backend.
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", interest: "general", message: "" });
    }, 4000);
  };

  return (
    <section id="contact" className="bg-[#F9EBD4] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-stretch">
          
          {/* Left Column: Direct Contacts & Announcement */}
          <div className="lg:col-span-5 text-left flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-heritage-red font-semibold block mb-3">
                Join the Chapter
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-heritage-espresso leading-tight mb-6">
                Get in Touch
              </h2>
              <p className="text-base text-heritage-charcoal/90 leading-relaxed mb-8">
                Have questions about our walks, workshops, or volunteering initiatives? Send us a message and our chapter coordinator will get back to you shortly.
              </p>

              {/* Direct Details */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded bg-heritage-red/10 border border-heritage-red/20 flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5 text-heritage-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-heritage-charcoal/60 block">
                      General Emails
                    </span>
                    <a href="mailto:intachpune@gmail.com" className="font-sans text-sm font-semibold text-heritage-espresso hover:text-heritage-red transition-colors block mt-0.5">
                      intachpune@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded bg-heritage-bronze/10 border border-heritage-bronze/20 flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5 text-heritage-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-heritage-charcoal/60 block">
                      Warsaa Shop Coordinator
                    </span>
                    <a href="mailto:warsaaheritage@gmail.com" className="font-sans text-sm font-semibold text-heritage-espresso hover:text-heritage-bronze transition-colors block mt-0.5">
                      warsaaheritage@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform transition box */}
            <div className="mt-12 lg:mt-0 p-5 rounded bg-heritage-cream-light border border-heritage-border/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-heritage-bronze font-semibold block mb-1">
                Digital Gateway Status
              </span>
              <p className="text-xs text-heritage-charcoal/80 leading-normal">
                This platform is laying the foundation for direct member logs, online booking calendars, and online payments. Future updates will transition manual coordinators to automated bookings.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded border border-heritage-border/40 bg-heritage-cream-light text-left shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-heritage-espresso mb-6">
                Send a Message
              </h3>

              {submitted ? (
                <div className="bg-heritage-green/10 border border-heritage-green/30 text-heritage-green p-6 rounded text-center">
                  <svg className="h-10 w-10 mx-auto mb-3 text-heritage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-serif font-bold text-lg text-heritage-espresso">Message Submitted!</h4>
                  <p className="text-xs text-heritage-charcoal/80 mt-1">
                    Thank you. We will coordinate and get back to you via email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono text-heritage-charcoal/80 uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F9EBD4]/40 border-b border-heritage-border focus:border-heritage-red focus:outline-none py-2 text-sm text-heritage-espresso transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono text-heritage-charcoal/80 uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F9EBD4]/40 border-b border-heritage-border focus:border-heritage-red focus:outline-none py-2 text-sm text-heritage-espresso transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-xs font-mono text-heritage-charcoal/80 uppercase mb-2">
                      Area of Interest
                    </label>
                    <select
                      id="interest"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full bg-[#F9EBD4]/40 border-b border-heritage-border focus:border-heritage-red focus:outline-none py-2 text-sm text-heritage-espresso transition-colors"
                    >
                      <option value="general">General Inquiries</option>
                      <option value="walks">Heritage Walks (Kasba, Cantonment)</option>
                      <option value="workshops">Craft Workshops (Tambat, Burud)</option>
                      <option value="volunteering">Volunteering & Surveying</option>
                      <option value="schools">Schools & Students Activities</option>
                      <option value="warsaa">Warsaa Heritage Shop purchases</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono text-heritage-charcoal/80 uppercase mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#F9EBD4]/40 border-b border-heritage-border focus:border-heritage-red focus:outline-none py-2 text-sm text-heritage-espresso transition-colors resize-none"
                      placeholder="Share your queries or how you'd like to get involved..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-heritage-red hover:bg-heritage-red/90 text-[#FFFDF9] rounded font-medium shadow transition-all duration-200 text-sm uppercase tracking-wider font-sans"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
        
      </div>
    </section>
  );
}
