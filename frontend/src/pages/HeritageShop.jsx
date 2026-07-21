import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shopItems from "../data/shopItems";
import "./HeritageShop.css";

export default function HeritageShop() {

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

    const [activeCategory, setActiveCategory] = useState("All");

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [selectedImage, setSelectedImage] = useState(0);

    const [quantity, setQuantity] = useState(1);

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {

        const cart =
            JSON.parse(localStorage.getItem("heritage_cart")) || [];

        setCartItems(cart);

    }, []);

    useEffect(() => {

        const loadCart = () => {

            const cart =
                JSON.parse(localStorage.getItem("heritage_cart")) || [];

            setCartItems(cart);

        };

        window.addEventListener("focus", loadCart);

        return () => {

            window.removeEventListener("focus", loadCart);

        };

    }, []);

    /* =====================================
            CATEGORY LIST
    ===================================== */

    const categories = useMemo(() => {

        return [

            "All",

            ...new Set(
                shopItems.map(item => item.category)
            )

        ];

    }, []);

    /* =====================================
            FILTER PRODUCTS
    ===================================== */

    const filteredProducts = useMemo(() => {

        return shopItems.filter((item) => {

            const matchesCategory =

                activeCategory === "All" ||

                item.category === activeCategory;

            const matchesSearch =

                item.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||

                item.shortDescription
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;

        });

    }, [activeCategory, searchQuery]);

    /* =====================================
            PRODUCT
    ===================================== */

    const openProduct = (product) => {

        setSelectedProduct(product);

        setSelectedImage(0);

        setQuantity(1);

    };

    const addToCart = (product) => {

        const existing = cartItems.find(
            item => item.id === product.id
        );

        let updatedCart;

        if (existing) {

            updatedCart = cartItems.map(item =>
                item.id === product.id
                    ? {
                          ...item,
                          quantity: item.quantity + quantity,
                      }
                    : item
            );

        } else {

            updatedCart = [
                ...cartItems,
                {
                    ...product,
                    quantity,
                },
            ];

        }

        setCartItems(updatedCart);

        localStorage.setItem(
            "heritage_cart",
            JSON.stringify(updatedCart)
        );

        setSelectedProduct(null);

    };

    const totalAmount = cartItems.reduce(

        (sum, item) =>

            sum + item.price * item.quantity,

        0

    );

    return (
                <div className="heritage-shop">

            {/* =====================================
                    PAGE TITLE
            ===================================== */}

            <section className="shop-header">

                <div className="header-top">

                    <div className="header-left">

                        <h1>Heritage Shop</h1>

                        <p>Authentic • Handcrafted • Timeless</p>

                    </div>

                    <div className="top-actions">

                        <button
                            className="cart-btn"
                            onClick={() =>
                                navigate("/checkout", {
                                    state: {
                                        cartItems,
                                        totalAmount,
                                    },
                                })
                            }
                        >

                            🛒 Cart

                            {cartItems.length > 0 && (

                                <span className="cart-count">

                                    {cartItems.reduce(
                                        (sum, item) =>
                                            sum + item.quantity,
                                        0
                                    )}

                                </span>

                            )}

                        </button>

                        <button
                            className="orders-btn"
                            onClick={() => navigate("/orders")}
                        >

                            📦 My Orders

                        </button>

                    </div>

                </div>

            </section>

            {/* =====================================
                    SEARCH + FILTER BAR
            ===================================== */}

            <section className="filter-bar">

                <div className="search-box">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search heritage products..."
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(e.target.value)
                        }
                    />

                </div>

                <div className="category-list">

                    {categories.map((category) => (

                        <button
                            key={category}
                            className={
                                activeCategory === category
                                    ? "category active"
                                    : "category"
                            }
                            onClick={() =>
                                setActiveCategory(category)
                            }
                        >

                            {category}

                        </button>

                    ))}

                </div>

            </section>

            {/* =====================================
                    PRODUCTS
            ===================================== */}

            <section className="products-section">

                <div className="products-grid">

                    {filteredProducts.length === 0 ? (

                        <div className="empty-products">

                            <h2>No Products Found</h2>

                            <p>
                                Try another search or category.
                            </p>

                        </div>

                    ) : (

                        filteredProducts.map((product) => (

                            <div
                                className="product-card"
                                key={product.id}
                            >

                                <div className="product-image">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />

                                </div>

                                <div className="product-content">

                                    <div className="product-top">

                                        <span className="product-category">

                                            {product.category}

                                        </span>

                                        <span className="product-price">

                                            ₹{product.price}

                                        </span>

                                    </div>

                                    <h3>{product.name}</h3>

                                    <button
                                        className="view-btn"
                                        onClick={() =>
                                            navigate(
                                                `/product/${product.id}`
                                            )
                                        }
                                    >

                                        View Details

                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </section>

        </div>

    );

}