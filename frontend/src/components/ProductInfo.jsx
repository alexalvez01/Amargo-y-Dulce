import { useState } from "react";
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import toast from 'react-hot-toast'; 
import { useAuth } from "../context/AuthContext";
import { addToCartRequest } from "../api/cart";

export default function ProductInfo({ 
  product, 
  averageRating, 
  isFavorite, 
  isAnimating, 
  onToggleFavorite 
}) {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`¡Solo quedan ${product.stock} unidades en stock!`, {
        style: { fontFamily: 'inherit' }
      });
    }
  };

  // --- NUEVA FUNCIÓN PARA EL CARRITO ---
  const handleAddToCart = async () => {
    // ... (tu código de agregar al carrito sigue igual de aquí para abajo)
    // 2. Intentamos enviar el producto al backend
    try {
      // Usamos el ID del producto (verificamos las mayúsculas por si acaso)
      const productId = product.idproducto || product.idProducto;
      
      await addToCartRequest(productId, quantity);
      
      // Mensaje de éxito elegante con los colores de Amargo y Dulce
      toast.success(`¡Agregaste ${quantity} cajas al carrito!`, {
        icon: '🛒',
        style: { fontFamily: 'inherit', background: '#eaddcc', color: '#4A3024' }
      });
      
      // Opcional: Volvemos el contador a 1 después de agregar
      setQuantity(1);

    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Hubo un problema al agregar al carrito.");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-12 relative z-10">
      
      {/* COLUMNA IZQUIERDA: Imagen */}
      <div className="w-full md:w-1/2">
        <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md group">
          <img 
            src={product.imagen || "/images/producto-clasico.webp"} 
            alt={product.nombre} 
            className="w-full h-full object-cover"
          />
          
          {/* CORAZÓN MÁGICO ANIMADO */}
          <button 
            onClick={onToggleFavorite}
            className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 z-20"
          >
            <Heart 
              size={24} 
              className={`transition-all duration-300 ${
                isAnimating ? "scale-150" : "scale-100 hover:scale-110"
              } ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
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

        {/* Estrellas conectadas al promedio */}
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

        <p className="text-3xl font-bold text-black mb-2 font-brand">
          $ {Number(product.precio).toLocaleString('es-AR')}
        </p>

        <p className="text-green-600 font-semibold mb-6 flex items-center gap-2 font-brand">
          <span className="w-2 h-2 rounded-full bg-green-600"></span>
          En Stock ({product.stock} disponibles)
        </p>

        <div className="mb-6">
            <span className="text-sm font-bold text-brand-brown block mb-2 font-brand">Cantidad:</span>
            <div className="flex items-center gap-4 border border-gray-300 rounded-lg w-fit px-4 py-2">
                <button onClick={decreaseQty} className="hover:text-brand-brownDark transition-colors"><Minus size={18}/></button>
                <span className="font-bold text-lg w-4 text-center font-brand">{quantity}</span>
                <button onClick={increaseQty} className="hover:text-brand-brownDark transition-colors"><Plus size={18}/></button>
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
            className="w-full md:w-auto bg-[#6B4C3A] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-[#543b2d] transition-transform hover:scale-105 flex items-center justify-center gap-3 font-brand"
            onClick={handleAddToCart} // ¡Aquí llamamos a nuestra función!
        >
            <ShoppingCart size={24} />
            Agregar al carrito
        </button>

      </div>
    </div>
  );
}