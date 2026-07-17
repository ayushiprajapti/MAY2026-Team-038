import React, { useState } from "react";

export default function ProductForm({ onAddProduct, onClose }) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Books");
  const [priceInRupees, setPriceInRupees] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Input validation
    if (!sku.trim() || !name.trim() || !priceInRupees || !stockQuantity) {
      setError("Please fill in all required fields.");
      return;
    }

    const price = parseFloat(priceInRupees);
    const stock = parseInt(stockQuantity, 10);

    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    // Convert price in Rupees to price_cents for DBML schema
    const priceCents = Math.round(price * 100);

    // Call parent handler to update lists
    onAddProduct({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      category,
      price_cents: priceCents,
      stock_quantity: stock,
      image_url: imageUrl.trim() || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      is_active: true,
      created_at: new Date().toISOString(),
    });

    // Reset Form
    setSku("");
    setName("");
    setDescription("");
    setCategory("Books");
    setPriceInRupees("");
    setStockQuantity("");
    setImageUrl("");
  };

  return (
    <div className="bg-heritage-cream-light p-6 md:p-8 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] text-left relative w-full">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-heritage-charcoal/60 hover:text-heritage-red cursor-pointer transition-colors"
          title="Close Form"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <div>
        <div className="mb-6 pr-6">
          <h4 className="font-serif text-2xl font-semibold text-heritage-espresso">
            Add Product
          </h4>
          <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
            Register a new catalog item directly into the shop schema database
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-sans text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {/* SKU Field */}
          <div className="relative group text-left">
            <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="sku">
              Product SKU <span className="text-heritage-red">*</span>
            </label>
            <input
              className="w-full bg-heritage-cream/20 border border-heritage-border/50 text-heritage-espresso py-2 px-3 rounded focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all placeholder:text-heritage-charcoal/30 text-xs"
              id="sku"
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. INTACH-BOOK-001"
            />
          </div>

          {/* Name Field */}
          <div className="relative group text-left">
            <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="name">
              Product Name <span className="text-heritage-red">*</span>
            </label>
            <input
              className="w-full bg-heritage-cream/20 border border-heritage-border/50 text-heritage-espresso py-2 px-3 rounded focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all placeholder:text-heritage-charcoal/30 text-xs"
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pune Queen of Deccan Book"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price (Rupees) */}
            <div className="relative group text-left">
              <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="price">
                Price (₹) <span className="text-heritage-red">*</span>
              </label>
              <input
                className="w-full bg-heritage-cream/20 border border-heritage-border/50 text-heritage-espresso py-2 px-3 rounded focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all placeholder:text-heritage-charcoal/30 text-xs"
                id="price"
                type="number"
                step="0.01"
                required
                value={priceInRupees}
                onChange={(e) => setPriceInRupees(e.target.value)}
                placeholder="450"
              />
            </div>

            {/* Stock Quantity */}
            <div className="relative group text-left">
              <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="stock">
                Stock Quantity <span className="text-heritage-red">*</span>
              </label>
              <input
                className="w-full bg-heritage-cream/20 border border-heritage-border/50 text-heritage-espresso py-2 px-3 rounded focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all placeholder:text-heritage-charcoal/30 text-xs"
                id="stock"
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          {/* Category Select */}
          <div className="relative group text-left">
            <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="category">
              Category
            </label>
            <select
              className="w-full bg-heritage-cream/20 border border-heritage-border/50 text-heritage-espresso py-2 px-3 rounded focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all text-xs cursor-pointer"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Books">Heritage Books</option>
              <option value="Crafts">Artisanal Crafts</option>
              <option value="Souvenirs">Souvenirs & Gifts</option>
              <option value="Maps">Heritage Maps</option>
            </select>
          </div>

          {/* Description Field */}
          <div className="relative group text-left">
            <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="description">
              Description
            </label>
            <textarea
              className="w-full bg-heritage-cream/20 border border-heritage-border/50 text-heritage-espresso py-2 px-3 rounded focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all placeholder:text-heritage-charcoal/30 text-xs h-16 resize-none"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description..."
            />
          </div>

          {/* Image URL Field */}
          <div className="relative group text-left">
            <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="image_url">
              Image URL
            </label>
            <input
              className="w-full bg-heritage-cream/20 border border-heritage-border/50 text-heritage-espresso py-2 px-3 rounded focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all placeholder:text-heritage-charcoal/30 text-xs"
              id="image_url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-heritage-red text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-heritage-red/90 transition-all duration-300 shadow shadow-heritage-red/20 active:scale-[0.98] cursor-pointer"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
