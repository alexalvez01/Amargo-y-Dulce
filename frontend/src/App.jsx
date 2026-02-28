import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { PromotionProvider } from './context/PromotionContext';
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home.jsx"; 
import Login from "./pages/Login.jsx";
import ProductDetail from "./pages/ProductDetail.jsx"; // Tu página
import Register from "./pages/Register.jsx";
import Shop from "./pages/Shop.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword.jsx";
import ResetPasswordPage from "./pages/ResetPassword.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import DeleteProductPromotionPanel from "./pages/DeleteProductPromotionPanel.jsx";
import EnableProductPromotionPanel from "./pages/EnableProductPromotionPanel.jsx";
import UpdateProductPanel from "./pages/UpdateProductPanel.jsx";
import FavoritesPage from "./pages/Favorites.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import CartPage from "./pages/CartPage.jsx";
import Promotions from "./pages/Promotions.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import PaymentStatusPage from "./pages/PaymentStatusPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";

function App() {
  return (
    <ProductProvider>
      <PromotionProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
              {/* --- RUTAS PÚBLICAS (Entra cualquiera) --- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/promotions" element={<Promotions />} />
              {/* --- RUTAS PROTEGIDAS (Entra solo si estás logueado) --- */}
              <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/order-detail" element={<OrderDetail />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/pending" element={<PaymentStatusPage />} />
              <Route path="/payment/failure" element={<PaymentStatusPage />} />
              </Route>
              {/* --- RUTAS ADMIN (Entra solo si sos admin) --- */}
              <Route element={<AdminRoute />}>
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/admin/enable-product-promotion" element={<EnableProductPromotionPanel />} />
                <Route path="/admin/delete-product-promotion" element={<DeleteProductPromotionPanel />} />
                <Route path="/admin/update-product" element={<UpdateProductPanel />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </PromotionProvider>
    </ProductProvider>
  )
}

export default App;
