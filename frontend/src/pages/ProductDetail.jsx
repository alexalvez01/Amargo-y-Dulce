import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { getFavoritesRequest, toggleFavoriteRequest } from "../api/favorites";
import { useProducts } from "../context/ProductContext";
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast'; 

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductInfo from "../components/ProductInfo"; // Importamos el componente de arriba
import ReviewSection from "../components/ReviewSection"; // Importamos el componente de las reseñas
import ReviewForm from "../components/ReviewForm";

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth(); 
  const { getProductById } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para las reseñas que conectará la parte de abajo con la de arriba
  const [averageRating, setAverageRating] = useState(0);
  
  // Estados para Favoritos
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  if (loading) return <div className="text-center py-20 font-brand">Cargando...</div>;
  if (!product) return <div className="text-center py-20 font-brand">Producto no encontrado</div>;

  return (
    <div className="bg-[#fcf8f5] flex flex-col min-h-screen font-brand">
      <Navbar />

      {/* Componente Superior: La info del producto */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-8 grow">
        <ProductInfo 
          product={product}
          averageRating={averageRating}
          isFavorite={isFavorite}
          isAnimating={isAnimating}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Componente Inferior: Las reseñas */}
      <div className="max-w-6xl mx-auto p-4 mt-12 mb-20">
        <ReviewSection 
          productId={id} 
          onRatingCalculated={setAverageRating} 
          refreshTrigger={refreshReviews} // <-- Le pasamos el gatillo
        />
      </div>

      {/* NUEVO: El Formulario de Reseñas de borde a borde */}
      <ReviewForm 
        productId={id} 
        productName={product.nombre} 
        onReviewAdded={() => setRefreshReviews(!refreshReviews)} // <-- Dispara la actualización
      />

      <Footer />
    </div>
  );
}