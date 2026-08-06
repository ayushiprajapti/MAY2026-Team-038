import React, { useState, useEffect } from "react";
import { getAllOrders } from "../../api/shop";
import { ApiError } from "../../api/client";

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    let cancelled = false;
    getAllOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.detail
              : "Something went wrong, please try again."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "paid":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "pending":
        return "bg-heritage-cream text-heritage-espresso border-heritage-border/60";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-heritage-cream text-heritage-charcoal border-heritage-border";
    }
  };

  const formatCentsToINR = (cents) => {
    return (cents / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="bg-heritage-cream-light p-6 md:p-8 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] text-left">
      <div className="mb-6">
        <h4 className="font-serif text-2xl font-semibold text-heritage-espresso">
          Recent Orders
        </h4>
        <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
          Overview of customer orders processed through the marketplace
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-sans">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm font-sans text-heritage-charcoal/60 py-6 text-center">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm font-sans text-heritage-charcoal/60 py-6 text-center">No orders yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-heritage-border/40 text-heritage-charcoal/60 uppercase font-semibold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Shipping Address</th>
                  <th className="py-3 px-4">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-heritage-border/20 text-heritage-espresso font-medium">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-heritage-cream/10 transition-colors">
                    <td className="py-3.5 px-4 font-mono select-all text-heritage-red font-semibold">{order.id}</td>
                    <td className="py-3.5 px-4">{order.full_name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider font-mono ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-sm">
                      {formatCentsToINR(order.total_cents)}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate" title={order.shipping_address}>
                      {order.shipping_address}
                    </td>
                    <td className="py-3.5 px-4 text-heritage-charcoal/80">
                      {formatDate(order.placed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 border-t border-heritage-border/30 pt-4 font-sans text-xs select-none">
            <div className="text-heritage-charcoal/60 font-medium">
              Showing {orders.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, orders.length)} of {orders.length} entries
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 cursor-pointer"
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
                  className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 cursor-pointer"
                  title="Next Page"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
