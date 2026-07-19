import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "../components/shared/AdminSidebar";
import OrderTable from "../components/admin-shop/OrderTable";
import ProductForm from "../components/admin-shop/ProductForm";
import ProductList from "../components/admin-shop/ProductList";
import OutOfStockTable from "../components/admin-shop/OutOfStockTable";

const initialProducts = [
  {
    id: "pune-heritage-directory",
    sku: "INTACH-PUB-DIR",
    name: "Pune Heritage Directory & Guide",
    category: "Publications",
    price_cents: 45000,
    stock_quantity: 45,
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    is_active: true,
  },
  {
    id: "maratha-forts-atlas",
    sku: "INTACH-MAP-SAHYADRI",
    name: "Sahyadri Forts Hand-Drawn Map",
    category: "Maps & Prints",
    price_cents: 75000,
    stock_quantity: 20,
    image_url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600",
    is_active: true,
  },
  {
    id: "tambat-brass-bookmark",
    sku: "INTACH-CRAFT-BRASS",
    name: "Hand-Hammered Brass Bookmark",
    category: "Artisanal Crafts",
    price_cents: 32000,
    stock_quantity: 120,
    image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600",
    is_active: true,
  },
  {
    id: "intach-journal-history",
    sku: "INTACH-PUB-JOURNAL",
    name: "Journal of Indian Heritage (Vol 4)",
    category: "Publications",
    price_cents: 60000,
    stock_quantity: 0,
    image_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
    is_active: true,
  },
];

export default function AdminShop() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("intach_products");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (e) {
        setProducts(initialProducts);
        localStorage.setItem("intach_products", JSON.stringify(initialProducts));
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem("intach_products", JSON.stringify(initialProducts));
    }
  }, []);

  const handleAddProduct = (newProduct) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem("intach_products", JSON.stringify(updated));
  };

  const handleToggleActive = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, is_active: !p.is_active } : p
    );
    setProducts(updated);
    localStorage.setItem("intach_products", JSON.stringify(updated));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product from the database?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem("intach_products", JSON.stringify(updated));
    }
  };

  const handleEditProduct = (id, updatedFields) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updatedFields } : p
    );
    setProducts(updated);
    localStorage.setItem("intach_products", JSON.stringify(updated));
  };

  // Aggregated metadata summary stats
  const activeCount = products.filter((p) => p.is_active).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0 && p.is_active).length;
  const totalStock = products.reduce((sum, p) => sum + (p.is_active ? p.stock_quantity : 0), 0);

  return (
    <>
      <main className="p-8 md:p-12 overflow-y-auto w-full h-full text-heritage-espresso bg-[#f8ecd7]/90">
        {/* Inline Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-10 text-left">
          <div>
            <h2 className="font-serif text-3xl font-bold text-heritage-espresso">
              Shop Administration
            </h2>
            <p className="text-sm text-heritage-charcoal/70 mt-1 font-sans">
              Manage artisanal crafts catalog, stock counts, and customer purchases.
            </p>
          </div>
        </header>

        {/* Shop Overview Stat Row */}
        <section className="grid grid-cols-3 gap-6 mb-8 text-left">
          {/* Active Products */}
          <div className="bg-heritage-cream-light p-5 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)]">
            <p className="text-heritage-charcoal/60 font-sans text-xs font-semibold uppercase tracking-wider">
              Active Catalog Items
            </p>
            <h3 className="font-serif text-2xl font-bold text-heritage-espresso mt-1">
              {activeCount}
            </h3>
            <p className="text-[10px] text-heritage-charcoal/50 font-sans mt-1.5">
              Available in the official marketplace
            </p>
          </div>

          {/* Out of stock counts */}
          <div className="bg-heritage-cream-light p-5 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)]">
            <p className="text-heritage-charcoal/60 font-sans text-xs font-semibold uppercase tracking-wider">
              Out of Stock Alerts
            </p>
            <h3 className="font-serif text-2xl font-bold text-heritage-red mt-1">
              {outOfStockCount}
            </h3>
            <p className="text-[10px] text-heritage-charcoal/50 font-sans mt-1.5">
              Requires immediate inventory logs change
            </p>
          </div>

          {/* Total Stock items count */}
          <div className="bg-heritage-cream-light p-5 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)]">
            <p className="text-heritage-charcoal/60 font-sans text-xs font-semibold uppercase tracking-wider">
              Total Units Available
            </p>
            <h3 className="font-serif text-2xl font-bold text-heritage-espresso mt-1">
              {totalStock}
            </h3>
            <p className="text-[10px] text-heritage-charcoal/50 font-sans mt-1.5">
              Cumulative pieces across all categories
            </p>
          </div>
        </section>

        {/* Product Catalog Management */}
        <section className="mb-8">
          <ProductList
            products={products}
            onToggleActive={handleToggleActive}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={handleEditProduct}
            onOpenForm={() => setIsFormOpen(true)}
          />
        </section>

        {/* Stock Alerts Table */}
        <section className="mb-8">
          <OutOfStockTable
            products={products}
            onRestock={(id, qty) => {
              handleEditProduct(id, {
                stock_quantity: qty,
              });
            }}
          />
        </section>

        {/* Orders Table */}
        <section className="mb-8">
          <OrderTable />
        </section>
      </main>

      {/* Add Product Modal Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop Click Close */}
            <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="max-w-md w-full relative z-10 shadow-2xl"
            >
              <ProductForm
                onAddProduct={(p) => {
                  handleAddProduct(p);
                  setIsFormOpen(false);
                }}
                onClose={() => setIsFormOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
