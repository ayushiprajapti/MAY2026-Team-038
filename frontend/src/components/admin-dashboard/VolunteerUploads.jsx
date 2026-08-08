import React, { useState } from "react";
import { approve, reject } from "../../api/heritage";
import { ApiError } from "../../api/client";

export default function VolunteerUploads({ uploads: initialUploads = [], onReviewCountChange }) {
  const [uploads, setUploads] = useState(initialUploads);
  const [error, setError] = useState("");

  // Keep local state in sync when the parent re-fetches
  React.useEffect(() => {
    setUploads(initialUploads);
  }, [initialUploads]);

  const activeReviews = uploads.filter((u) => u.status === "pending_review").length;

  const handleAction = async (id, action) => {
    setError("");
    try {
      if (action === "approved") {
        await approve(id);
      } else {
        await reject(id);
      }
      const updated = uploads.map((u) => (u.id === id ? { ...u, status: action } : u));
      setUploads(updated);
      const pendingCount = updated.filter((u) => u.status === "pending_review").length;
      if (onReviewCountChange) onReviewCountChange(pendingCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong, please try again.");
    }
  };

  return (
    <div className="mt-12 text-left">
      <div className="flex justify-between items-end mb-8 border-b border-heritage-border/30 pb-4">
        <div>
          <h4 className="font-serif text-3xl font-bold text-heritage-espresso">
            Volunteer Submissions
          </h4>
          <p className="text-sm text-heritage-charcoal/60 mt-1 font-sans">
            Pending conservation reviews and heritage site uploads
          </p>
        </div>
        <a
          href="/admin-review"
          className="text-heritage-red font-sans text-sm font-bold hover:underline transition-all flex items-center gap-1 cursor-pointer"
        >
          View All Pending ({activeReviews})
        </a>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-sans">
          {error}
        </div>
      )}

      {activeReviews === 0 ? (
        <div className="bg-heritage-cream-light/30 border border-heritage-border/40 rounded-xl p-12 text-center shadow-inner">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h5 className="font-serif text-xl font-bold text-heritage-espresso">
            All Caught Up!
          </h5>
          <p className="text-sm text-heritage-charcoal/60 mt-1 max-w-sm mx-auto font-sans">
            No pending volunteer uploads need review. Chapter database is fully synchronized.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {uploads.map((upload) => {
            const isPending = upload.status === "pending_review";
            return (
              <div
                key={upload.id}
                className={`bg-heritage-cream-light rounded-xl border overflow-hidden shadow-[0_4px_15px_rgba(43,33,24,0.04)] flex flex-col group transition-all duration-500 ${
                  isPending
                    ? "border-heritage-border/80 opacity-100 scale-100"
                    : "border-heritage-border/30 opacity-30 pointer-events-none scale-95"
                }`}
              >
                <div className="h-48 w-full overflow-hidden relative border-b border-heritage-border/20">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    src={upload.image_url}
                    alt={upload.name}
                  />
                  {!isPending && (
                    <div className="absolute inset-0 bg-heritage-espresso/45 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-white bg-heritage-charcoal/80 px-4 py-2 rounded shadow border border-white/20">
                        {upload.status === "approved" ? "Approved" : "Rejected"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-serif text-lg font-bold text-heritage-espresso leading-snug">
                      {upload.name}
                    </h5>
                    <p className="text-xs text-heritage-charcoal/60 font-sans mt-2">
                      Submitted by: {upload.submitted_by || "Unknown volunteer"}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAction(upload.id, "approved")}
                        className="flex items-center justify-center py-2.5 bg-heritage-red text-white rounded hover:bg-heritage-red/90 transition-colors shadow-sm cursor-pointer"
                        title="Approve Submission"
                        disabled={!isPending}
                      >
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleAction(upload.id, "rejected")}
                        className="flex items-center justify-center py-2.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded transition-colors shadow-sm cursor-pointer"
                        title="Reject Submission"
                        disabled={!isPending}
                      >
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
