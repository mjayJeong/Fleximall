import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import AdminProductNewPage from "./pages/AdminProductNewPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminGuard from './components/AdminGuard';
import LoginPage from './pages/LoginPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminProductEditPage from './pages/AdminProductEditPage';

export default function App() {
  const nav = useNavigate();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

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
            <Link className="text-red-500 hover:underline" to="/admin/products/new">
              상품 등록
            </Link>
            <Link className="text-red-500 hover:underline" to="/admin/products">
              관리자 상품목록
            </Link>
            <Link className="text-red-500 hover:underline" to="/admin/dashboard">
              관리자 대시보드
            </Link>
            <Link className="text-red-500 hover:underline" to="/admin/orders">
              관리자 주문관리
            </Link>

            {!token ? (
              <Link className="hover:underline" to="/login">로그인</Link>
            ) : (
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("role");
                  nav("/login");
                }}
              >
                로그아웃({role})
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/p/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/admin/products/new" element={<AdminGuard><AdminProductNewPage /></AdminGuard>} />
          <Route path="/admin/products" element={<AdminGuard><AdminProductsPage /></AdminGuard>} />
          <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
          <Route path="/admin/orders" element={<AdminGuard><AdminOrdersPage /></AdminGuard>} />
          <Route path="/admin/products/:id/edit" element={<AdminGuard><AdminProductEditPage /></AdminGuard>} />
        </Routes>
      </main>
    </div>
  );
}
