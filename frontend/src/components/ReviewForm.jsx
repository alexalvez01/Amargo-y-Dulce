import { useState } from "react";
import { Star, MessageCircleIcon, LogIn } from "lucide-react";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";
import { createReviewRequest } from "../api/reviews";

export default function ReviewForm({ productId, productName, onReviewAdded }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // Para la animación de las estrellas
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Barrera de seguridad: Usuario logueado
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

    // 2. Barrera: Tiene que elegir al menos 1 estrella
    if (rating === 0) {
      toast.error("Por favor, selecciona una calificación con las estrellas", { style: { fontFamily: 'inherit' } });
      return;
    }

    // 3. Barrera: Comentario muy corto
    if (comment.trim().length < 5) {
      toast.error("Por favor, escribe un comentario un poco más largo", { style: { fontFamily: 'inherit' } });
      return;
    }

    setIsSubmitting(true);

    try {
      // Llamamos a tu Backend real
      await createReviewRequest({
        productId,
        calificacion: rating,
        comentario: comment
      });

      toast.custom((t) => (
        <div className={`flex items-center gap-3 bg-[#E8F5E9] border border-[#4CAF50] px-10 py-2 mt-9 rounded-full shadow-md pointer-events-auto ${t.visible ? 'toast-enter' : 'toast-leave'}`}>
          <MessageCircleIcon size={20} className="text-[#4CAF50]" />
          <span className="text-[#4CAF50] font-brand font-medium">
            ¡Gracias por tu reseña!
          </span>
        </div>
      ), { id: 'review-toast', duration: 2500 }); // El id evita que se spamee si hacen muchos clics

      // Limpiamos el formulario
      setRating(0);
      setComment("");
      
      // Le avisamos a la página que actualice las reseñas de arriba
      if (onReviewAdded) onReviewAdded();

    } catch (error) {
      // Atrapamos el error que programó tu amigo si ya dejó una reseña (Status 400)
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Ya dejaste una reseña para este producto");
      } else {
        toast.error("Hubo un problema al enviar la reseña");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Fondo marrón que abarca todo el ancho, tal como en tu Figma
    <div className="w-full bg-[#968373] py-16 mt-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 font-brand">
          Compartí tu opinión de "{productName}" acá:
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Selector de Estrellas */}
          <div>
            <p className="text-white md:text-lg mb-3 font-brand">Tu valoración del producto</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    fill={(hoverRating || rating) >= star ? "#fbbf24" : "transparent"}
                    className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-yellow-400"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Cuadro de Texto */}
          <div>
            <p className="text-white md:text-lg mb-3 font-brand">Tu Reseña</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Mensaje"
              className="w-full h-32 md:h-40 bg-[#eaddcc] text-[#4A3024] p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#543b2d] font-brand resize-none placeholder:text-[#968373] shadow-inner"
            ></textarea>
          </div>

          {/* Botón Enviar */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#543b2d] text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-[#3f2c22] transition-colors font-brand ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}