import { useState } from "react";

export default function UploadHistory() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const uploads = [
    {
      id: 1,
      site: "Shaniwar Wada",
      category: "Fort",
      date: "16 Jul 2026",
      status: "Pending",
    },
    {
      id: 2,
      site: "Sinhagad Fort",
      category: "Fort",
      date: "12 Jul 2026",
      status: "Approved",
    },
    {
      id: 3,
      site: "Pataleshwar Cave Temple",
      category: "Temple",
      date: "09 Jul 2026",
      status: "Rejected",
    },
    {
      id: 4,
      site: "Aga Khan Palace",
      category: "Museum",
      date: "03 Jul 2026",
      status: "Approved",
    },
    {
      id: 5,
      site: "Lal Mahal",
      category: "Palace",
      date: "28 Jun 2026",
      status: "Pending",
    },
  ];

  const filteredUploads = uploads.filter((item) => {
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesSearch = item.site
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: uploads.length,
    pending: uploads.filter((u) => u.status === "Pending").length,
    approved: uploads.filter((u) => u.status === "Approved").length,
    rejected: uploads.filter((u) => u.status === "Rejected").length,
  };

  return (
    <main className="heritage-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="heritage-card rounded-2xl p-8">

          <p className="uppercase tracking-[0.25em] text-[#C98716] text-sm font-semibold">
            Volunteer Portal
          </p>

          <h1 className="font-serif text-5xl text-[#7F1D1D] mt-4">
            Upload History
          </h1>

          <p className="mt-5 text-[#5F4631] leading-8 max-w-3xl">
            Track every heritage submission you've made, monitor approval
            progress and review previous contributions.
          </p>

        </div>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          <div className="heritage-card rounded-xl p-6">
            <h2 className="text-4xl font-bold text-[#7F1D1D]">
              {stats.total}
            </h2>
            <p className="mt-2 text-[#5F4631]">
              Total Uploads
            </p>
          </div>

          <div className="heritage-card rounded-xl p-6">
            <h2 className="text-4xl font-bold text-yellow-600">
              {stats.pending}
            </h2>
            <p className="mt-2 text-[#5F4631]">
              Pending
            </p>
          </div>

          <div className="heritage-card rounded-xl p-6">
            <h2 className="text-4xl font-bold text-green-700">
              {stats.approved}
            </h2>
            <p className="mt-2 text-[#5F4631]">
              Approved
            </p>
          </div>

          <div className="heritage-card rounded-xl p-6">
            <h2 className="text-4xl font-bold text-red-700">
              {stats.rejected}
            </h2>
            <p className="mt-2 text-[#5F4631]">
              Rejected
            </p>
          </div>

        </section>

        <section className="heritage-card rounded-2xl p-8 mt-8">

          <div className="grid md:grid-cols-2 gap-5">            <input
              type="text"
              placeholder="Search by heritage site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

          </div>

        </section>

        <section className="heritage-card rounded-2xl p-8 mt-8">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-[#E5D7C4]">

                  <th className="text-left py-4">Site</th>

                  <th className="text-left">Category</th>

                  <th className="text-left">Submission Date</th>

                  <th className="text-left">Status</th>

                  <th className="text-center">Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredUploads.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="py-12 text-center text-[#5F4631]"
                    >
                      No matching submissions found.
                    </td>

                  </tr>

                ) : (

                  filteredUploads.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b border-[#EFE4D4] hover:bg-[#FFF9F2]"
                    >

                      <td className="py-5 font-medium">
                        {item.site}
                      </td>

                      <td>
                        {item.category}
                      </td>

                      <td>
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

                      <td className="text-center">

                        <button
                          className="px-4 py-2 rounded-lg bg-[#7F1D1D] text-white hover:bg-[#651717] transition"
                        >
                          View Details
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          <div className="flex justify-between items-center mt-8">

            <p className="text-[#5F4631]">
              Showing {filteredUploads.length} of {uploads.length} submissions
            </p>

            <div className="flex gap-2">

              <button
                className="px-4 py-2 rounded-lg border"
                disabled
              >
                Previous
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-[#7F1D1D] text-white"
              >
                1
              </button>

              <button
                className="px-4 py-2 rounded-lg border"
                disabled
              >
                Next
              </button>

            </div>

          </div>

        </section>

      </div>

    </main>

  );
}