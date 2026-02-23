import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx"; 
import Login from "./pages/Login.jsx";
import ProductDetail from "./pages/ProductDetail.jsx"; // <--- 1. Importamos la nueva página

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Agregamos la ruta dinámica. 
            :id significa que puede ser /product/1, /product/50, etc. */}
        <Route path="/product/:id" element={<ProductDetail />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;
