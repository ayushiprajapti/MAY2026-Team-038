import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

export default function OrderHistory() {
  const navigate = useNavigate();

  const orders = [
    {
      id: "ORD1001",
      product: "Pune Heritage Directory & Guide",
      quantity: 1,
      price: "₹750",
      date: "18 Jul 2026",
      status: "Delivered",
    },
    {
      id: "ORD1002",
      product: "INTACH Heritage Calendar",
      quantity: 2,
      price: "₹600",
      date: "15 Jul 2026",
      status: "Processing",
    },
    {
      id: "ORD1003",
      product: "Heritage Coffee Table Book",
      quantity: 1,
      price: "₹1,250",
      date: "10 Jul 2026",
      status: "Delivered",
    },
  ];

  return (
    <div className="orders-page">

      <header className="orders-header">
        <h1>INTACH Heritage Marketplace</h1>
        <p>Order History</p>
      </header>

      <div className="orders-container">

        <h2>My Orders</h2>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet.</p>

            <button
              className="shop-btn"
              onClick={() => navigate("/shop")}
            >
              Go to Shop
            </button>
          </div>
        ) : (
          <table className="orders-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Order Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>

                  <td>{order.id}</td>

                  <td>{order.product}</td>

                  <td>{order.quantity}</td>

                  <td>{order.price}</td>

                  <td>{order.date}</td>

                  <td>
                    <span
                      className={
                        order.status === "Delivered"
                          ? "status delivered"
                          : "status processing"
                      }
                    >
                      {order.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

        <div className="orders-buttons">

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