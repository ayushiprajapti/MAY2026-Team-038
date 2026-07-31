import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const inputClass =
  "w-full rounded-lg border border-heritage-border/60 bg-heritage-cream/20 px-4 py-2.5 text-sm text-heritage-espresso focus:outline-none focus:border-heritage-bronze focus:ring-1 focus:ring-heritage-bronze transition";

const labelClass = "block mb-1.5 text-xs font-bold uppercase tracking-wider text-heritage-charcoal/70";

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay with cash when your order arrives" },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
  { id: "upi", label: "UPI", desc: "Pay using any UPI app" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const isBuyNow = location.state?.buyNow || false;

  useEffect(() => {
    if (isBuyNow && location.state?.items) {
      setCartItems(location.state.items);
    } else {
      const cart = JSON.parse(localStorage.getItem("heritage_cart")) || [];
      setCartItems(cart);
    }
  }, [location.state, isBuyNow]);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    if (!isBuyNow) {
      localStorage.setItem("heritage_cart", JSON.stringify(updatedCart));
    }
  };

  const increaseQuantity = (id) => {
    updateCart(cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decreaseQuantity = (id) => {
    updateCart(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    updateCart(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    if (!isBuyNow) localStorage.removeItem("heritage_cart");
  };

  const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const previousOrders = JSON.parse(localStorage.getItem("heritage_orders")) || [];
    const newOrder = {
      orderId: `HS${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: "In Progress",
      items: [...cartItems],
      total: totalAmount,
      shipping,
      paymentMethod,
    };

    previousOrders.unshift(newOrder);
    localStorage.setItem("heritage_orders", JSON.stringify(previousOrders));

    if (!isBuyNow) localStorage.removeItem("heritage_cart");

    setCartItems([]);
    setOrderPlaced(true);
    setTimeout(() => navigate("/orders"), 1800);
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#f8ecd7] flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-heritage-cream-light border border-heritage-border/80 rounded-xl shadow-[0_4px_15px_rgba(43,33,24,0.04)] p-10">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-heritage-espresso mt-5">Order Placed Successfully!</h2>
          <p className="mt-2 text-sm text-heritage-charcoal/70 font-sans">
            Thank you for supporting India's heritage artisans. Redirecting to your orders...
          </p>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8ecd7] flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-heritage-cream-light border border-heritage-border/80 rounded-xl shadow-[0_4px_15px_rgba(43,33,24,0.04)] p-10">
          <svg className="w-10 h-10 mx-auto text-heritage-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="font-serif text-xl font-bold text-heritage-espresso mt-4">No Items Available</h2>
          <p className="mt-1.5 text-sm text-heritage-charcoal/70 font-sans">Your cart is empty right now.</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between border-b border-heritage-border/40 pb-6 mb-8">
          <div className="text-left">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-heritage-bronze">
              Warsaa — The Heritage Shop
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-espresso mt-2">
              {isBuyNow ? "Buy Now" : "Checkout"}
            </h1>
          </div>
          {!isBuyNow && (
            <button
              onClick={clearCart}
              className="text-xs font-bold uppercase tracking-wider text-heritage-charcoal/60 hover:text-heritage-red transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left column */}
          <div className="space-y-6 text-left">
            {/* Delivery Address */}
            <section className="bg-heritage-cream-light rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] p-6">
              <h2 className="font-serif text-xl font-bold text-heritage-espresso border-b border-heritage-border/30 pb-3 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-heritage-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    required
                    name="fullName"
                    value={shipping.fullName}
                    onChange={handleShippingChange}
                    className={inputClass}
                    placeholder="Example: Rahul Sharma"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={shipping.phone}
                    onChange={handleShippingChange}
                    className={inputClass}
                    placeholder="Example: +91 98765 43210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input
                    required
                    name="address"
                    value={shipping.address}
                    onChange={handleShippingChange}
                    className={inputClass}
                    placeholder="Enter complete address"
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    required
                    name="city"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    className={inputClass}
                    placeholder="Example: Pune"
                  />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input
                    required
                    name="state"
                    value={shipping.state}
                    onChange={handleShippingChange}
                    className={inputClass}
                    placeholder="Example: Maharashtra"
                  />
                </div>
                <div>
                  <label className={labelClass}>PIN Code</label>
                  <input
                    required
                    name="pincode"
                    value={shipping.pincode}
                    onChange={handleShippingChange}
                    className={inputClass}
                    placeholder="Example: 411011"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-heritage-cream-light rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] p-6">
              <h2 className="font-serif text-xl font-bold text-heritage-espresso border-b border-heritage-border/30 pb-3 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-heritage-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
                Payment Method
              </h2>
              <div className="space-y-2.5">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? "border-heritage-bronze bg-heritage-cream/60"
                        : "border-heritage-border/50 hover:bg-heritage-cream/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-1 h-4 w-4 text-heritage-red focus:ring-heritage-red"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-heritage-espresso">{method.label}</span>
                      <span className="block text-xs text-heritage-charcoal/60 mt-0.5">{method.desc}</span>
                    </span>
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-heritage-border/30">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Card Number</label>
                    <input required inputMode="numeric" maxLength={19} className={inputClass} placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <label className={labelClass}>Expiry</label>
                    <input required className={inputClass} placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className={labelClass}>CVV</label>
                    <input required inputMode="numeric" maxLength={3} type="password" className={inputClass} placeholder="•••" />
                  </div>
                </div>
              )}
            </section>

            {/* Items */}
            <section className="bg-heritage-cream-light rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] p-6">
              <h2 className="font-serif text-xl font-bold text-heritage-espresso border-b border-heritage-border/30 pb-3 mb-4">
                Order Items ({totalItems})
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-4 pb-4 border-b border-heritage-border/20 last:border-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-heritage-border/60 shrink-0"
                    />
                    <div className="flex-1 min-w-[120px]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-heritage-charcoal/50">
                        {item.category}
                      </span>
                      <h4 className="font-serif font-semibold text-heritage-espresso text-sm truncate">{item.name}</h4>
                      <p className="font-mono text-sm font-bold text-heritage-espresso mt-0.5">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-heritage-cream border border-heritage-border/60 rounded-lg px-2 py-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-6 h-6 flex items-center justify-center rounded text-heritage-espresso hover:bg-heritage-cream-dark transition-colors cursor-pointer font-bold"
                      >
                        −
                      </button>
                      <span className="min-w-[1.25rem] text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="w-6 h-6 flex items-center justify-center rounded text-heritage-espresso hover:bg-heritage-cream-dark transition-colors cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="p-1.5 text-heritage-charcoal/50 hover:text-heritage-red hover:bg-heritage-cream rounded-md transition-colors cursor-pointer shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column — sticky order summary */}
          <div className="lg:sticky lg:top-8">
            <section className="bg-heritage-cream-light rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] p-6 text-left">
              <h2 className="font-serif text-xl font-bold text-heritage-espresso border-b border-heritage-border/30 pb-3 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2.5 text-sm font-sans">
                <div className="flex justify-between text-heritage-charcoal/80">
                  <span>Items ({totalItems})</span>
                  <span className="font-mono font-semibold text-heritage-espresso">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-heritage-charcoal/80">
                  <span>Delivery</span>
                  <span className="font-semibold text-emerald-700">FREE</span>
                </div>
              </div>
              <div className="border-t border-heritage-border/40 mt-4 pt-4 flex justify-between items-center">
                <span className="font-serif text-lg font-bold text-heritage-espresso">Total</span>
                <span className="font-mono text-xl font-bold text-heritage-espresso">₹{totalAmount}</span>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-heritage-red hover:bg-heritage-red/90 text-white font-semibold text-sm py-3 rounded shadow shadow-heritage-red/15 cursor-pointer transition-colors active:scale-95 duration-150"
              >
                {isBuyNow ? "Buy Now" : "Place Order"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="mt-3 w-full border border-heritage-border/80 text-heritage-charcoal hover:bg-heritage-cream font-semibold text-sm py-3 rounded transition-colors active:scale-95 duration-150 cursor-pointer"
              >
                Continue Shopping
              </button>

              <p className="mt-4 flex items-center gap-1.5 text-[11px] text-heritage-charcoal/50 font-sans">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout — your information is safe with us.
              </p>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}
