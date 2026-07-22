import { useEffect } from "react";
import { motion } from "framer-motion";

const statusBadge = (status) => {
  const map = {
    "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
  };
  return map[status] || "bg-heritage-cream-dark/60 text-heritage-charcoal/70 border-heritage-border/50";
};

const factBadge = "bg-heritage-cream text-heritage-charcoal border-heritage-border";

function HeritageModal({ submission, onClose, onApprove, onReject }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!submission) return null;

  const facts = [
    { label: "Heritage Type", value: submission.heritageType },
    { label: "Era", value: submission.era },
    { label: "Condition", value: submission.condition },
    { label: "City", value: submission.city },
    { label: "State", value: submission.state },
    { label: "PIN Code", value: submission.pincode },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-heritage-espresso/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-heritage-cream-light rounded-xl border border-heritage-border/80 shadow-2xl w-full max-w-3xl grid grid-cols-1 sm:grid-cols-[minmax(160px,280px)_1fr] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${submission.site} submission details`}
      >
        <img
          src={submission.image}
          alt={submission.site}
          className="w-full h-40 sm:h-full object-contain bg-heritage-cream-dark/20"
        />

        <div className="relative p-5 text-left">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 p-1 rounded-md text-heritage-charcoal/50 hover:text-heritage-red hover:bg-heritage-cream transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="pr-8">
            <h2 className="font-serif text-lg font-bold text-heritage-espresso leading-tight">{submission.site}</h2>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className={`inline-block px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider font-mono ${factBadge}`}>
                {submission.category}
              </span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider font-mono ${statusBadge(submission.status)}`}
              >
                {submission.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-3 gap-y-2 mt-3">
            {facts.map((fact) => (
              <div key={fact.label}>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-heritage-charcoal/50 font-sans">
                  {fact.label}
                </span>
                <p className="mt-0.5 text-xs font-semibold text-heritage-espresso truncate" title={fact.value}>
                  {fact.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-1.5 text-xs text-heritage-charcoal/80">
            <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              {submission.address}, {submission.city}, {submission.state} {submission.pincode}
            </span>
          </div>

          <p className="mt-3 text-xs text-heritage-charcoal/80 leading-relaxed line-clamp-2">
            {submission.description}
          </p>

          <div className="mt-3 pt-3 border-t border-heritage-border/40 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-heritage-charcoal/70">
            <span className="font-semibold text-heritage-espresso">{submission.contactName}</span>
            <span>{submission.contactEmail}</span>
            <span>{submission.contactPhone}</span>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-4">
            <button
              onClick={() => {
                onApprove(submission.id);
                onClose();
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded shadow shadow-emerald-600/15 cursor-pointer transition-colors active:scale-95 duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={() => {
                if (onReject(submission.id, submission.site)) onClose();
              }}
              className="flex items-center gap-1.5 bg-heritage-red hover:bg-heritage-red/90 text-white font-semibold text-xs py-2 px-4 rounded shadow shadow-heritage-red/15 cursor-pointer transition-colors active:scale-95 duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HeritageModal;
