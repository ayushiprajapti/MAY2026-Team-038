import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function UploadHistory() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedUpload, setSelectedUpload] = useState(null);

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchUploads = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        setError("You are not logged in. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/volunteer/heritage-submissions`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("intach_user");
            throw new Error("Your session has expired. Please log in again.");
          }

          throw new Error(
            data?.detail || "Failed to load your heritage submissions."
          );
        }

        setUploads(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load your submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, []);

  const formatStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending_review":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status || "Unknown";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

  const filteredUploads = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return uploads.filter((item) => {
      const status = formatStatus(item.status);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const matchesSearch =
        !searchTerm ||
        (item.name || "").toLowerCase().includes(searchTerm);

      return matchesStatus && matchesSearch;
    });
  }, [uploads, statusFilter, search]);

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

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Submissions Section */}
        <section className="heritage-card rounded-2xl p-6 md:p-8 space-y-6">

          {/* Embedded Table Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-heritage-border/30 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-heritage-espresso">
                Submission Records
              </h2>

              <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
                Review your uploaded heritage structures and their expert
                verification state.
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

          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center text-heritage-charcoal/60 font-semibold">
              Loading your submissions...
            </div>
          ) : (
            <>
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
                          {uploads.length === 0
                            ? "You have not submitted any heritage sites yet."
                            : "No matching submissions found."}
                        </td>
                      </tr>
                    ) : (
                      filteredUploads.map((item) => {
                        const status = formatStatus(item.status);

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-heritage-cream/10 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-semibold text-heritage-espresso">
                              {item.name || "Unnamed Site"}
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider font-mono ${getCategoryBadge(
                                  item.category
                                )}`}
                              >
                                {item.category || "—"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-heritage-charcoal/80">
                              {item.construction_period || "—"}
                            </td>

                            <td className="py-3.5 px-4 text-heritage-charcoal/80">
                              {formatDate(item.created_at)}
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider font-mono ${getStatusBadge(
                                  status
                                )}`}
                              >
                                {status}
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary / Pagination */}
              <div className="flex justify-between items-center mt-6 border-t border-heritage-border/30 pt-4 font-sans text-xs">
                <p className="text-heritage-charcoal/60 font-medium">
                  Showing {filteredUploads.length} of {uploads.length}{" "}
                  submissions
                </p>

                <div className="flex gap-2 font-sans font-semibold">
                  <button
                    className="px-3 py-1.5 rounded-lg border border-heritage-border/60 text-heritage-charcoal opacity-30 cursor-not-allowed"
                    disabled
                  >
                    Previous
                  </button>

                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-heritage-red text-white border border-heritage-red shadow-sm"
                    disabled
                  >
                    1
                  </button>

                  <button
                    className="px-3 py-1.5 rounded-lg border border-heritage-border/60 text-heritage-charcoal opacity-30 cursor-not-allowed"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Details Modal */}
      {selectedUpload && (
        <div className="fixed inset-0 bg-[#1a110b]/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl border border-heritage-border/40 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => setSelectedUpload(null)}
              className="absolute top-4 right-4 text-heritage-charcoal/60 hover:text-heritage-charcoal text-lg font-bold p-1 cursor-pointer transition-colors"
              aria-label="Close"
            >
              ×
            </button>

            <div className="border-b border-heritage-border/20 pb-4 text-left pr-8">
              <span
                className={`px-2.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider font-mono ${getCategoryBadge(
                  selectedUpload.category
                )}`}
              >
                {selectedUpload.category || "Unknown"}
              </span>

              <h3 className="font-serif text-3xl font-extrabold text-[#9c2d19] mt-2">
                {selectedUpload.name || "Unnamed Site"}
              </h3>

              <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
                Submitted on {formatDate(selectedUpload.created_at)}
              </p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4 text-left font-sans">

              <div className="bg-heritage-cream/15 p-3 rounded-lg border border-heritage-border/30">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">
                  Era / Period
                </span>

                <span className="text-sm font-semibold text-heritage-espresso">
                  {selectedUpload.construction_period || "Not provided"}
                </span>
              </div>

              <div className="bg-heritage-cream/15 p-3 rounded-lg border border-heritage-border/30">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">
                  Status
                </span>

                <div className="mt-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider font-mono ${getStatusBadge(
                      formatStatus(selectedUpload.status)
                    )}`}
                  >
                    {formatStatus(selectedUpload.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1 text-left font-sans">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">
                Location
              </span>

              <p className="text-xs text-heritage-charcoal/80 leading-relaxed">
                {selectedUpload.address || "No address provided."}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1 text-left font-sans">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">
                Description
              </span>

              <p className="text-xs text-heritage-charcoal/80 leading-relaxed">
                {selectedUpload.description ||
                  "No description was provided."}
              </p>
            </div>

            {/* Historical Significance */}
            <div className="space-y-1 text-left font-sans">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">
                Historical Significance
              </span>

              <p className="text-xs text-heritage-charcoal/80 leading-relaxed">
                {selectedUpload.historical_significance ||
                  "No historical significance details were provided."}
              </p>
            </div>

            {/* Review Information */}
            <div className="space-y-1 text-left font-sans">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#9c2d19]">
                INTACH Verification Note
              </span>

              <p className="text-xs text-heritage-charcoal/70 leading-relaxed">
                {selectedUpload.review_notes ||
                  (formatStatus(selectedUpload.status) === "Pending"
                    ? "Our heritage experts are currently reviewing the submitted details."
                    : formatStatus(selectedUpload.status) === "Approved"
                    ? "This submission has been successfully verified."
                    : formatStatus(selectedUpload.status) === "Rejected"
                    ? "This submission was rejected during the verification process."
                    : "No verification note is available.")}
              </p>

              {selectedUpload.reviewed_at && (
                <p className="text-[10px] text-heritage-charcoal/50 pt-1">
                  Reviewed on {formatDate(selectedUpload.reviewed_at)}
                </p>
              )}
            </div>

            {/* Coordinates */}
            {(selectedUpload.latitude !== null ||
              selectedUpload.longitude !== null) && (
              <div className="grid grid-cols-2 gap-4 text-left font-sans">
                <div className="bg-heritage-cream/15 p-3 rounded-lg border border-heritage-border/30">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">
                    Latitude
                  </span>

                  <span className="text-xs font-semibold text-heritage-espresso">
                    {selectedUpload.latitude ?? "—"}
                  </span>
                </div>

                <div className="bg-heritage-cream/15 p-3 rounded-lg border border-heritage-border/30">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-heritage-charcoal/55">
                    Longitude
                  </span>

                  <span className="text-xs font-semibold text-heritage-espresso">
                    {selectedUpload.longitude ?? "—"}
                  </span>
                </div>
              </div>
            )}

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