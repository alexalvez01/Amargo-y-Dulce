import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import Footer from "../components/Footer";
import { usePromotions } from "../context/PromotionContext";
import { ChevronLeft } from 'lucide-react';
import { 
  getActiveCartRequest, 
  updateCartQuantityRequest, 
  removeProductFromCartRequest,
  confirmCartRequest
} from "../api/cart";

export default function CartPage() {
  const [cartData, setCartData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();
  const { promotions } = usePromotions();

  const fetchCart = async () => {
    try {
      const res = await getActiveCartRequest();
      if (res.data.carrito) {
        setCartData(res.data.carrito);
        setProducts(res.data.productos || []);
      } else {
        // Carrito vacío o no existe
        setCartData(null);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      toast.error("Hubo un problema al cargar tu carrito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Función para actualizar cantidad
  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateCartQuantityRequest(cartData.idcarrito, productId, newQuantity);
      // Recargamos el carrito para obtener los nuevos totales
      fetchCart();
    } catch (error) {
      toast.error("No se pudo actualizar la cantidad");
    }
  };

  // Función para eliminar producto
  const handleRemoveProduct = async (productId) => {
    try {
      await removeProductFromCartRequest(cartData.idcarrito, productId);
      toast.success("Producto eliminado");
      fetchCart();
    } catch (error) {
      toast.error("No se pudo eliminar el producto");
    }
  };

  // Función para confirmar compra
    const handleConfirmOrder = () => {
    navigate("/checkout"); 
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-[#e5e5e5] flex flex-col font-brand">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-2xl text-brand-brown">Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  // CALCULAR EL TOTAL REAL (Con los descuentos aplicados)
  const finalCartTotal = products.reduce((total, item) => {
    const productId = item.idproductofk || item.idProductoFK;
    
    const activePromo = promotions?.find(promo => 
      promo.productos.some(p => String(p.idproducto) === String(productId))
    );
    
    const discount = activePromo ? activePromo.valor : 0;
    const basePrice = Number(item.preciounitario || item.precio);
    const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

    return total + (finalPrice * item.cantidad);
  }, 0);

return (
    <div className="min-h-screen bg-[#f7f2ec] flex flex-col font-brand">
      <Navbar />
      <button
        type="button"
        className="absolute left-2 top-16 flex items-center gap-2 text-brand-brownDark hover:text-brand-brown hover:underline transition-colors z-200 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={28} />
        <span className="font-semibold text-lg">Volver</span>
      </button>
      <div className="max-w-7xl mx-auto px-4 w-full mt-24 md:mt-32 mb-20 grow relative">

        <h1 className="text-5xl md:text-6xl text-[#6B4C3A] text-center mb-16 font-bold pt-12">
          Mi carrito
        </h1>
        
        {products.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl shadow-sm max-w-2xl mx-auto">
            <p className="text-2xl text-gray-600 mb-6">Tu carrito está vacío</p>
            <Link 
              to="/shop" 
              className="inline-block bg-[#6B4C3A] text-white px-8 py-3 rounded-xl hover:bg-[#543b2d] transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            <div className="flex-1 w-full bg-white rounded-3xl shadow-sm">
              {products.map((item) => {
                const productId = item.idproductofk || item.idProductoFK;
                
                // Volvemos a sacar los datos para pasárselos al CartItem
                const activePromo = promotions?.find(promo => 
                  promo.productos.some(p => String(p.idproducto) === String(productId))
                );
                
                const discount = activePromo ? activePromo.valor : 0;
                const basePrice = Number(item.preciounitario || item.precio);
                const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

                return (
                  <CartItem 
                    key={productId} 
                    item={item} 
                    discount={discount}       /* Pasamos el % */
                    finalPrice={finalPrice}   /* Pasamos el precio nuevo */
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveProduct}
                  />
                );
              })}
            </div>

            {/* Le pasamos el total re-calculado, en lugar del cartData.total */}
            <CartSummary 
              total={finalCartTotal} 
              onConfirm={handleConfirmOrder}
              isConfirming={isConfirming}
            />

          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}