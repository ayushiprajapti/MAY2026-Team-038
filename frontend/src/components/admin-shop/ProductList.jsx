import React, { useState, useEffect } from "react";

export default function ProductList({ products, onToggleActive, onDeleteProduct, onEditProduct, onOpenForm }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  const itemsPerPage = 5;

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice((product.price_cents / 100).toString());
    setEditStock(product.stock_quantity.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    const price = parseFloat(editPrice);
    const stock = parseInt(editStock, 10);

    if (!editName.trim() || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
      alert("Invalid input values. Please double-check.");
      return;
    }

    onEditProduct(id, {
      name: editName.trim(),
      price_cents: Math.round(price * 100),
      stock_quantity: stock,
    });

    setEditingId(null);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Adjust page number if it exceeds bounds after deletion
  useEffect(() => {
    const maxPage = Math.ceil(filteredProducts.length / itemsPerPage);
    if (maxPage > 0 && currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredProducts.length, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const formatCentsToINR = (cents) => {
    return (cents / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="bg-heritage-cream-light p-6 md:p-8 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] text-left flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h4 className="font-serif text-2xl font-semibold text-heritage-espresso">
              Manage Products
            </h4>
            <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
              Modify inventory levels, active statuses, and details of shop items (DBML products)
            </p>
          </div>
          {/* Search bar & Add Product Button */}
          <div className="flex items-center gap-3 shrink-0 select-none font-sans text-xs">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-heritage-cream border border-heritage-border/60 text-heritage-espresso text-xs rounded font-sans px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-heritage-bronze w-48 sm:w-52"
            />
            {onOpenForm && (
              <button
                onClick={onOpenForm}
                className="flex items-center gap-1.5 bg-heritage-red hover:bg-heritage-red/90 text-white font-semibold text-xs py-1.5 px-3 rounded shadow shadow-heritage-red/10 cursor-pointer transition-colors active:scale-95 duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-heritage-border/40 text-heritage-charcoal/60 uppercase font-semibold tracking-wider text-[10px]">
                <th className="py-2.5 px-3 w-14">Image</th>
                <th className="py-2.5 px-3 w-28">SKU</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3 w-28">Category</th>
                <th className="py-2.5 px-3 w-24">Price</th>
                <th className="py-2.5 px-3 w-20">Stock</th>
                <th className="py-2.5 px-3 w-24">Status</th>
                <th className="py-2.5 px-3 w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-heritage-border/20 text-heritage-espresso font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-heritage-charcoal/50 font-sans">
                    No products matching search query.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isEditing = editingId === p.id;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-heritage-cream/10 transition-colors ${
                        p.is_active ? "opacity-100" : "opacity-55"
                      }`}
                    >
                      <td className="py-2.5 px-3 w-14">
                        <div className="w-8 h-8 rounded border border-heritage-border/30 overflow-hidden bg-heritage-cream flex items-center justify-center">
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 w-28 font-mono font-bold text-[10px] text-heritage-red uppercase">
                        {p.sku}
                      </td>
                      <td className="py-2.5 px-3 text-sm font-semibold max-w-[140px] truncate" title={p.name}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-heritage-cream border border-heritage-border text-heritage-espresso text-xs rounded px-2 py-1 focus:outline-none w-full"
                          />
                        ) : (
                          p.name
                        )}
                      </td>
                      <td className="py-2.5 px-3 w-28 text-heritage-charcoal/80 max-w-[100px] truncate" title={p.category}>
                        {p.category}
                      </td>
                      <td className="py-2.5 px-3 w-24 text-sm font-semibold">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="bg-heritage-cream border border-heritage-border text-heritage-espresso text-xs rounded px-2 py-1 focus:outline-none w-16"
                          />
                        ) : (
                          formatCentsToINR(p.price_cents)
                        )}
                      </td>
                      <td className="py-2.5 px-3 w-20">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="bg-heritage-cream border border-heritage-border text-heritage-espresso text-xs rounded px-2 py-1 focus:outline-none w-12"
                          />
                        ) : (
                          <span className={p.stock_quantity === 0 ? "text-heritage-red font-bold" : ""}>
                            {p.stock_quantity}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 w-24">
                        <span
                          className={`inline-block w-[64px] text-center px-1 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider font-mono ${
                            p.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-heritage-cream-dark/50 text-heritage-charcoal/70 border-heritage-border/40"
                          }`}
                        >
                          {p.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 w-32">
                        <div className="flex items-center justify-center gap-2.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(p.id)}
                                className="px-3 py-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md font-semibold cursor-pointer shadow-sm text-xs transition-colors duration-150"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md font-semibold cursor-pointer text-xs transition-colors duration-150"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(p)}
                                className="p-2 border border-heritage-border/60 text-heritage-charcoal hover:text-heritage-red hover:bg-heritage-cream rounded-md transition-all cursor-pointer shadow-sm active:scale-90"
                                title="Edit Product"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => onToggleActive(p.id)}
                                className="p-2 border border-heritage-border/60 text-heritage-charcoal hover:text-heritage-red hover:bg-heritage-cream rounded-md transition-all cursor-pointer shadow-sm active:scale-90"
                                title={p.is_active ? "Deactivate Product" : "Activate Product"}
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  {p.is_active ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  )}
                                </svg>
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-2 border border-heritage-border/60 text-heritage-charcoal hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-md transition-all cursor-pointer shadow-sm active:scale-90"
                                title="Delete Product"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 border-t border-heritage-border/30 pt-4 font-sans text-xs select-none">
          <div className="text-heritage-charcoal/60 font-medium">
            Showing {filteredProducts.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 cursor-pointer"
                title="Previous Page"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                    currentPage === page
                      ? "bg-heritage-red text-white border-heritage-red shadow-sm"
                      : "border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream hover:text-heritage-red"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-heritage-border/60 text-heritage-charcoal hover:bg-heritage-cream rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 cursor-pointer"
                title="Next Page"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
