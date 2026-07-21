import React, { useState, useRef } from "react";

export default function ProductForm({ onAddProduct, onClose }) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Books");
  const [priceInRupees, setPriceInRupees] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [images, setImages] = useState([]); // array of { name, dataUrl }
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const dragIndex = useRef(null); // index of the card being dragged
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (idx) => {
    dragIndex.current = idx;
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault(); // allow drop
    setDragOverIndex(idx);
  };

  const handleDrop = (idx) => {
    const from = dragIndex.current;
    if (from === null || from === idx) {
      setDragOverIndex(null);
      return;
    }
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, { name: file.name, dataUrl: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input so the same file can be re-selected if removed
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
      // First image used as primary; fall back to placeholder if none uploaded
      image_url: images.length > 0
        ? images[0].dataUrl
        : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      images: images.map((img) => img.dataUrl),
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
    setImages([]);
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

        <form onSubmit={handleSubmit} className="space-y-3 font-sans text-xs">

          {/* Row 1: SKU + Name */}
          <div className="grid grid-cols-2 gap-3">
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
                placeholder="INTACH-BOOK-001"
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
                placeholder="Pune Queen of Deccan Book"
              />
            </div>
          </div>

          {/* Row 2: Price + Category + Stock */}
          <div className="grid grid-cols-3 gap-3">
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

            {/* Stock Quantity */}
            <div className="relative group text-left">
              <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="stock">
                Stock Qty <span className="text-heritage-red">*</span>
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

          {/* Row 3: Description + Images side-by-side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Description */}
            <div className="relative group text-left">
              <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1" htmlFor="description">
                Description
              </label>
              <textarea
                className="w-full bg-heritage-cream/20 border border-heritage-border/50 text-heritage-espresso py-2 px-3 rounded focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all placeholder:text-heritage-charcoal/30 text-xs h-24 resize-none block"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description..."
              />
            </div>

            {/* Image Upload — second column */}
            <div className="relative group text-left">
              <label className="block text-[10px] font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1">
                Product Images
              </label>

              {/* Drop zone / click target */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-heritage-border/60 rounded px-3 bg-heritage-cream/10 hover:border-heritage-bronze hover:bg-heritage-cream/30 transition-all cursor-pointer text-heritage-charcoal/50 hover:text-heritage-charcoal/80"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-[10px] font-medium">Click to upload JPG / PNG</span>
                <span className="text-[9px] opacity-60">Multiple files allowed</span>
              </button>

              <input
                ref={fileInputRef}
                id="product_images"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Image preview grid — drag to reorder; first slot = Primary */}
              {images.length > 0 && (
                <>
                  <p className="mt-2 mb-1 text-[9px] text-heritage-charcoal/45 font-sans">
                    Drag to reorder &mdash; first = primary.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {images.map((img, idx) => (
                      <div
                        key={img.name + idx}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={handleDragEnd}
                        className={[
                          "relative group/thumb cursor-grab active:cursor-grabbing rounded transition-all duration-150",
                          dragOverIndex === idx && dragIndex.current !== idx
                            ? "ring-2 ring-heritage-bronze scale-105"
                            : "",
                          dragIndex.current === idx ? "opacity-40" : "opacity-100",
                        ].join(" ")}
                      >
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          draggable={false}
                          className="w-full h-12 object-cover rounded border border-heritage-border/40 pointer-events-none"
                        />
                        {/* Primary badge */}
                        {idx === 0 && (
                          <span className="absolute bottom-0.5 left-0.5 bg-heritage-bronze/90 text-white text-[8px] font-semibold px-1 rounded leading-4">
                            Primary
                          </span>
                        )}
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-heritage-red/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                          title="Remove"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>{/* end Row 3 grid */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-heritage-red text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-heritage-red/90 transition-all duration-300 shadow shadow-heritage-red/20 active:scale-[0.98] cursor-pointer"
          >
            Create Product
          </button>
        </form>

      </div>
    </div>
  );
}
