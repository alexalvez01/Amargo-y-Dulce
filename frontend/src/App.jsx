import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { PromotionProvider } from './context/PromotionContext';
import Home from "./pages/Home.jsx"; 
import Login from "./pages/Login.jsx";
import ProductDetail from "./pages/ProductDetail.jsx"; // Tu página
import Register from "./pages/Register.jsx";
import Shop from "./pages/Shop.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword.jsx";
import ResetPasswordPage from "./pages/ResetPassword.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import DeleteProductPromotionPanel from "./pages/DeleteProductPromotionPanel.jsx";

function App() {
  return (
    // 1. Usamos los Providers que agregaron tus compañeros
    <ProductProvider>
      <PromotionProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/admin/delete-product-promotion" element={<DeleteProductPromotionPanel />} />
              
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </PromotionProvider>
    </ProductProvider>
  )
}

export default App;