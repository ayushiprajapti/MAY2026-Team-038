import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import shopItems from "../data/shopItems";
import "./ProductDetails.css";

export default function ProductDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const product = useMemo(() => {

        return shopItems.find(
            item => item.id === Number(id)
        );

    }, [id]);

    const [selectedImage, setSelectedImage] = useState(0);

    const [quantity, setQuantity] = useState(1);

    if (!product) {

        return (

            <div className="product-not-found">

                <h2>Product Not Found</h2>

                <button
                    onClick={() => navigate("/shop")}
                >
                    Back to Heritage Shop
                </button>

            </div>

        );

    }

    return (

        <div className="product-page">

            {/* ===============================
                    BACK BUTTON
            =============================== */}

            <button

                className="back-btn"

                onClick={() => navigate(-1)}

            >

                ← Continue Shopping

            </button>

            {/* ===============================
                MAIN PRODUCT CONTAINER
            =============================== */}

            <div className="product-container">

                {/* ===============================
                        LEFT SIDE
                =============================== */}

                <div className="product-gallery">

                    <div className="main-product-image">

                        <img

                            src={product.gallery[selectedImage]}

                            alt={product.name}

                        />

                    </div>

                    <p className="image-caption">

                        Images shown are representative of handcrafted
                        heritage products.

                    </p>

                    <div className="thumbnail-list">

                        {product.gallery.map((image, index) => (

                            <img

                                key={index}

                                src={image}

                                alt={product.name}

                                className={

                                    selectedImage === index

                                        ? "thumbnail active"

                                        : "thumbnail"

                                }

                                onClick={() =>
                                    setSelectedImage(index)
                                }

                            />

                        ))}

                    </div>

                </div>

                {/* ===============================
                        RIGHT SIDE
                =============================== */}

                <div className="product-info">

                    <span className="product-badge">

                        {product.category}

                    </span>

                    <h1>

                        {product.name}

                    </h1>

                    <div className="product-price">

                        ₹{product.price}

                    </div>

                    {/* PRODUCT HIGHLIGHTS */}

                    <div className="product-highlights">

                        <span>✔ Handcrafted</span>

                        <span>✔ Authentic Heritage</span>

                        <span>✔ Supports Local Artisans</span>

                    </div>

                    <p className="product-description">

                        {product.description}

                    </p>

                    {/* HERITAGE STORY */}

                    <div className="story-box">

                        <h3>

                            🏛 Heritage Story

                        </h3>

                        <p>

                            {product.story}

                        </p>

                    </div>

                    {/* AUTHENTICITY */}

                    <div className="authenticity-box">

                        <h4>

                            Authenticity

                        </h4>

                        <p>

                            Every purchase supports heritage conservation
                            and skilled local artisans associated with
                            INTACH's heritage initiatives.

                        </p>

                    </div>

                    {/* PRODUCT DETAILS */}

                    <div className="details-table">

                        <div className="detail-item">

                            <strong>

                                Material

                            </strong>

                            <span>

                                {product.material}

                            </span>

                        </div>

                        <div className="detail-item">

                            <strong>

                                Origin

                            </strong>

                            <span>

                                {product.origin}

                            </span>

                        </div>

                        <div className="detail-item">

                            <strong>

                                Dimensions

                            </strong>

                            <span>

                                {product.dimensions}

                            </span>

                        </div>

                        <div className="detail-item">

                            <strong>

                                Care

                            </strong>

                            <span>

                                {product.care}

                            </span>

                        </div>

                    </div>
                    {/* ===============================
        PURCHASE SECTION
================================ */}

<div className="bottom-section">

    <div className="quantity-section">

        <span className="quantity-label">

            Quantity

        </span>

        <div className="quantity-box">

            <button
                onClick={() => {

                    if (quantity > 1) {

                        setQuantity(quantity - 1);

                    }

                }}
            >

                −

            </button>

            <span>

                {quantity}

            </span>

            <button
                onClick={() =>
                    setQuantity(quantity + 1)
                }
            >

                +

            </button>

        </div>

    </div>

    <div className="action-buttons">

        <button

            className="add-cart-btn"

            onClick={() => {

                const cart = JSON.parse(
                    localStorage.getItem("heritage_cart")
                ) || [];

                const existing = cart.find(
                    item => item.id === product.id
                );

                if (existing) {

                    existing.quantity += quantity;

                }

                else {

                    cart.push({

                        ...product,

                        quantity

                    });

                }

                localStorage.setItem(
                    "heritage_cart",
                    JSON.stringify(cart)
                );

                navigate("/shop");

            }}

        >

            Add to Cart

        </button>

        <button

            className="buy-now-btn"

            onClick={() =>

                navigate("/checkout", {

                    state: {

                        buyNow: true,

                        items: [

                            {

                                ...product,

                                quantity

                            }

                        ]

                    }

                })

            }

        >

            Buy Now

        </button>

    </div>

</div>

                </div>

            </div>

        </div>

    );

}