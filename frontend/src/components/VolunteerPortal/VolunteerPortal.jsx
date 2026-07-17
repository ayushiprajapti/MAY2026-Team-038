import { Link } from "react-router-dom";
import eventIllustration from "../../assets/volunteer-illustration.png";

export default function VolunteerPortal() {
  const quickActions = [
    {
      title: "Upload Heritage",
      description:
        "Submit details of a monument, temple, fort, museum or heritage structure for verification.",
      link: "/volunteer/upload",
      button: "Open Form",
      color: "#8B1E1E",
    },
    {
      title: "Upload History",
      description:
        "View all your previous submissions and track their approval status.",
      link: "/volunteer/history",
      button: "View History",
      color: "#C98716",
    },
    {
      title: "Volunteer Profile",
      description:
        "Register, manage or revoke your volunteer membership whenever required.",
      link: "/volunteer/profile",
      button: "Manage",
      color: "#2E7D32",
    },
  ];

  const stats = [
    {
      title: "Pending",
      value: "04",
      color: "#C98716",
    },
    {
      title: "Approved",
      value: "12",
      color: "#2E7D32",
    },
    {
      title: "Rejected",
      value: "02",
      color: "#B3261E",
    },
    {
      title: "Total Uploads",
      value: "18",
      color: "#7F1D1D",
    },
  ];

  const recentUploads = [
    {
      site: "Shaniwar Wada",
      date: "16 Jul 2026",
      status: "Pending",
    },
    {
      site: "Sinhagad Fort",
      date: "12 Jul 2026",
      status: "Approved",
    },
    {
      site: "Pataleshwar Cave Temple",
      date: "09 Jul 2026",
      status: "Rejected",
    },
    {
      site: "Aga Khan Palace",
      date: "03 Jul 2026",
      status: "Approved",
    },
  ];

  return (
    <main className="heritage-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <section className="heritage-card rounded-2xl p-8 lg:p-12">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <div>

              <p className="uppercase tracking-[0.25em] text-[#C98716] text-sm font-semibold">
                Volunteer Portal
              </p>

              <h1 className="mt-4 font-serif text-5xl leading-tight text-[#7F1D1D]">
                Preserve India's Heritage
              </h1>

              <p className="mt-6 text-[#5F4631] leading-8 text-lg">
                Become a part of INTACH's heritage conservation initiative.
                Submit discoveries, monitor their approval progress and help
                preserve important historical landmarks.
              </p>

              <div className="grid grid-cols-2 gap-5 mt-10">

                {stats.map((item) => (

                  <div
                    key={item.title}
                    className="rounded-xl border border-[#E4D2B9] bg-[#FFF8EC] p-6"
                  >

                    <h2
                      className="text-4xl font-bold"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </h2>

                    <p className="mt-2 text-[#5F4631]">
                      {item.title}
                    </p>

                  </div>

                ))}

              </div>

            </div>

            <div className="flex justify-center">

              <img
                src={eventIllustration}
                alt="Volunteer Illustration"
                className="w-full max-w-md object-contain"
              />

            </div>

          </div>

        </section>

        <section className="grid lg:grid-cols-3 gap-7 mt-10">

          {quickActions.map((item) => (

            <div
              key={item.title}
              className="heritage-card rounded-2xl p-7 flex flex-col"
            >

              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: item.color }}
              >
                GO
              </div>

              <h2 className="mt-6 font-serif text-2xl text-[#7F1D1D]">
                {item.title}
              </h2>

              <p className="mt-4 text-[#5F4631] leading-7 flex-1">
                {item.description}
              </p>

              <Link
                to={item.link}
                className="mt-8 rounded-lg bg-[#C98716] text-white text-center py-3 transition hover:bg-[#AA710E]"
              >
                {item.button}
              </Link>

            </div>

          ))}

        </section>

        <section className="heritage-card rounded-2xl p-8 mt-10">

          <div className="flex items-center justify-between">

            <h2 className="font-serif text-3xl text-[#7F1D1D]">
              Recent Uploads
            </h2>

          </div>

          <div className="overflow-x-auto mt-8">

            <table className="w-full">

              <thead>

                <tr className="border-b border-[#E4D2B9]">

                  <th className="text-left py-4">Heritage Site</th>

                  <th className="text-left">Submission Date</th>

                  <th className="text-left">Status</th>

                </tr>

              </thead>

              <tbody>                {recentUploads.map((item) => (

                  <tr
                    key={item.site}
                    className="border-b border-[#EFE4D4] hover:bg-[#FFF9F2]"
                  >

                    <td className="py-5 font-medium text-[#5F4631]">
                      {item.site}
                    </td>

                    <td className="text-[#5F4631]">
                      {item.date}
                    </td>

                    <td>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
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

        <section className="grid lg:grid-cols-2 gap-8 mt-10">

          <div className="heritage-card rounded-2xl p-8">

            <h2 className="font-serif text-3xl text-[#7F1D1D]">
              Volunteer Guidelines
            </h2>

            <ul className="mt-6 space-y-5 text-[#5F4631] leading-8">

              <li>
                • Upload only genuine heritage sites with accurate location
                details.
              </li>

              <li>
                • Provide clear photographs from multiple angles whenever
                possible.
              </li>

              <li>
                • Include historical significance and supporting references.
              </li>

              <li>
                • Ensure the information submitted is authentic and verifiable.
              </li>

              <li>
                • Respect restricted monuments and protected archaeological
                zones.
              </li>

            </ul>

          </div>

          <div className="heritage-card rounded-2xl p-8">

            <h2 className="font-serif text-3xl text-[#7F1D1D]">
              Need Assistance?
            </h2>

            <p className="mt-6 text-[#5F4631] leading-8">

              If you experience any issues while submitting a heritage site,
              updating your profile, or tracking your submissions, the INTACH
              support team is available to assist volunteers.

            </p>

            <div className="mt-8 space-y-3">

              <p>
                <strong>Email:</strong> volunteer@intach.org
              </p>

              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>

              <p>
                <strong>Working Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>

  );

}