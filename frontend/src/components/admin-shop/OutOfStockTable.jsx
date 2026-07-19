import React, { useState, useEffect } from "react";

export default function OutOfStockTable({ products, onRestock }) {
  const [restockValues, setRestockValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const outOfStockItems = products.filter((p) => p.stock_quantity === 0 && p.is_active);
  const itemsPerPage = 3;

  // Adjust page number if it exceeds bounds after restock
  useEffect(() => {
    const maxPage = Math.ceil(outOfStockItems.length / itemsPerPage);
    if (maxPage > 0 && currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [outOfStockItems.length, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = outOfStockItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(outOfStockItems.length / itemsPerPage);

  const handleRestockSubmit = (id) => {
    const qty = parseInt(restockValues[id], 10);
    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a valid stock quantity to restock.");
      return;
    }
    // Call parent restock callback
    onRestock(id, qty);
    // Clear input value
    setRestockValues({ ...restockValues, [id]: "" });
  };

  const handleInputChange = (id, val) => {
    setRestockValues({ ...restockValues, [id]: val });
  };

  const formatCentsToINR = (cents) => {
    return (cents / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-heritage-cream-light p-6 md:p-8 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] text-left flex flex-col justify-between h-full min-w-0">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h4 className="font-serif text-2xl font-semibold text-heritage-espresso flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-heritage-red animate-pulse" />
              Stock Alerts
            </h4>
            <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
              Active catalog items currently out of stock. Add stock to make them active.
            </p>
          </div>
          {outOfStockItems.length > 0 && (
            <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
              {outOfStockItems.length} Critical
            </span>
          )}
        </div>

        {outOfStockItems.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center font-sans">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-heritage-espresso">All items in stock</p>
            <p className="text-xs text-heritage-charcoal/60 mt-1">Excellent! No critical catalog shortage alerts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-heritage-border/40 text-heritage-charcoal/60 uppercase font-semibold tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 w-12">Image</th>
                  <th className="py-2.5 px-3 w-24">SKU</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3 w-20">Price</th>
                  <th className="py-2.5 px-3 w-36 text-center">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border/20 text-heritage-espresso font-medium">
                {paginatedItems.map((p) => (
                  <tr key={p.id} className="hover:bg-heritage-cream/10 transition-colors">
                    <td className="py-2.5 px-3 w-12">
                      <div className="w-8 h-8 rounded border border-heritage-border/30 overflow-hidden bg-heritage-cream flex items-center justify-center">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 w-24 font-mono font-bold text-[10px] text-heritage-red uppercase">
                      {p.sku}
                    </td>
                    <td className="py-2.5 px-3 text-sm font-semibold truncate max-w-[120px]" title={p.name}>
                      {p.name}
                    </td>
                    <td className="py-2.5 px-3 w-20 text-sm font-semibold">
                      {formatCentsToINR(p.price_cents)}
                    </td>
                    <td className="py-2.5 px-3 w-36">
                      <div className="flex items-center gap-1.5 justify-center">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={restockValues[p.id] || ""}
                          onChange={(e) => handleInputChange(p.id, e.target.value)}
                          className="bg-heritage-cream border border-heritage-border text-heritage-espresso text-xs rounded px-2 py-1 focus:outline-none w-14 text-center font-sans"
                        />
                        <button
                          onClick={() => handleRestockSubmit(p.id)}
                          className="px-2.5 py-1 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md font-semibold text-[10px] uppercase tracking-wider cursor-pointer shadow-sm transition-all active:scale-95 duration-100"
                        >
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 border-t border-heritage-border/30 pt-4 font-sans text-xs select-none">
              <div className="text-heritage-charcoal/60 font-medium">
                Showing {outOfStockItems.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, outOfStockItems.length)} of {outOfStockItems.length} entries
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 cursor-pointer"
                    title="Previous Page"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                        currentPage === page
                          ? "bg-heritage-red text-white border-heritage-red shadow-sm"
                          : "border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream hover:text-heritage-red"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 cursor-pointer"
                    title="Next Page"
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
  );
}
