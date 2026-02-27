import { usePromotions } from "../context/PromotionContext";

export default function ProductCard({ product }) {
  const { promotions } = usePromotions();
  const activePromo = promotions?.find(promo => 
    promo.productos.some(p => String(p.idproducto) === String(product.idproducto))
  );
  const discount = activePromo ? activePromo.valor : 0;
  // Calculamos el precio final con el descuento aplicado
  const finalPrice = discount > 0 ? product.precio * (1 - discount / 100) : product.precio;
  if (product === undefined) {
    return <p>Cargando producto...</p>;
  }
  return (
    <div className="group bg-white rounded-xl w-full  overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative overflow-hidden">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-2xl z-10 shadow-sm">
            {discount}% OFF
          </span>
        )}
        <img
          src={product?.imagen}
          alt={product.nombre}
          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-sm text-brand-brownDark font-semibold wrap-break-words min-w-0 flex-1">
            {product.nombre}
          </h3>

          {product.stock > 0 ? (
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
