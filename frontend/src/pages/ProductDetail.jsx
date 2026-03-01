import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { getFavoritesRequest, toggleFavoriteRequest } from "../api/favorites";
import { useProducts } from "../context/ProductContext";
import { LogIn, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast'; 
import { useNavigate } from "react-router-dom";


import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductInfo from "../components/ProductInfo"; 
import ReviewSection from "../components/ReviewSection"; 
import ReviewForm from "../components/ReviewForm";

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth(); 
  const { getProductById } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
 
  const [averageRating, setAverageRating] = useState(0);
  
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const [refreshReviews, setRefreshReviews] = useState(false);

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

  
  // Handler para alternar favorito
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.custom((t) => (
        <div
          className={`flex items-center gap-3 bg-[#E8EFFF] border border-[#6B90FF] px-10 py-2 mt-9 rounded-full shadow-md pointer-events-auto ${t.visible ? 'toast-enter' : 'toast-leave'}`}
        >
          <LogIn size={20} className="text-[#6B90FF]" />
          <span className="text-[#6B90FF] font-brand font-medium">
            Necesitas iniciar sesión
          </span>
        </div>
      ), { id: 'login-toast', duration: 2500 });
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
  // Si aún está cargando, o si el producto no se encuentra, mostramos mensajes adecuados
  if (loading) return <div className="text-center py-20 font-brand">Cargando...</div>;
  if (!product) return <div className="text-center py-20 font-brand">Producto no encontrado</div>;

  return (
    <div className="bg-[#f7f2ec] flex flex-col min-h-screen font-brand">
      <Navbar />
      
      <main className="min-h-screen">
      {/* Componente Superior: La info del producto */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-16 grow">
        <ProductInfo 
          product={product}
          averageRating={averageRating}
          isFavorite={isFavorite}
          isAnimating={isAnimating}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      <button
        type="button"
        className="absolute left-2 top-12 lg:top-15 flex items-center gap-2 text-brand-brownDark hover:text-brand-brown hover:underline transition-colors z-20 cursor-pointer "
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={28} />
        <span className="font-semibold text-lg">Volver</span>
      </button>

      {/* Componente Inferior: Las reseñas */}
      <div className="max-w-6xl mx-auto mt-12 mb-20">
        <ReviewSection 
          productId={id} 
          onRatingCalculated={setAverageRating} 
          refreshTrigger={refreshReviews} 
        />
      </div>

      {/* Formulario de Reseñas de borde a borde */}
      <ReviewForm 
        productId={id} 
        productName={product.nombre} 
        onReviewAdded={() => setRefreshReviews(!refreshReviews)} 
      />

      </main>

      <Footer />
    </div>
  );
}