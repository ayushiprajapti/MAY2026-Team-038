import React, { useState } from "react";
import charminarImg from "../../assets/heritage/charminar.jpg";
import golcondaImg from "../../assets/heritage/golconda.jpg";
import warangalImg from "../../assets/heritage/warangal.jpg";

export default function VolunteerUploads({ onReviewCountChange }) {
  // DBML-aligned mock data with enums (category: built, natural, craft, intangible)
  const initialUploads = [
    {
      id: "upl-1",
      site: "Shaniwar Wada Restoration Gates",
      category: "built", // DBML category enum
      description: "Detailed assessment of the fortification walls and lotus fountain drainage systems.",
      volunteer: "Anjali Deshpande",
      image: charminarImg,
      location: "Pune, Maharashtra",
      status: "pending_review", // DBML site_status enum
    },
    {
      id: "upl-2",
      site: "Pataleshwar Caves Monolithic Shrine",
      category: "natural", // DBML category enum
      description: "Report on moisture seepage in the monolithic circular shrine during pre-monsoon checks.",
      volunteer: "Rahul Kulkarni",
      image: golcondaImg,
      location: "Pune, Maharashtra",
      status: "pending_review", // DBML site_status enum
    },
    {
      id: "upl-3",
      site: "Tambat Ali Copper matharkaam",
      category: "craft", // DBML category enum
      description: "Video interview and technical breakdown of the 'matharkaam' (hammering) technique.",
      volunteer: "Sanya Verma",
      image: warangalImg,
      location: "Pune, Maharashtra",
      status: "pending_review", // DBML site_status enum
    },
  ];

  const [uploads, setUploads] = useState(initialUploads);
  const [activeReviews, setActiveReviews] = useState(initialUploads.length);

  const handleAction = (id, newStatus) => {
    // Fade out or filter approved/rejected items
    const updated = uploads.map((u) => {
      if (u.id === id) {
        return { ...u, status: newStatus };
      }
      return u;
    });

    setUploads(updated);

    const pendingCount = updated.filter((u) => u.status === "pending_review").length;
    setActiveReviews(pendingCount);

    if (onReviewCountChange) {
      onReviewCountChange(pendingCount);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "built":
        return "bg-heritage-red/10 text-heritage-red border-heritage-red/20";
      case "natural":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "craft":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-heritage-cream text-heritage-charcoal border-heritage-border";
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
            Pending conservation reviews and heritage site uploads (DBML status: pending_review)
          </p>
        </div>
        <button
          onClick={() => alert("Redirecting to all submissions archive...")}
          className="text-heritage-red font-sans text-sm font-bold hover:underline transition-all flex items-center gap-1 cursor-pointer"
        >
          View All Pending ({activeReviews})
        </button>
      </div>

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
                    src={upload.image}
                    alt={upload.site}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${getCategoryColor(upload.category)}`}>
                      {upload.category}
                    </span>
                  </div>
                  
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
                      {upload.site}
                    </h5>
                    <p className="text-xs text-heritage-charcoal/70 mt-2 font-sans line-clamp-3 leading-relaxed">
                      {upload.description}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center gap-2 text-xs text-heritage-charcoal/60 font-sans border-t border-heritage-border/10 pt-4 mb-5">
                      <svg className="w-4 h-4 text-heritage-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{upload.location}</span>
                      <span className="text-heritage-charcoal/20">|</span>
                      <span>By: {upload.volunteer}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
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

                      <button
                        onClick={() => alert(`Showing full metadata, GPS telemetry, and photos for: ${upload.site}`)}
                        className="flex items-center justify-center py-2.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded transition-colors shadow-sm cursor-pointer"
                        title="View Details"
                        disabled={!isPending}
                      >
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
