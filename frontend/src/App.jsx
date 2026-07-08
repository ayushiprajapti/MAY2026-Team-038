import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import HeritageShop from "./pages/HeritageShop";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<HeritageShop />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </HashRouter>
  );
}