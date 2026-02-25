import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getProductReviewsRequest } from "../api/reviews";

export default function ReviewSection({ productId, onRatingCalculated, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {

        const res = await getProductReviewsRequest(productId);
        const fetchedReviews = res.data;
        
        setReviews(fetchedReviews);
        
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

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  if (loading) return <p className="font-brand text-center py-4">Cargando reseñas...</p>;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-brand-brownDark mb-8 font-brand">Reseñas y valoraciones</h2>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500 font-brand">Aún no hay reseñas para este producto. ¡Sé el primero en opinar!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.idUsuarioFK || review.idusuariofk} className="bg-[#eaddcc] rounded-xl p-6 md:p-8 flex flex-col font-brand text-brand-brownDark">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                  <span>{review.nombre}</span>
                  <span className="text-gray-500 font-normal">·</span>
                  <span className="text-gray-600 font-normal">{formatDate(review.fecha)}</span>
                </div>
                
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

                <p
                  className="text-sm md:text-base leading-relaxed mb-4 line-clamp-1 md:line-clamp-3"
                >
                  {review.comentario}
                </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}