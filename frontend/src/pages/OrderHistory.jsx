import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

export default function OrderHistory() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    /* ===============================
            LOAD ORDERS
    ============================== */

    useEffect(() => {

        const savedOrders = JSON.parse(

            localStorage.getItem("heritage_orders")

        ) || [];

        setOrders(savedOrders);

    }, []);

    /* ===============================
            BUY AGAIN
    ============================== */

    const buyAgain = (item) => {
      
      navigate("/checkout", {

            state: {

                buyNow: true,

                items: [

                    {

                        ...item,

                        quantity: item.quantity || 1

                    }

                ]

            }

        });

    };

    /* ===============================
            VIEW PRODUCT
    ============================== */

    const viewProduct = (id) => {

        navigate(`/product/${id}`);

    };

    /* ===============================
            TOTAL ORDERS
    ============================== */

    const totalOrders = useMemo(() => {

        return orders.length;

    }, [orders]);

    return (

        <div className="orders-page">

            {/* ===============================
                    HEADER
            ============================== */}

            <div className="orders-header">

                <h1>

                    Order History ({totalOrders})

                </h1>

                <button

                    className="shop-btn"

                    onClick={() => navigate("/shop")}

                >

                    Continue Shopping

                </button>

            </div>

            {/* ===============================
                    EMPTY ORDERS
            ============================== */}

            {orders.length === 0 && (

                <div className="empty-orders">

                    <h2>No Orders Yet</h2>

                    <p>

                        Explore our heritage collection and place your first order.

                    </p>

                    <button

                        className="continue-btn"

                        onClick={() => navigate("/shop")}

                    >

                        Shop Now

                    </button>

                </div>

            )}

            {/* ===============================
                    ORDER LIST
            ============================== */}

            {orders.length > 0 && (

                <div className="orders-container">
                                      {orders.map((order) => (

                        <div

                            className="order-card"

                            key={order.orderId}

                        >

                            {/* ===============================
                                    ORDER HEADER
                            ============================== */}

                            <div className="order-top">

                                <div>

                                    <h3>

                                        Order #{order.orderId}

                                    </h3>

                                    <p className="order-date">

                                        {order.date}

                                    </p>

                                </div>

                                <span

                                    className={`status ${order.status
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}

                                >

                                    {order.status}

                                </span>

                            </div>

                            {/* ===============================
                                    PRODUCTS
                            ============================== */}

                            {order.items.map((item) => (

                                <div

                                    className="order-item"

                                    key={item.id}

                                >

                                    <img

                                        src={item.image}

                                        alt={item.name}

                                        className="order-image"

                                    />

                                    <div className="order-details">

                                        <span className="order-category">

                                            {item.category}

                                        </span>

                                        <h4>

                                            {item.name}

                                        </h4>

                                        <p>

                                            Quantity : {item.quantity}

                                        </p>

                                        <p className="order-price">

                                            ₹{item.price * item.quantity}

                                        </p>

                                    </div>

                                    <div className="order-buttons">

                                        <button

                                            className="view-btn"

                                            onClick={() =>

                                                viewProduct(item.id)

                                            }

                                        >

                                            View Details

                                        </button>

                                        <button

                                            className="buy-btn"

                                            onClick={() =>

                                                buyAgain(item)

                                            }

                                        >

                                            Buy Again

                                        </button>

                                    </div>

                                </div>

                            ))}

                            {/* ===============================
                                    ORDER TOTAL
                            ============================== */}

                            <div className="order-footer">

                                <strong>

                                    Total Amount

                                </strong>

                                <strong>

                                    ₹{order.total}

                                </strong>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}