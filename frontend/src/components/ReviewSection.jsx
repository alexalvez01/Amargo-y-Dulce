import { useState, useEffect } from "react";
import { Star, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getProductReviewsRequest, deleteReviewAsAdminRequest, deleteReviewRequest } from "../api/reviews";
import { useAuth } from "../context/AuthContext";

export default function ReviewSection({ productId, onRatingCalculated, refreshTrigger }) {
  const { user } = useAuth();
  const currentUserId = user?.idUsuario || user?.userId || user?.id;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // --- LÓGICA DE BORRADO ---
  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      setIsDeleting(true);
      const reviewUserId = reviewToDelete.idUsuarioFK || reviewToDelete.idusuariofk;

      // Separamos la petición según el rol
      if (user?.rol === 'admin') {
        await deleteReviewAsAdminRequest(productId, reviewUserId);
      } else {
        await deleteReviewRequest(productId);
      }

      // Actualizamos estado local
      const updatedReviews = reviews.filter(
        r => (r.idUsuarioFK || r.idusuariofk) !== reviewUserId
      );
      setReviews(updatedReviews);

      // Recalculamos estrellas
      if (updatedReviews.length > 0) {
        const total = updatedReviews.reduce((acc, curr) => acc + Number(curr.calificacion), 0);
        onRatingCalculated((total / updatedReviews.length).toFixed(1));
      } else {
        onRatingCalculated(0);
      }

      toast.success("Comentario eliminado correctamente");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error al eliminar el comentario");
    } finally {
      setIsDeleting(false);
      setReviewToDelete(null);
    }
  };

  if (loading) return <p className="font-brand text-center py-4">Cargando reseñas...</p>;

  return (
    <div className="w-full relative mt-10">
      <h2 className="text-2xl font-bold text-center lg:text-left text-brand-brownDark mb-8 font-brand">Reseñas y valoraciones</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 font-brand">Aún no hay reseñas para este producto. ¡Sé el primero en opinar!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={review.idUsuarioFK || review.idusuariofk}
              className="bg-[#eaddcc] rounded-xl p-6 md:p-8 flex flex-col font-brand text-brand-brownDark relative group transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
              style={{
                animation: `slideDownFade 0.5s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0
              }}
            >

              {/* BOTÓN "X" PARA ADMIN O DUEÑO DEL COMENTARIO */}
              {(user?.rol === 'admin' || currentUserId === (review.idUsuarioFK || review.idusuariofk)) && (
                <button
                  onClick={() => handleDeleteClick(review)}
                  className="absolute top-1 right-1 text-brand-brownDark/50 hover:text-red-600 hover:bg-red-100/50 p-1.5 rounded-full transition-all"
                  title="Eliminar comentario"
                >
                  <X size={20} />
                </button>
              )}

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 pr-8">
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
                      className={`text-yellow-400 transition-all duration-300 ease-out group-hover:scale-125 group-hover:-translate-y-1 ${star <= review.calificacion ? 'drop-shadow-sm' : 'opacity-40'}`}
                      style={{ transitionDelay: `${star * 50}ms` }}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm md:text-base leading-relaxed mb-4 line-clamp-1 md:line-clamp-3">
                {review.comentario}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PEQUEÑO DE CONFIRMACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-100 flex items-center justify-center p-4 backdrop-blur-sm font-brand">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden text-center animate-fade-in-up pb-10 pt-12 px-6">

            <div className="absolute top-0 left-0 w-full h-2 bg-[#6b4c3a]"></div>

            <h3 className="text-[22px] md:text-2xl font-bold text-[#6b4c3a] mb-4">
              ¿Desea borrar este comentario?
            </h3>

            <p className="text-gray-500 text-sm mb-8 px-4">
              Esta acción no se puede deshacer. El comentario de <span className="font-semibold">{reviewToDelete?.nombre}</span> será borrado permanentemente.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-8 py-2.5 bg-[#6b4c3a] text-white rounded-lg font-semibold hover:bg-[#543b2d] transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Borrando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
                className="px-8 py-2.5 bg-white text-[#6b4c3a] border border-[#6b4c3a] rounded-lg font-semibold hover:bg-[#fcf8f5] transition-colors"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}