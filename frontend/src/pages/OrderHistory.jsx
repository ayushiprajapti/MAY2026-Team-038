import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import shopItems from "../data/shopItems";

const findItem = (id) => shopItems.find((item) => item.id === id);

const mockOrders = [
  {
    orderId: "HS1017492001",
    date: "18 Jul 2026",
    status: "In Progress",
    items: [
      { ...findItem(1), quantity: 1 },
      { ...findItem(2), quantity: 2 },
    ],
    total: findItem(1).price * 1 + findItem(2).price * 2,
  },
  {
    orderId: "HS1016301002",
    date: "12 Jul 2026",
    status: "Delivered",
    items: [{ ...findItem(5), quantity: 1 }],
    total: findItem(5).price * 1,
  },
  {
    orderId: "HS1014882003",
    date: "05 Jul 2026",
    status: "Delivered",
    items: [
      { ...findItem(9), quantity: 2 },
      { ...findItem(10), quantity: 1 },
    ],
    total: findItem(9).price * 2 + findItem(10).price * 1,
  },
];

const statusBadge = (status) => {
  const map = {
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return map[status] || "bg-heritage-cream-dark/60 text-heritage-charcoal/70 border-heritage-border/50";
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("heritage_orders")) || [];
    setOrders(savedOrders.length > 0 ? savedOrders : mockOrders);
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

  return (
    <main className="min-h-screen bg-[#f8ecd7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5 border-b border-heritage-border/40 pb-6 mb-8 text-left">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-heritage-bronze">
              Warsaa — The Heritage Shop
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-heritage-espresso mt-2">
              Order History
            </h1>
            <p className="mt-2 text-sm text-heritage-charcoal/70 font-sans">
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
            <svg className="w-10 h-10 mx-auto text-heritage-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4-4h10l4 4M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8h18M9 12h6" />
            </svg>
            <h2 className="font-serif text-xl font-bold text-heritage-espresso mt-4">No Orders Yet</h2>
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
                    <h3 className="font-serif text-lg font-bold text-heritage-espresso">Order #{order.orderId}</h3>
                    <p className="text-xs text-heritage-charcoal/60 font-sans mt-0.5">{order.date}</p>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider font-mono ${statusBadge(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-4 pb-4 border-b border-heritage-border/20 last:border-0 last:pb-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-heritage-border/60 shrink-0"
                      />
                      <div className="flex-1 min-w-[140px]">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-heritage-charcoal/50">
                          {item.category}
                        </span>
                        <h4 className="font-serif font-semibold text-heritage-espresso text-sm">{item.name}</h4>
                        <p className="text-xs text-heritage-charcoal/60 font-sans mt-0.5">
                          Quantity: {item.quantity}
                        </p>
                        <p className="font-mono text-sm font-bold text-heritage-espresso mt-0.5">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => viewProduct(item.id)}
                          className="border border-heritage-border/80 text-heritage-charcoal hover:bg-heritage-cream font-semibold text-xs py-2 px-4 rounded transition-colors active:scale-95 duration-150 cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => buyAgain(item)}
                          className="bg-heritage-red hover:bg-heritage-red/90 text-white font-semibold text-xs py-2 px-4 rounded shadow shadow-heritage-red/15 cursor-pointer transition-colors active:scale-95 duration-150"
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-heritage-border/30">
                  <span className="font-serif font-bold text-heritage-espresso">Total Amount</span>
                  <span className="font-mono text-lg font-bold text-heritage-espresso">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
