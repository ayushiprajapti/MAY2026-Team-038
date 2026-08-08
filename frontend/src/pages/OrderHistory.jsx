import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderHistory } from "../api/shopApi";

const statusBadge = (status) => {
  const map = {
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    map[status] ||
    "bg-heritage-cream-dark/60 text-heritage-charcoal/70 border-heritage-border/50"
  );
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken =
          localStorage.getItem("access_token") ||
          localStorage.getItem("token") ||
          (() => {
            try {
              const user = JSON.parse(
                localStorage.getItem("intach_user") || "null"
              );
              return user?.access_token || user?.accessToken || null;
            } catch {
              return null;
            }
          })();

        if (!accessToken) {
          setError("Please log in to view your orders.");
          return;
        }

        const data = await getOrderHistory(accessToken);

        const formattedOrders = (data || []).map((order) => ({
          ...order,
          orderId: order.id,
          date: order.placed_at
            ? new Date(order.placed_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "",
          status: order.status,
          items: order.items || [],
          total: (order.total_cents || 0) / 100,
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error("Failed to load order history:", err);
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const buyAgain = (item) => {
    navigate("/checkout", {
      state: {
        buyNow: true,
        items: [{ ...item, quantity: item.quantity || 1 }],
      },
    });
  };

  const viewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const totalOrders = useMemo(() => orders.length, [orders]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8ecd7] flex items-center justify-center px-4">
        <p className="text-sm text-heritage-charcoal/60">
          Loading your orders...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8ecd7] flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-heritage-cream-light border border-heritage-border/80 rounded-xl p-10">
          <h2 className="font-serif text-xl font-bold text-heritage-espresso">
            Unable to Load Orders
          </h2>
          <p className="mt-2 text-sm text-heritage-charcoal/70 font-sans">
            {error}
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-6 bg-heritage-red hover:bg-heritage-red/90 text-white font-semibold text-sm py-2.5 px-6 rounded shadow shadow-heritage-red/15 cursor-pointer transition-colors active:scale-95 duration-150"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8ecd7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-heritage-border/40 pb-6 mb-8">
          <div className="text-left">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-heritage-bronze">
              Warsaa — The Heritage Shop
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-espresso mt-2">
              Order History
            </h1>
            <p className="text-sm text-heritage-charcoal/60 font-sans mt-1">
              {totalOrders} order{totalOrders === 1 ? "" : "s"} placed
            </p>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="shrink-0 bg-heritage-red hover:bg-heritage-red/90 text-white font-semibold text-sm py-2.5 px-5 rounded shadow shadow-heritage-red/15 cursor-pointer transition-colors active:scale-95 duration-150"
          >
            Continue Shopping
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="bg-heritage-cream-light border border-heritage-border/60 rounded-xl p-14 text-center">
            <svg
              className="w-10 h-10 mx-auto text-heritage-charcoal/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l4-4h10l4 4M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8h18M9 12h6"
              />
            </svg>
            <h2 className="font-serif text-xl font-bold text-heritage-espresso mt-4">
              No Orders Yet
            </h2>
            <p className="mt-1.5 text-sm text-heritage-charcoal/70 font-sans">
              Explore our heritage collection and place your first order.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-6 bg-heritage-red hover:bg-heritage-red/90 text-white font-semibold text-sm py-2.5 px-6 rounded shadow shadow-heritage-red/15 cursor-pointer transition-colors active:scale-95 duration-150"
            >
              Shop Now
            </button>
          </div>
        )}

        {/* Orders */}
        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-heritage-cream-light border border-heritage-border/80 rounded-xl shadow-[0_4px_15px_rgba(43,33,24,0.04)] p-6 text-left"
              >
                {/* Order top */}
                <div className="flex flex-wrap justify-between items-center gap-3 pb-4 mb-4 border-b border-heritage-border/30">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-heritage-espresso">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-xs text-heritage-charcoal/60 font-sans mt-0.5">
                      {order.date}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider font-mono ${statusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order details */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-xs text-heritage-charcoal/50">
                        Shipping Address
                      </span>
                      <p className="font-medium text-heritage-espresso">
                        {order.shipping_address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-heritage-border/30">
                  <span className="font-serif font-bold text-heritage-espresso">
                    Total Amount
                  </span>
                  <span className="font-mono text-lg font-bold text-heritage-espresso">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}