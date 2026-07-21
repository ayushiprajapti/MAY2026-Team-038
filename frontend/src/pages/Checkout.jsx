import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {

    const navigate = useNavigate();

    const location = useLocation();

    const [cartItems, setCartItems] = useState([]);

    const [orderPlaced, setOrderPlaced] = useState(false);

    const isBuyNow = location.state?.buyNow || false;

    /* ===============================
            LOAD CHECKOUT ITEMS
    =============================== */

    useEffect(() => {

        if (isBuyNow && location.state?.items) {

            setCartItems(location.state.items);

        }

        else {

            const cart = JSON.parse(

                localStorage.getItem("heritage_cart")

            ) || [];

            setCartItems(cart);

        }

    }, [location.state, isBuyNow]);



    /* ===============================
            UPDATE ITEMS
    =============================== */

    const updateCart = (updatedCart) => {

        setCartItems(updatedCart);

        if (!isBuyNow) {

            localStorage.setItem(

                "heritage_cart",

                JSON.stringify(updatedCart)

            );

        }

    };



    /* ===============================
            INCREASE QUANTITY
    =============================== */

    const increaseQuantity = (id) => {

        const updatedCart = cartItems.map(item =>

            item.id === id

                ? {

                    ...item,

                    quantity: item.quantity + 1

                }

                : item

        );

        updateCart(updatedCart);

    };



    /* ===============================
            DECREASE QUANTITY
    =============================== */

    const decreaseQuantity = (id) => {

        const updatedCart = cartItems.map(item => {

            if (item.id === id) {

                return {

                    ...item,

                    quantity:

                        item.quantity > 1

                            ? item.quantity - 1

                            : 1

                };

            }

            return item;

        });

        updateCart(updatedCart);

    };



    /* ===============================
            REMOVE ITEM
    =============================== */

    const removeItem = (id) => {

        const updatedCart = cartItems.filter(

            item => item.id !== id

        );

        updateCart(updatedCart);

    };



    /* ===============================
            CLEAR CART
    =============================== */

    const clearCart = () => {

        setCartItems([]);

        if (!isBuyNow) {

            localStorage.removeItem(

                "heritage_cart"

            );

        }

    };



    /* ===============================
            TOTALS
    =============================== */

    const totalItems = useMemo(() => {

        return cartItems.reduce(

            (sum, item) =>

                sum + item.quantity,

            0

        );

    }, [cartItems]);



    const totalAmount = useMemo(() => {

        return cartItems.reduce(

            (sum, item) =>

                sum +

                item.price *

                item.quantity,

            0

        );

    }, [cartItems]);



    /* ===============================
            PLACE ORDER
    =============================== */

    const placeOrder = () => {

        if (cartItems.length === 0) return;

        const previousOrders = JSON.parse(

            localStorage.getItem("heritage_orders")

        ) || [];

        const newOrder = {

            orderId: `HS${Date.now()}`,

            date: new Date().toLocaleDateString(

                "en-IN",

                {

                    day: "numeric",

                    month: "short",

                    year: "numeric"

                }

            ),

            status: "In Progress",

            items: [...cartItems],

            total: totalAmount

        };

        previousOrders.unshift(newOrder);

        localStorage.setItem(

            "heritage_orders",

            JSON.stringify(previousOrders)

        );

        if (!isBuyNow) {

            localStorage.removeItem(

                "heritage_cart"

            );

        }

        setCartItems([]);

        setOrderPlaced(true);

        setTimeout(() => {

            navigate("/orders");

        }, 1800);

    };
    return (

    <div className="checkout-page">

        {/* ===============================
                HEADER
        =============================== */}

        <div className="checkout-header">

            <h1>

                {isBuyNow ? "Buy Now" : "Checkout"}

            </h1>

            {!isBuyNow && cartItems.length > 0 && (

                <button

                    className="clear-cart-btn"

                    onClick={clearCart}

                >

                    Clear Cart

                </button>

            )}

        </div>



        {/* ===============================
                EMPTY
        =============================== */}

        {cartItems.length === 0 && !orderPlaced && (

            <div className="empty-cart">

                <h2>

                    No items available.

                </h2>

                <button

                    className="continue-btn"

                    onClick={() => navigate("/shop")}

                >

                    Continue Shopping

                </button>

            </div>

        )}



        {/* ===============================
                SUCCESS
        =============================== */}

        {orderPlaced && (

            <div className="order-success">

                <h2>

                    🎉 Order Placed Successfully!

                </h2>

                <p>

                    Thank you for supporting India's heritage artisans.

                </p>

            </div>

        )}



        {/* ===============================
                ITEMS
        =============================== */}

        {!orderPlaced && cartItems.length > 0 && (

            <>

                <div className="cart-container">

                    {cartItems.map((item) => (

                        <div

                            className="cart-card"

                            key={item.id}

                        >

                            <img

                                src={item.image}

                                alt={item.name}

                                className="cart-image"

                            />



                            <div className="cart-details">

                                <span className="cart-category">

                                    {item.category}

                                </span>

                                <h3>

                                    {item.name}

                                </h3>

                                <p className="cart-price">

                                    ₹{item.price}

                                </p>

                            </div>



                            <div className="cart-actions">

                                <div className="qty-box">

                                    <button

                                        onClick={() =>

                                            decreaseQuantity(item.id)

                                        }

                                    >

                                        −

                                    </button>



                                    <span>

                                        {item.quantity}

                                    </span>



                                    <button

                                        onClick={() =>

                                            increaseQuantity(item.id)

                                        }

                                    >

                                        +

                                    </button>

                                </div>



                                <button

                                    className="remove-btn"

                                    onClick={() =>

                                        removeItem(item.id)

                                    }

                                >

                                    Remove

                                </button>

                            </div>

                        </div>

                    ))}

                </div>



                {/* ===============================
                        SUMMARY
                =============================== */}

                <div className="summary-card">

                    <div className="summary-row">

                        <span>

                            Items ({totalItems})

                        </span>

                        <span>

                            ₹{totalAmount}

                        </span>

                    </div>



                    <div className="summary-row">

                        <span>

                            Delivery

                        </span>

                        <span>

                            FREE

                        </span>

                    </div>



                    <hr />



                    <div className="summary-total">

                        <strong>

                            Total

                        </strong>

                        <strong>

                            ₹{totalAmount}

                        </strong>

                    </div>

                </div>

                                {/* ===============================
                        BUTTONS
                =============================== */}

                <div className="checkout-buttons">

                    <button

                        className="continue-btn"

                        onClick={() => navigate("/shop")}

                    >

                        Continue Shopping

                    </button>

                    <button

                        className="place-order-btn"

                        onClick={placeOrder}

                    >

                        {isBuyNow ? "Buy Now" : "Place Order"}

                    </button>

                </div>

            </>

        )}

    </div>

);

}