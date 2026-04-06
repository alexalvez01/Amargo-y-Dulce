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
  confirmCartRequest,
  reactivateCartRequest
} from "../api/cart";
import { AlertCircle, Clock, ShoppingBag } from "lucide-react";


export default function CartPage() {
  const [cartData, setCartData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
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
  const handleConfirmOrder = async () => {
    if (!cartData?.idcarrito) return;

    try {
      setIsConfirming(true);
      await confirmCartRequest(cartData.idcarrito);
      navigate("/order-detail");
    } catch (error) {
      toast.error("No se pudo confirmar el pedido");
    } finally {
      setIsConfirming(false);
    }
  };

  // Función para reactivar el carrito (volver de confirmado a activo)
  const handleReactivateCart = async () => {
    if (!cartData?.idcarrito) return;

    try {
      setIsReactivating(true);
      await reactivateCartRequest(cartData.idcarrito);
      toast.success("Carrito recuperado. Ahora puedes editar tus productos.");
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al intentar recuperar el carrito.");
    } finally {
      setIsReactivating(false);
    }
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
    // Producto sin stock no suma al total
    if (item.stock <= 0) return total;
    
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


      <main className="min-h-screen">
      <button
        type="button"
        className="absolute left-2 top-16 flex items-center gap-2 text-brand-brownDark hover:text-brand-brown hover:underline transition-colors z-20 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={28} />
        <span className="font-semibold text-lg">Volver</span>
      </button>
      <div className="max-w-7xl mx-auto px-4 w-full mt-24 md:mt-32 mb-20 grow relative">

        <h2 className="text-4xl md:text-5xl text-brand-brownDark text-center mb-16 font-semibold pt-12">
          Mi carrito
        </h2>

        {cartData?.estado === 'confirmado' && (
          <div className="max-w-4xl mx-auto mb-10 overflow-hidden bg-white rounded-3xl shadow-lg border-2 border-[#6b4c3a] animate-fade-in">
            <div className="flex flex-col md:flex-row">
              <div className="bg-[#6b4c3a] p-6 flex items-center justify-center text-white">
                <AlertCircle size={48} className="animate-pulse" />
              </div>
              <div className="p-6 flex-1 bg-linear-to-br from-white to-[#fdfaf7]">
                <h3 className="text-xl font-bold text-[#6b4c3a] mb-2 flex items-center gap-2">
                  <Clock size={20} />
                  Tenés un pago pendiente de finalización
                </h3>
                <p className="text-[#5d4037] text-sm mb-6 leading-relaxed">
                  Iniciaste el proceso de pago hace unos minutos. Tus productos están <span className="font-bold underline">reservados temporalmente</span>.
                  Podés continuar para terminar el pedido o recuperar el carrito si necesitás hacer cambios.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/order-detail")}
                    className="bg-[#6b4c3a] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#543b2d] transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                  >
                    <ShoppingBag size={18} />
                    Continuar con el Pago
                  </button>
                  <button
                    onClick={handleReactivateCart}
                    disabled={isReactivating}
                    className="border-2 border-[#6b4c3a] text-[#6b4c3a] px-6 py-2.5 rounded-xl font-bold hover:bg-[#6b4c3a] hover:text-white transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isReactivating ? "Procesando..." : "Modificar Carrito / Recuperar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
                    discount={discount}       
                    finalPrice={finalPrice}   
                    onUpdateQuantity={cartData?.estado === 'confirmado' ? null : handleUpdateQuantity}
                    onRemove={cartData?.estado === 'confirmado' ? null : handleRemoveProduct}
                  />
                );
              })}
            </div>

            {/* Le pasamos el total re-calculado, en lugar del cartData.total */}
            <CartSummary 
              total={finalCartTotal} 
              onConfirm={cartData?.estado === 'confirmado' ? () => navigate("/order-detail") : handleConfirmOrder}
              isConfirming={isConfirming}
              isLocked={cartData?.estado === 'confirmado'}
            />

          </div>
        )}

      </div>
      </main>
      
      <Footer />
    </div>
  );
}
