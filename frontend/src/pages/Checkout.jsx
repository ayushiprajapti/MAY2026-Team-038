import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = location.state?.cartItems || [];
  const totalAmount = location.state?.totalAmount || 0;

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handlePurchase = () => {
    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      alert("Please fill all the details.");
      return;
    }

    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-success-card">
          <h1>🎉 Purchase Successful!</h1>

          <p>
            Thank you for supporting India's cultural heritage through INTACH.
          </p>

          <button
            className="complete-btn"
            onClick={() => navigate("/shop")}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <header className="checkout-header">
        <h1>INTACH Heritage Marketplace</h1>
        <p>Secure Checkout</p>
      </header>

      <div className="checkout-container">

        <div className="customer-section">

          <h2>Customer Details</h2>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

          <label>Street Address</label>
          <textarea
            name="address"
            rows="3"
            value={customer.address}
            onChange={handleChange}
            placeholder="House No, Street..."
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            value={customer.city}
            onChange={handleChange}
            placeholder="City"
          />

          <label>State</label>
          <input
            type="text"
            name="state"
            value={customer.state}
            onChange={handleChange}
            placeholder="State"
          />

                    <label>PIN Code</label>
          <input
            type="text"
            name="pincode"
            value={customer.pincode}
            onChange={handleChange}
            placeholder="PIN Code"
          />
        </div>

        <div className="summary-section">

          <h2>Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="empty-cart-msg">
              Your cart is empty.
            </p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div className="summary-item" key={index}>
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}

              <hr />

              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </>
          )}

          <button
            className="complete-btn"
            onClick={handlePurchase}
            disabled={cartItems.length === 0}
          >
            Complete Purchase
          </button>

          <button
            className="back-btn"
            onClick={() => navigate("/shop")}
          >
            ← Back to Shop
          </button>

        </div>

      </div>

    </div>
  );
}