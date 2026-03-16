import { usePromotions } from "../context/PromotionContext";

export default function ProductCard({ product }) {
  const { promotions } = usePromotions();
  const activePromo = promotions?.find(promo =>
    promo.estado === 'activo' && promo.productos.some(p => String(p.idproducto) === String(product.idproducto))
  );
  const discount = activePromo ? activePromo.valor : 0;
  const finalPrice = discount > 0 ? product.precio * (1 - discount / 100) : product.precio;
  if (product === undefined) {
    return <p>Cargando producto...</p>;
  }

  const isInactive = product.estado === 'inactivo';

  return (
    <div className="group bg-white rounded-xl w-full  overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative overflow-hidden">
        {discount > 0 && !isInactive && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-2xl z-10 shadow-sm">
            {discount}% OFF
          </span>
        )}

        {isInactive && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded uppercase z-20 shadow-md whitespace-nowrap">
            No disponible
          </span>
        )}

        <img
          src={product?.imagen}
          alt={product.nombre}
          className={`w-full h-72 object-cover transition-transform duration-500 ${isInactive ? 'opacity-60 grayscale' : 'group-hover:scale-105'}`}
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-sm text-brand-brownDark font-semibold wrap-break-words min-w-0 flex-1">
            {product.nombre}
          </h3>

          {isInactive ? (
            <span className="text-xs text-gray-500 shrink-0 text-right font-semibold">Agotado</span>
          ) : product.stock > 0 ? (
            <span className="text-xs text-green-600 shrink-0 text-right">En stock</span>
          ) : (
            <span className="text-xs text-red-600 shrink-0 text-right">Agotado</span>
          )}

        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            $ {Number(product.precio).toLocaleString('es-AR')}
          </span>

          <span className="text-xs text-gray-500">
            Tamaño: {product.tamaño}
          </span>
        </div>
      </div>
    </div>
  );
}
