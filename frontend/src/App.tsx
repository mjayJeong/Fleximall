import { Routes, Route, Link } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import AdminProductNewPage from "./pages/AdminProductNewPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

export default function App() {
  return (
    <div>
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">
            MiniMall
          </Link>
          <nav className="flex gap-3 text-sm">
            <Link className="hover:underline" to="/">
              상품
            </Link>
            <Link className="hover:underline" to="/cart">
              장바구니
            </Link>
            <Link className="hover:underline" to="/orders">
              주문내역
            </Link>
            <Link className="hover:underline" to="/admin/products/new">
              관리자: 상품 등록
            </Link>
            <Link className="hover:underline" to="/admin/dashboard">
              관리자 대시보드
            </Link>
            <Link className="hover:underline" to="/admin/orders">
              관리자 주문관리
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/admin/products/new" element={<AdminProductNewPage />} />
          <Route path="/p/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />    
        </Routes>
      </main>
    </div>
  );
}
