import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "../components/shared/AdminSidebar";
import OrderTable from "../components/admin-shop/OrderTable";
import ProductForm from "../components/admin-shop/ProductForm";
import ProductList from "../components/admin-shop/ProductList";
import OutOfStockTable from "../components/admin-shop/OutOfStockTable";
import { listProducts, createProduct, updateProduct, deleteProduct } from "../api/shop";
import { ApiError } from "../api/client";

export default function AdminShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    return listProducts()
      .then(setProducts)
      .catch((err) => {
        setError(err instanceof ApiError ? err.detail : "Something went wrong, please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (newProduct) => {
    setError("");
    try {
      await createProduct(newProduct);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong, please try again.");
    }
  };

  const handleToggleActive = async (id) => {
    setError("");
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      await updateProduct(id, { is_active: !product.is_active });
      await fetchProducts();
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong, please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product from the database? This cannot be undone.")) return;
    setError("");
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong, please try again.");
    }
  };

  const handleEditProduct = async (id, updatedFields) => {
    setError("");
    try {
      await updateProduct(id, updatedFields);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Something went wrong, please try again.");
    }
  };

  const activeCount = products.filter((p) => p.is_active).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0 && p.is_active).length;
  const totalStock = products.reduce((sum, p) => sum + (p.is_active ? p.stock_quantity : 0), 0);

  return (
    <>
      <main className="p-8 md:p-12 overflow-y-auto w-full h-full text-heritage-espresso bg-[#f8ecd7]/90">
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

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-sans">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-6 text-sm font-sans text-heritage-charcoal/60">Loading products…</div>
        )}

        <section className="grid grid-cols-3 gap-6 mb-8 text-left">
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

        <section className="mb-8">
          <ProductList
            products={products}
            onToggleActive={handleToggleActive}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={handleEditProduct}
            onOpenForm={() => setIsFormOpen(true)}
          />
        </section>

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

        <section className="mb-8">
          <OrderTable />
        </section>
      </main>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="max-w-2xl w-full relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto rounded-xl"
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
