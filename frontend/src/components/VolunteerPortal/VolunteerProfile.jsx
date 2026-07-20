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

  return (
    <main className="heritage-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="heritage-card rounded-2xl p-8">
          <p className="uppercase tracking-[0.25em] text-[#C98716] text-sm font-semibold">
            Volunteer Portal
          </p>

          <h1 className="font-serif text-5xl text-[#7F1D1D] mt-4">
            Volunteer Profile
          </h1>

          <p className="mt-5 text-[#5F4631] leading-8 max-w-3xl">
            Manage your volunteer account, update personal information,
            monitor verification status and control your membership.
          </p>
        </div>

        <section className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="heritage-card rounded-2xl p-8">
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-full bg-[#7F1D1D] text-white flex items-center justify-center text-4xl font-bold">
                RS
              </div>
            </div>

            <h2 className="text-center text-2xl font-serif mt-6 text-[#7F1D1D]">
              {profile.fullName}
            </h2>

            <p className="text-center text-[#5F4631] mt-2">
              Volunteer Member
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-green-700 font-semibold">
                  {profile.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Verification</span>
                <span className="text-green-700 font-semibold">
                  {profile.verified ? "Verified" : "Pending"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>City</span>
                <span>{profile.city}</span>
              </div>

              <div className="flex justify-between">
                <span>State</span>
                <span>{profile.state}</span>
              </div>
            </div>
          </div>

          <div className="heritage-card rounded-2xl p-8 lg:col-span-2">
            <h2 className="font-serif text-3xl text-[#7F1D1D] mb-6">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Occupation
                </label>

                <input
                  type="text"
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9C7B1] bg-[#FFFCF8] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">
                  Skills & Interests
                </label>

                <textarea
                  rows="4"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  className="w-full border border-[#D9C7B1] rounded-lg bg-[#FFFCF8] p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#C98716] focus:border-[#C98716] transition"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}