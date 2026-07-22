import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeritageModal from "./HeritageModal";

import charminarImg from "../../assets/heritage/charminar.jpg";
import golcondaImg from "../../assets/heritage/golconda.jpg";
import warangalImg from "../../assets/heritage/warangal.jpg";

const initialSubmissions = [
  {
    id: 1,
    site: "Charminar",
    category: "Mosque",
    heritageType: "Tangible",
    era: "16th Century",
    address: "Charminar Road, Ghansi Bazaar",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500002",
    mapsLink: "",
    description:
      "A monumental mosque and landmark built to commemorate the founding of Hyderabad, with four grand arches facing the cardinal directions.",
    significance: "One of the most recognisable examples of Qutb Shahi architecture in India.",
    condition: "Good",
    contactName: "Volunteer 101",
    contactEmail: "volunteer101@example.com",
    contactPhone: "+91 90000 00101",
    dateSubmitted: "Today",
    image: charminarImg,
    status: "Pending Review",
  },
  {
    id: 2,
    site: "Golconda Fort",
    category: "Fort",
    heritageType: "Tangible",
    era: "16th Century",
    address: "Ibrahim Bagh Road, Near Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500008",
    mapsLink: "",
    description:
      "A fortified citadel known for its acoustic architecture, sprawling ramparts and the ruins of royal apartments.",
    significance: "A major Qutb Shahi dynasty stronghold and a well-known example of military architecture.",
    condition: "Needs Restoration",
    contactName: "Volunteer 204",
    contactEmail: "volunteer204@example.com",
    contactPhone: "+91 90000 00204",
    dateSubmitted: "Today",
    image: golcondaImg,
    status: "Pending Review",
  },
  {
    id: 3,
    site: "Warangal Fort",
    category: "Fort",
    heritageType: "Tangible",
    era: "13th Century",
    address: "Fort Road",
    city: "Warangal",
    state: "Telangana",
    pincode: "506002",
    mapsLink: "",
    description:
      "A Kakatiya-dynasty fort recognised for its carved stone gateways (Kirti Toranas) and remnants of its outer fortifications.",
    significance: "A key surviving monument of Kakatiya rule and Deccan military architecture.",
    condition: "Ruins",
    contactName: "Volunteer 315",
    contactEmail: "volunteer315@example.com",
    contactPhone: "+91 90000 00315",
    dateSubmitted: "Today",
    image: warangalImg,
    status: "Pending Review",
  },
];

const ITEMS_PER_PAGE = 2;

const statusBadge = (status) => {
  const map = {
    "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
  };
  return map[status] || "bg-heritage-cream-dark/60 text-heritage-charcoal/70 border-heritage-border/50";
};

