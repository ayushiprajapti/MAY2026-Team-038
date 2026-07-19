import { Link } from "react-router-dom";
import eventIllustration from "../../assets/volunteer-illustration.png";

export default function VolunteerPortal() {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-heritage-cream text-heritage-charcoal border-heritage-border";
    }
  };

  const getCategoryBadge = (category) => {
    switch (category?.toLowerCase()) {
      case "built":
        return "bg-amber-50 text-[#9c2d19] border-red-200";
      case "natural":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "craft":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "intangible":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-heritage-cream text-heritage-charcoal border-heritage-border";
    }
  };

  const quickActions = [
    {
      title: "Upload Heritage",
      description:
        "Submit details of a monument, temple, fort, museum or heritage structure for verification.",
      link: "/volunteer/upload",
      button: "Open Form",
      color: "#9c2d19", // Heritage Red
    },
    {
      title: "Upload History",
      description:
        "View all your previous submissions and track their approval status.",
      link: "/volunteer/history",
      button: "View History",
      color: "#c28230", // Heritage Bronze
    },
    {
      title: "Volunteer Profile",
      description:
        "Register, manage or revoke your volunteer membership whenever required.",
      link: "/volunteer/profile",
      button: "Manage",
      color: "#256645", // Heritage Green
    },
  ];

  const stats = [
    {
      title: "Pending",
      value: "04",
      color: "#c28230",
    },
    {
      title: "Approved",
      value: "12",
      color: "#256645",
    },
    {
      title: "Rejected",
      value: "02",
      color: "#9c2d19",
    },
    {
      title: "Total Uploads",
      value: "18",
      color: "#1a110b",
    },
  ];

  const recentUploads = [
    {
      site: "Shaniwar Wada",
      category: "built",
      construction_period: "1732 AD (Peshwa Era)",
      date: "16 Jul 2026",
      status: "Pending",
    },
    {
      site: "Sinhagad Fort",
      category: "built",
      construction_period: "13th Century",
      date: "12 Jul 2026",
      status: "Approved",
    },
    {
      site: "Pataleshwar Cave Temple",
      category: "built",
      construction_period: "8th Century AD",
      date: "09 Jul 2026",
      status: "Rejected",
    },
    {
      site: "Aga Khan Palace",
      category: "built",
      construction_period: "1892 AD",
      date: "03 Jul 2026",
      status: "Approved",
    },
  ];

  return (
    <main className="heritage-page w-full min-h-screen flex flex-col">
      {/* Full-bleed Hero Section (100vh minus 80px navbar height) */}
      <section className="w-full lg:h-[calc(100vh-80px)] grid lg:grid-cols-[1.1fr_0.9fr] border-b border-heritage-border/20 bg-transparent">
        {/* Left Side: Content */}
        <div className="flex flex-col justify-center p-6 sm:p-12 lg:p-16 space-y-6 lg:space-y-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-[#c28230] text-xs sm:text-sm font-bold">
              Volunteer Portal
            </p>

            <h1 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#9c2d19]">
              Preserve India's Heritage
            </h1>

            <p className="mt-4 text-[#2b2118]/85 text-base sm:text-lg leading-relaxed max-w-xl">
              Become a part of INTACH's heritage conservation initiative. Submit
              discoveries, monitor their approval progress and help preserve
              important historical landmarks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl">
            {stats.map((item) => (
              <div
                key={item.title}
                className="heritage-card rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-shadow duration-200"
              >
                <h2
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{ color: item.color }}
                >
                  {item.value}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-wider text-[#2b2118]/70 font-bold">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Full height image flushed to right */}
        <div className="relative w-full h-[350px] lg:h-full bg-heritage-cream-dark/10 overflow-hidden">
          <img
            src={eventIllustration}
            alt="Volunteer Illustration"
            className="w-full h-full object-cover object-left-top"
          />
          {/* Subtle overlay gradient to blend into content side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8ecd7]/20 to-transparent" />
        </div>
      </section>

      {/* Main Content Area - Margins and paddings start here */}
      <div className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Quick Actions Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          {quickActions.map((item) => (
            <div
              key={item.title}
              className="heritage-card rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ background: item.color }}
                >
                  GO
                </div>

                <h2 className="mt-4 font-serif text-xl sm:text-2xl font-semibold text-[#9c2d19]">
                  {item.title}
                </h2>

                <p className="mt-3 text-[#2b2118]/85 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>

              <Link
                to={item.link}
                className="mt-6 block w-full rounded-lg text-white text-center py-2.5 font-semibold transition duration-200"
                style={{ background: item.color }}
                onMouseOver={(e) => {
                  e.currentTarget.style.filter = "brightness(0.9)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                {item.button}
              </Link>
            </div>
          ))}
        </section>

        {/* Recent Uploads Table - styled like other cream heritage cards */}
        <section className="heritage-card rounded-2xl p-6 md:p-8 text-left">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold text-heritage-espresso">
              Recent Submissions
            </h2>
            <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
              Overview of your recently uploaded heritage sites and their
              verification status
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-heritage-border/40 text-heritage-charcoal/60 uppercase font-semibold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Heritage Site</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Construction Period</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border/20 text-heritage-espresso font-medium">
                {recentUploads.map((item) => (
                  <tr
                    key={item.site}
                    className="hover:bg-heritage-cream/10 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-heritage-espresso">
                      {item.site}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider font-mono ${getCategoryBadge(
                          item.category,
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-heritage-charcoal/80">
                      {item.construction_period}
                    </td>
                    <td className="py-3.5 px-4 text-heritage-charcoal/80">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider font-mono ${getStatusBadge(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Guidelines & Assistance Column Grid */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="heritage-card rounded-2xl p-6">
            <h2 className="font-serif text-2xl font-bold text-[#9c2d19]">
              Volunteer Guidelines
            </h2>
            <ul className="mt-4 space-y-3 text-sm sm:text-base text-[#2b2118]/85 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#c28230] font-bold">•</span>
                <span>
                  Upload only genuine heritage sites with accurate location
                  details.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c28230] font-bold">•</span>
                <span>
                  Provide clear photographs from multiple angles whenever
                  possible.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c28230] font-bold">•</span>
                <span>
                  Include historical significance and supporting references.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c28230] font-bold">•</span>
                <span>
                  Ensure the information submitted is authentic and verifiable.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c28230] font-bold">•</span>
                <span>
                  Respect restricted monuments and protected archaeological
                  zones.
                </span>
              </li>
            </ul>
          </div>

          <div className="heritage-card rounded-2xl p-6">
            <h2 className="font-serif text-2xl font-bold text-[#9c2d19]">
              Need Assistance?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#2b2118]/85 leading-relaxed">
              If you experience any issues while submitting a heritage site,
              updating your profile, or tracking your submissions, the INTACH
              support team is available to assist volunteers.
            </p>
            <div className="mt-6 space-y-2 text-sm sm:text-base text-[#2b2118]/85">
              <p>
                <strong className="text-[#2b2118]">Email:</strong>{" "}
                volunteer@intach.org
              </p>
              <p>
                <strong className="text-[#2b2118]">Phone:</strong> +91 98765
                43210
              </p>
              <p>
                <strong className="text-[#2b2118]">Working Hours:</strong>{" "}
                Monday – Friday, 9:00 AM – 6:00 PM
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
