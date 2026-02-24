import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getFavoritesRequest, toggleFavoriteRequest } from "../api/favorites";
import { useProducts } from "../context/ProductContext";
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast'; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); 
  const { getProductById } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Estados nuevos para Favoritos
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Buscamos la info del producto Y vemos si es favorito
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await getProductById(id);
        setProduct(prod);
        
        if (isAuthenticated) {
          const favRes = await getFavoritesRequest();
          const isFav = favRes.data.some(fav => String(fav.id) === String(id));
          setIsFavorite(isFav);
        } else {
          setIsFavorite(false);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated, getProductById]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.custom((t) => (
        <div
          className={`
            flex items-center gap-3 bg-[#E8EFFF] border border-[#6B90FF] px-10 py-2 mt-9 rounded-full shadow-md pointer-events-auto
            ${t.visible ? 'toast-enter' : 'toast-leave'}
          `}
        >
          <LogIn size={20} className="text-[#6B90FF]" />
          <span className="text-[#6B90FF] font-brand font-medium">
            Necesitas iniciar sesión
          </span>
        </div>
      ), { 
        id: 'login-toast',
        duration: 2500 
      });

      return;
    }


    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); 
    setIsFavorite(!isFavorite); 

    try {

      await toggleFavoriteRequest(id);
    } catch (error) {
      console.error("Error al modificar favoritos:", error);
      setIsFavorite(isFavorite);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQty = () => setQuantity(quantity + 1);

  if (loading) return <div className="text-center py-20 font-brand">Cargando...</div>;
  if (!product) return <div className="text-center py-20 font-brand">Producto no encontrado</div>;

  return (
    <div className="bg-gray-200 flex flex-col min-h-screen font-brand">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-8 grow">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-12 relative z-10">
          
          {/* COLUMNA IZQUIERDA: Imagen */}
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md group">
              <img 
                src={product.imagen || "/images/producto-clasico.png"} 
                alt={product.nombre} 
                className="w-full h-full object-cover"
              />
              
              {/* CORAZÓN MÁGICO ANIMADO */}
              <button 
                onClick={handleToggleFavorite}
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
              <h2 className="text-3xl md:text-4xl font-bold text-brand-brownDark">
                {product.nombre}
              </h2>
            </div>

            <div className="flex gap-1 text-yellow-400 mb-4">
               {[1, 2, 3, 4, 5].map((star) => (
                 <Star key={star} size={20} fill="currentColor" className="text-yellow-400" />
               ))}
               <span className="text-gray-400 text-sm ml-2 font-brand">(4.8)</span>
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
                onClick={() => alert(`Agregaste ${quantity} cajas de ${product.nombre} al carrito!`)}
            >
                <ShoppingCart size={24} />
                Agregar al carrito
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 mt-12 mb-20">
          <h2 className="text-2xl font-bold text-[#6B4C3A] mb-6 font-brand">Reseñas y valoraciones</h2>
          <p className="text-gray-500 font-brand">Próximamente...</p>
      </div>

      <Footer />
    </div>
  );
}