function AdminReview() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [approvedToday, setApprovedToday] = useState(12);
  const [rejectedToday, setRejectedToday] = useState(2);
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleApprove = (id) => {
    setSubmissions((prev) => prev.filter((submission) => submission.id !== id));
    setApprovedToday((n) => n + 1);
  };

  const handleReject = (id, site) => {
    if (!window.confirm(`Reject the submission for "${site}"? This cannot be undone.`)) return false;
    setSubmissions((prev) => prev.filter((submission) => submission.id !== id));
    setRejectedToday((n) => n + 1);
    return true;
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
  };

  const filteredSubmissions = useMemo(
    () =>
      submissions.filter((submission) =>
        submission.site.toLowerCase().includes(search.toLowerCase())
      ),
    [submissions, search]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageSubmissions = filteredSubmissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <main className="p-8 md:p-12 overflow-y-auto w-full h-full text-heritage-espresso bg-[#f8ecd7]/90">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-10 text-left">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-heritage-bronze">
            INTACH Heritage Management
          </p>
          <h2 className="font-serif text-3xl font-bold text-heritage-espresso mt-2">
            Volunteer Submission Review
          </h2>
          <p className="text-sm text-heritage-charcoal/70 mt-1 font-sans max-w-2xl">
            Review, verify and manage heritage submissions contributed by registered
            volunteers before publishing them on the heritage portal.
          </p>
        </div>
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-left">
        <div className="bg-heritage-cream-light p-5 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)]">
          <div className="flex items-center gap-2 text-heritage-charcoal/60">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4-4h10l4 4M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8h18M9 12h6" />
            </svg>
            <p className="font-sans text-xs font-semibold uppercase tracking-wider">Pending</p>
          </div>
          <h3 className="font-serif text-2xl font-bold text-heritage-espresso mt-1">{submissions.length}</h3>
          <p className="text-[10px] text-heritage-charcoal/50 font-sans mt-1.5">Awaiting your review</p>
        </div>

        <div className="bg-heritage-cream-light p-5 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)]">
          <div className="flex items-center gap-2 text-emerald-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-heritage-charcoal/60">Approved Today</p>
          </div>
          <h3 className="font-serif text-2xl font-bold text-heritage-espresso mt-1">{approvedToday}</h3>
          <p className="text-[10px] text-heritage-charcoal/50 font-sans mt-1.5">Published to the heritage portal</p>
        </div>

        <div className="bg-heritage-cream-light p-5 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)]">
          <div className="flex items-center gap-2 text-heritage-red">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-heritage-charcoal/60">Rejected Today</p>
          </div>
          <h3 className="font-serif text-2xl font-bold text-heritage-espresso mt-1">{rejectedToday}</h3>
          <p className="text-[10px] text-heritage-charcoal/50 font-sans mt-1.5">Returned for correction</p>
        </div>
      </section>

      {/* Submissions Card */}
      <section className="mb-8">
        <div className="bg-heritage-cream-light rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] text-left overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h4 className="font-serif text-2xl font-semibold text-heritage-espresso">
                  Pending Heritage Submissions
                </h4>
                <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
                  {submissions.length} submission(s) awaiting review
                </p>
              </div>

              <input
                type="text"
                placeholder="Search heritage site..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search heritage site submissions"
                className="bg-heritage-cream border border-heritage-border/60 text-heritage-espresso text-xs rounded font-sans px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-heritage-bronze w-full sm:w-64"
              />
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="rounded-lg bg-heritage-cream/60 border border-heritage-border/40 p-10 text-center">
                <svg className="w-8 h-8 mx-auto text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h5 className="font-serif text-lg font-semibold text-heritage-espresso mt-3">All caught up!</h5>
                <p className="text-sm font-sans text-heritage-charcoal/60 mt-1">
                  There are currently no volunteer submissions waiting for review.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-heritage-border/40 text-heritage-charcoal/60 uppercase font-semibold tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Site</th>
                      <th className="py-2.5 px-3">Submitted By</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Submitted</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 w-32 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-heritage-border/20 text-heritage-espresso font-medium">
                    <AnimatePresence initial={false}>
                      {pageSubmissions.map((submission) => (
                        <motion.tr
                          key={submission.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="hover:bg-heritage-cream/30 transition-colors"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={submission.image}
                                alt={submission.site}
                                className="w-12 h-12 rounded-lg object-cover border border-heritage-border/60 shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-sm">{submission.site}</p>
                                <p className="text-[10px] text-heritage-charcoal/60 flex items-center gap-1 mt-0.5">
                                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {submission.city}, {submission.state}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-heritage-charcoal/80">{submission.contactName}</td>
                          <td className="py-3 px-3 text-heritage-charcoal/80">{submission.category}</td>
                          <td className="py-3 px-3 text-heritage-charcoal/60">{submission.dateSubmitted}</td>
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider font-mono ${statusBadge(submission.status)}`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 w-32">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleApprove(submission.id)}
                                aria-label={`Approve submission for ${submission.site}`}
                                title="Approve"
                                className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 rounded-md transition-all cursor-pointer shadow-sm active:scale-90"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleReject(submission.id, submission.site)}
                                aria-label={`Reject submission for ${submission.site}`}
                                title="Reject"
                                className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-md transition-all cursor-pointer shadow-sm active:scale-90"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleView(submission)}
                                aria-label={`View details for ${submission.site} submission`}
                                title="View Details"
                                className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:text-heritage-red hover:bg-heritage-cream rounded-md transition-all cursor-pointer shadow-sm active:scale-90"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 border-t border-heritage-border/30 pt-4 font-sans text-xs select-none">
                  <div className="text-heritage-charcoal/60 font-medium">
                    Showing {filteredSubmissions.length === 0 ? 0 : startIndex + 1} to{" "}
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredSubmissions.length)} of{" "}
                    {filteredSubmissions.length} submissions
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Go to page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                          className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold transition-all active:scale-95 cursor-pointer ${
                            currentPage === page
                              ? "bg-heritage-red text-white border-heritage-red shadow-sm"
                              : "border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream hover:text-heritage-red"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedSubmission && (
          <HeritageModal
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default AdminReview;
