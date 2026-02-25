import { useNavigate } from "react-router-dom";

export default function PromotionCard({ promo }) {

  const navigate = useNavigate();
  

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  return (
    <div className="group bg-white rounded-xl w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 p-8 relative">
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
        {promo.valor}%
      </span>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-brand-brownDark">
          {promo.nombre}
        </h3>

        <p className="text-sm text-gray-700">
          {promo.descripcion}
        </p>

        <p className="text-xs text-gray-500">
          Válido: {formatDate(promo.fechainicio)} - {formatDate(promo.fechafin)}
        </p>

        {/* Productos asociados */}
        {promo.productos?.length > 0 && (
          <p className="text-sm font-medium text-green-700">
            Aplica a: {promo.productos.length} {promo.productos.length === 1 ? "producto" : "productos"}
          </p>
        )}
        <button
        onClick={() => navigate(`/promociones/${promo.idpromocion}`)}
        className="mt-3 bg-brand-brown text-white px-4 py-2 rounded hover:bg-brand-brownDark transition"
        >
        Ver productos
        </button>
      </div>
    </div>
  );
}
