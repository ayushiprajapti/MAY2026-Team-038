import { useState, useEffect } from "react";

export default function UploadHistory() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedUpload, setSelectedUpload] = useState(null);

  useEffect(() => {
    if (selectedUpload) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedUpload]);

  const uploads = [
    {
      id: 1,
      site: "Shaniwar Wada",
      category: "built",
      construction_period: "1732 AD (Peshwa Era)",
      date: "16 Jul 2026",
      status: "Pending",
    },
    {
      id: 2,
      site: "Sinhagad Fort",
      category: "built",
      construction_period: "13th Century",
      date: "12 Jul 2026",
      status: "Approved",
    },
    {
      id: 3,
      site: "Pataleshwar Cave Temple",
      category: "built",
      construction_period: "8th Century AD",
      date: "09 Jul 2026",
      status: "Rejected",
    },
    {
      id: 4,
      site: "Aga Khan Palace",
      category: "built",
      construction_period: "1892 AD",
      date: "03 Jul 2026",
      status: "Approved",
    },
    {
      id: 5,
      site: "Lal Mahal",
      category: "built",
      construction_period: "1630 AD",
      date: "28 Jun 2026",
      status: "Pending",
    },
  ];

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

  const filteredUploads = uploads.filter((item) => {
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesSearch = item.site
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });



  return (
    <main className="min-h-screen bg-[#f8ecd7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 text-left">

        {/* Header Section */}
        <div className="py-6 border-b border-heritage-border/20">
          <p className="uppercase tracking-[0.2em] text-[#c28230] text-xs font-bold">
            Volunteer Portal
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#9c2d19] mt-2">
            Upload History
          </h1>
          <p className="mt-3 text-heritage-charcoal/85 text-base leading-relaxed max-w-3xl">
            Track every heritage submission you've made, monitor approval
            progress and review previous contributions.
          </p>
        </div>


        {/* Submissions Section - Styled table with embedded controls */}
        <section className="heritage-card rounded-2xl p-6 md:p-8 space-y-6">
          
          {/* Embedded Table Header with Filters */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-heritage-border/30 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-heritage-espresso">
                Submission Records
              </h2>
              <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
                Review your uploaded heritage structures and their expert verification state.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by heritage site..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-60 border border-heritage-border/60 bg-heritage-cream/20 focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze rounded-lg p-2.5 text-xs font-semibold text-heritage-espresso transition"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-40 border border-heritage-border/60 bg-heritage-cream/20 focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze rounded-lg p-2.5 text-xs font-semibold text-heritage-espresso transition cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-heritage-border/40 text-heritage-charcoal/60 uppercase font-semibold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Site</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Construction Period</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border/20 text-heritage-espresso font-medium">
                {filteredUploads.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-heritage-charcoal/60 font-semibold"
                    >
                      No matching submissions found.
                    </td>
                  </tr>
                ) : (
                  filteredUploads.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-heritage-cream/10 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-heritage-espresso">
                        {item.site}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider font-mono ${getCategoryBadge(
                            item.category
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
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedUpload(item)}
                          className="px-3.5 py-1.5 rounded-lg bg-heritage-red text-white hover:bg-heritage-red/90 transition text-[10px] font-bold uppercase tracking-wider shadow-sm cursor-pointer"
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

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6 border-t border-heritage-border/30 pt-4 font-sans text-xs">
            <p className="text-heritage-charcoal/60 font-medium">
              Showing {filteredUploads.length} of {uploads.length} submissions
            </p>

            <div className="flex gap-2 font-sans font-semibold">
              <button
                className="px-3 py-1.5 rounded-lg border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream disabled:opacity-30 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
                disabled
              >
                Previous
              </button>

              <button
                className="w-7 h-7 flex items-center justify-center rounded-md bg-heritage-red text-white border border-heritage-red shadow-sm cursor-pointer"
              >
                1
              </button>

              <button
                className="px-3 py-1.5 rounded-lg border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream disabled:opacity-30 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Read-Only Details Modal */}
      {selectedUpload && (
        <div className="fixed inset-0 bg-[#1a110b]/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-heritage-border/40 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedUpload(null)}
              className="absolute top-4 right-4 text-heritage-charcoal/60 hover:text-heritage-charcoal text-lg font-bold p-1 cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="border-b border-heritage-border/20 pb-4 text-left">
              <span className={`px-2.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider font-mono ${getCategoryBadge(selectedUpload.category)}`}>
                {selectedUpload.category}
              </span>
              <h3 className="font-serif text-3xl font-extrabold text-[#9c2d19] mt-2">
                {selectedUpload.site}
              </h3>
              <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
                Submitted on {selectedUpload.date}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left font-sans">
              <div className="bg-heritage-cream/15 p-3 rounded-lg border border-heritage-border/30">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">Era / Period</span>
                <span className="text-sm font-semibold text-heritage-espresso">{selectedUpload.construction_period}</span>
              </div>
              <div className="bg-heritage-cream/15 p-3 rounded-lg border border-heritage-border/30">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">Status</span>
                <div className="mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider font-mono ${getStatusBadge(selectedUpload.status)}`}>
                    {selectedUpload.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-left font-sans">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">Historical Significance & Description</span>
                <p className="text-xs text-heritage-charcoal/80 leading-relaxed">
                  This site is of great historical value to the Pune region, representing classical architecture from its construction era. Further documents and photographs have been uploaded for expert review.
                </p>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#9c2d19]">INTACH Verification Note</span>
                <p className="text-xs text-heritage-charcoal/70 leading-relaxed">
                  {selectedUpload.status === "Pending" && "Our heritage experts are currently reviewing the submitted details and geographical references."}
                  {selectedUpload.status === "Approved" && "This site has been successfully verified and added to the official INTACH Pune digital archive."}
                  {selectedUpload.status === "Rejected" && "This submission could not be verified. Please check that all submitted photos and period details are authentic."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-heritage-border/20">
              <button
                onClick={() => setSelectedUpload(null)}
                className="px-5 py-2 rounded-lg bg-heritage-red text-white hover:bg-heritage-red/90 transition text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}