import { useState } from "react";
import { Star, Heart, ShoppingCart, Minus, Plus, LogIn } from "lucide-react";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";
import { addToCartRequest } from "../api/cart";
import { usePromotions } from "../context/PromotionContext";

export default function ProductInfo({
  product,
  averageRating,
  isFavorite,
  isAnimating,
  onToggleFavorite
}) {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, user } = useAuth();
  const { promotions } = usePromotions();

  const stockValue = Number(product.stock || 0);
  const isAdmin = user?.rol === "admin";

  const activePromo = promotions?.find(promo =>
    promo.estado === 'activo' && promo.productos.some(p => String(p.idproducto) === String(product.idproducto || product.idProducto))
  );

  const discount = activePromo ? activePromo.valor : 0;
  const finalPrice = discount > 0 ? product.precio * (1 - discount / 100) : product.precio;
  const isInactive = product.estado === 'inactivo';

  // Lógica de stock unificada con las ProductCards
  const isLowStock = stockValue > 0 && stockValue <= 10;
  const isOutOfStock = stockValue <= 0 || isInactive;

  const [isFlying, setIsFlying] = useState(false);
  const [flyPos, setFlyPos] = useState({ top: 0, left: 0 });

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < stockValue) {
      setQuantity(quantity + 1);
    } else {
      toast.error("No hay unidades suficientes", {
        style: { fontFamily: 'inherit' }
      });
    }
  };

  const handleAddToCart = async (e) => {
    if (stockValue === 0) {
      toast.error("No hay stock disponible");
      return;
    }

    if (!isAuthenticated) {
      toast.custom((t) => (
        <div className={`flex items-center gap-3 bg-[#E8EFFF] border border-[#6B90FF] px-10 py-2 mt-9 rounded-full shadow-md pointer-events-auto ${t.visible ? 'toast-enter' : 'toast-leave'}`}>
          <LogIn size={20} className="text-[#6B90FF]" />
          <span className="text-[#6B90FF] font-brand font-medium">
            Necesitas iniciar sesión
          </span>
        </div>
      ), { id: 'login-toast', duration: 2500 });

      return;
    }

    if (!isFlying) {
      setFlyPos({
        top: e.clientY - 10,
        left: e.clientX - 10
      });
      setIsFlying(true);
      setTimeout(() => setIsFlying(false), 800);
    }

    try {
      const productId = product.idproducto || product.idProducto;
      await addToCartRequest(productId, quantity);

      window.dispatchEvent(new Event('cart-updated'));
      toast.custom((t) => (
        <div className={`flex items-center gap-3 bg-[#E8F5E9] border border-[#4CAF50] px-10 py-2 mt-9 rounded-full shadow-md pointer-events-auto ${t.visible ? 'toast-enter' : 'toast-leave'}`}>
          <ShoppingCart size={20} className="text-[#4CAF50]" />
          <span className="text-[#4CAF50] font-brand font-medium">
            Agregado al carrito
          </span>
        </div>
      ), { id: 'cart-toast', duration: 2500 });

      setQuantity(1);

    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Hubo un problema al agregar al carrito.");
    }
  };

  return (
    <>
      {isFlying && (
        <img
          className="flying-ball"
          src={product.imagen || "/images/producto-clasico.webp"}
          alt="volando"
          style={{
            '--start-top': `${flyPos.top}px`,
            '--start-left': `${flyPos.left}px`
          }}
        />
      )}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-12 relative z-10">

        {/* COLUMNA IZQUIERDA: Imagen */}
        <div className="w-full md:w-1/2">
          <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md group">
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-sm z-30">
                {discount}% OFF
              </div>
            )}

            {isLowStock && !isInactive && (
              <span className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs uppercase font-black px-3 py-1.5 rounded-lg z-30 shadow-md">
                ¡Pocas unidades!
              </span>
            )}

            <img
              src={product.imagen || "/images/producto-clasico.webp"}
              alt={product.nombre}
              className={`w-full h-full object-cover ${isInactive ? 'opacity-50 grayscale' : ''}`}
            />

            {isInactive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <span className="bg-gray-800 text-white text-lg font-bold px-6 py-2 rounded uppercase shadow-lg">
                  No disponible
                </span>
              </div>
            )}

            {/* Botón de Favoritos (Arriba a la derecha) */}
            <button
              onClick={onToggleFavorite}
              className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 z-30"
            >
              <Heart
                size={24}
                className={`transition-all duration-300 ${isAnimating ? "scale-150" : "scale-100 hover:scale-110"
                  } ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
              />
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: Información */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">

          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-brown">
              {product.nombre}
            </h1>
          </div>

          <div className="flex gap-1 text-yellow-400 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                fill={star <= averageRating ? "currentColor" : "transparent"}
                className="text-yellow-400"
              />
            ))}
            <span className="text-gray-400 text-sm ml-2 font-brand">({averageRating})</span>
          </div>

          <div className="mb-4">
            {discount > 0 ? (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-lg font-brand">
                  $ {Number(product.precio).toLocaleString('es-AR')}
                </span>
                <span className="text-3xl font-bold text-green-600 font-brand">
                  $ {Number(finalPrice).toLocaleString('es-AR')}
                </span>
              </div>
            ) : (
              <p className="text-3xl font-bold text-black font-brand">
                $ {Number(product.precio).toLocaleString('es-AR')}
              </p>
            )}
          </div>

          {/* Lógica de estado de stock en texto */}
          {isAdmin ? (
            <p className="text-brand-brownDark font-semibold mb-6 flex items-center gap-2 font-brand">
              <span className={`w-2 h-2 rounded-full ${stockValue > 0 ? "bg-green-600" : "bg-red-600"}`}></span>
              Stock disponible: {stockValue} unidades
            </p>
          ) : (
            <>
              {isOutOfStock ? (
                <p className="text-red-600 font-semibold mb-6 flex items-center gap-2 font-brand">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Agotado
                </p>
              ) : (
                <p className="text-green-600 font-semibold mb-6 flex items-center gap-2 font-brand">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  En stock
                </p>
              )}
            </>
          )}

          <div className="mb-6">
            <span className="text-sm font-bold text-brand-brown block mb-2 font-brand">Cantidad:</span>
            <div className="flex items-center gap-4 border border-gray-300 rounded-lg w-fit px-4 py-2">
              <button onClick={decreaseQty} className="hover:text-brand-brownDark transition-colors"><Minus size={18} /></button>
              <span className="font-bold text-lg w-4 text-center font-brand">{quantity}</span>
              <button onClick={increaseQty} className="hover:text-brand-brownDark transition-colors"><Plus size={18} /></button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 italic font-brand">
              Tamaño: {product.tamaño || product.tamano || 'Único'} unidades por caja
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 font-brand">
            {product.descripcion}
          </p>

          <button
            className={`w-full md:w-auto font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3 font-brand transition-all ${isInactive || stockValue === 0
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-70 pointer-events-none'
                : 'bg-[#6B4C3A] text-white hover:bg-[#543b2d] hover:scale-105'
              }`}
            onClick={handleAddToCart}
            disabled={isInactive || stockValue === 0}
          >
            <ShoppingCart size={24} />
            {isInactive ? "No Disponible" : (stockValue === 0 ? "Agotado" : "Agregar al carrito")}
          </button>

        </div>
      </div>
    </>
  );
}