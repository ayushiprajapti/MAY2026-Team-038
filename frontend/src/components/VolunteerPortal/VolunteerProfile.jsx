import { useState } from "react";

export default function VolunteerProfile() {
  const [profile, setProfile] = useState({
    fullName: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 9876543210",
    city: "Pune",
    state: "Maharashtra",
    occupation: "Student",
    skills: "Photography, Documentation, Research",
    status: "Active",
    verified: true,
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Profile updated successfully.");
  };

  const handleRevoke = () => {
    if (window.confirm("Are you sure you want to revoke your volunteer membership?")) {
      alert("Volunteer membership revoked.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8ecd7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section (Transparent background, consistent styling) */}
        <div className="py-6 border-b border-heritage-border/20 text-left">
          <p className="uppercase tracking-[0.2em] text-[#c28230] text-xs font-bold">
            Volunteer Portal
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#9c2d19] mt-2">
            Volunteer Profile
          </h1>
          <p className="mt-3 text-heritage-charcoal/85 text-base leading-relaxed max-w-3xl">
            Manage your volunteer account, update personal information, monitor verification status and control your membership.
          </p>
        </div>

        {/* Profile Card and Form Section */}
        <section className="grid lg:grid-cols-3 gap-8 text-left">

          {/* Left Column: Avatar & Overview */}
          <div className="heritage-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-center mt-2">
                <div className="w-24 h-24 rounded-full bg-[#9c2d19] text-white flex items-center justify-center text-3xl font-serif font-bold shadow-md">
                  RS
                </div>
              </div>

              <h2 className="text-center text-xl font-bold font-serif mt-5 text-heritage-espresso">
                {profile.fullName}
              </h2>

              <p className="text-center text-xs uppercase tracking-widest text-[#c28230] font-bold mt-1.5">
                Volunteer Member
              </p>
            </div>

            <div className="space-y-4 border-t border-heritage-border/20 pt-6 text-sm font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-heritage-border/10">
                <span className="font-bold text-heritage-charcoal/60 text-xs uppercase tracking-wider">Status</span>
                <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider font-mono bg-emerald-50 text-emerald-700 border-emerald-200">
                  {profile.status}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-heritage-border/10">
                <span className="font-bold text-heritage-charcoal/60 text-xs uppercase tracking-wider">Verification</span>
                <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider font-mono bg-emerald-50 text-emerald-700 border-emerald-200">
                  {profile.verified ? "Verified" : "Pending"}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-heritage-border/10">
                <span className="font-bold text-heritage-charcoal/60 text-xs uppercase tracking-wider">City</span>
                <span className="font-semibold text-heritage-espresso">{profile.city}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-heritage-charcoal/60 text-xs uppercase tracking-wider">State</span>
                <span className="font-semibold text-heritage-espresso">{profile.state}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Information Form */}
          <div className="heritage-card rounded-2xl p-6 sm:p-8 lg:col-span-2 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#9c2d19] border-b border-heritage-border/20 pb-2 mb-4">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-heritage-charcoal/70">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-heritage-border/60 bg-heritage-cream/20 px-4 py-2.5 text-sm text-heritage-espresso focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-heritage-charcoal/70">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-heritage-border/60 bg-heritage-cream/20 px-4 py-2.5 text-sm text-heritage-espresso focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-heritage-charcoal/70">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-heritage-border/60 bg-heritage-cream/20 px-4 py-2.5 text-sm text-heritage-espresso focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-heritage-charcoal/70">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-heritage-border/60 bg-heritage-cream/20 px-4 py-2.5 text-sm text-heritage-espresso focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-heritage-charcoal/70">
                  Skills & Interests
                </label>
                <textarea
                  rows="4"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-heritage-border/60 bg-heritage-cream/20 px-4 py-2.5 text-sm text-heritage-espresso focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze transition resize-none"
                />
              </div>
            </div>
          </div>

        </section>

        {/* Bottom Section: Membership Status controls */}
        <section className="heritage-card rounded-2xl p-6 sm:p-8 space-y-6 text-left">
          <h2 className="font-serif text-2xl font-bold text-[#9c2d19] border-b border-heritage-border/20 pb-2 mb-4">
            Volunteer Membership
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="border border-heritage-border/40 rounded-xl p-5 bg-heritage-cream-light/35 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-heritage-espresso font-serif">
                  Membership Status
                </h3>
                <p className="mt-2 text-xs text-heritage-charcoal/80 leading-relaxed font-sans">
                  Your volunteer membership is currently active. You can continue submitting heritage sites and participating in local conservation initiatives.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className="mt-5 px-5 py-2 rounded-lg bg-[#256645] text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-default"
                >
                  Registered Volunteer
                </button>
              </div>
            </div>

            <div className="border border-heritage-border/40 rounded-xl p-5 bg-heritage-cream-light/35 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-heritage-espresso font-serif">
                  Revoke Membership
                </h3>
                <p className="mt-2 text-xs text-heritage-charcoal/80 leading-relaxed font-sans">
                  If you no longer wish to participate as an active volunteer for INTACH Pune, you may revoke your membership at any time.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="mt-5 px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white transition text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Revoke Membership
                </button>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-heritage-red text-white hover:bg-heritage-red/90 transition text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}