import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import Home from "./pages/Home.jsx"; 
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Shop from "./pages/Shop.jsx";



function App() {


  return (
    <ProductProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ProductProvider>
  )
}


export default App;
