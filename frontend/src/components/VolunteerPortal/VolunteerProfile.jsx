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

            <div className="grid md:grid-cols-2 gap-6">              <div>

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
                  className="w-full border rounded-lg p-3 resize-none"
                />

              </div>

            </div>

          </div>

        </section>

        <section className="heritage-card rounded-2xl p-8 mt-8">

          <h2 className="font-serif text-3xl text-[#7F1D1D] mb-6">
            Volunteer Membership
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="border rounded-xl p-6">

              <h3 className="text-2xl font-semibold text-[#7F1D1D]">
                Membership Status
              </h3>

              <p className="mt-4 text-[#5F4631] leading-7">
                Your volunteer membership is currently active. You can
                continue submitting heritage sites and participating in
                conservation activities.
              </p>

              <button
                type="button"
                className="mt-6 px-6 py-3 rounded-lg bg-[#2E7D32] text-white"
              >
                Registered Volunteer
              </button>

            </div>

            <div className="border rounded-xl p-6">

              <h3 className="text-2xl font-semibold text-[#7F1D1D]">
                Revoke Membership
              </h3>

              <p className="mt-4 text-[#5F4631] leading-7">
                If you no longer wish to participate as a volunteer,
                you may revoke your membership at any time.
              </p>

              <button
                type="button"
                onClick={handleRevoke}
                className="mt-6 px-6 py-3 rounded-lg bg-red-700 text-white hover:bg-red-800 transition"
              >
                Revoke Membership
              </button>

            </div>

          </div>

          <div className="flex justify-end mt-10">

            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-3 rounded-lg bg-[#7F1D1D] text-white hover:bg-[#651717] transition"
            >
              Save Changes
            </button>

          </div>

        </section>

      </div>

    </main>

  );
}