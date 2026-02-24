import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getProductReviewsRequest } from "../api/reviews";

export default function ReviewSection({ productId, onRatingCalculated, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Llamamos a tu ruta real
        const res = await getProductReviewsRequest(productId);
        const fetchedReviews = res.data;
        
        setReviews(fetchedReviews);
        
        // Calculamos el promedio de estrellas
        if (fetchedReviews.length > 0) {
          const total = fetchedReviews.reduce((acc, curr) => acc + Number(curr.calificacion), 0);
          onRatingCalculated((total / fetchedReviews.length).toFixed(1));
        } else {
          onRatingCalculated(0);
        }
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, onRatingCalculated, refreshTrigger]);

  // Función para formatear la fecha que viene de tu base de datos (PostgreSQL)
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  if (loading) return <p className="font-brand text-center py-4">Cargando reseñas...</p>;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#4A3024] mb-8 font-brand">Reseñas y valoraciones</h2>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500 font-brand">Aún no hay reseñas para este producto. ¡Sé el primero en opinar!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            // Usamos idUsuarioFK como key única, ya que un usuario solo tiene 1 reseña por producto
            <div key={review.idUsuarioFK || review.idusuariofk} className="bg-[#eaddcc] rounded-xl p-6 md:p-8 flex flex-col font-brand text-[#4A3024]">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                  {/* Leemos el 'nombre' que viene de tu JOIN */}
                  <span>{review.nombre}</span>
                  <span className="text-gray-500 font-normal">·</span>
                  <span className="text-gray-600 font-normal">{formatDate(review.fecha)}</span>
                </div>
                
                {/* Estrellas */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={18} 
                      fill={star <= review.calificacion ? "#fbbf24" : "transparent"} 
                      className={star <= review.calificacion ? "text-yellow-400" : "text-yellow-400"} 
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>

              {/* Leemos el 'comentario' de tu consulta SQL */}
              <p className="text-sm md:text-base leading-relaxed mb-4">
                {review.comentario}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}