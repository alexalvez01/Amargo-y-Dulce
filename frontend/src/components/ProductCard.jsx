import { usePromotions } from "../context/PromotionContext";

export default function ProductCard({ product, disableHover = false }) {
  const { promotions } = usePromotions();
  
  if (product === undefined) {
    return <p>Cargando producto...</p>;
  }

  const activePromo = promotions?.find(promo =>
    promo.estado === 'activo' && promo.productos.some(p => String(p.idproducto) === String(product.idproducto))
  );
  
  const discount = activePromo ? activePromo.valor : 0;
  const finalPrice = discount > 0 ? product.precio * (1 - discount / 100) : product.precio;
  const isInactive = product.estado === 'inactivo';
  
  // Lógica de stock
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0 || isInactive;

  return (
    <div className={`h-full flex flex-col group bg-white rounded-xl w-full overflow-hidden shadow-sm transition-all duration-500 ${disableHover ? '' : 'hover:shadow-2xl hover:-translate-y-2'}`}>
      
      {/* Contenedor de Imagen y Badges */}
      <div className="relative overflow-hidden shrink-0">
        
        {/* Badge de Descuento (Arriba Izquierda) */}
        {discount > 0 && !isInactive && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-2xl z-10 shadow-sm">
            {discount}% OFF
          </span>
        )}

        {/* Badge de Pocas Unidades */}
        {isLowStock && !isInactive && (
          <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-[10px] uppercase font-black px-2 py-1 rounded-lg z-10 shadow-md">
            ¡Pocas unidades!
          </span>
        )}

        {/* Cartel No Disponible (Centro) */}
        {isInactive && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded uppercase z-20 shadow-md whitespace-nowrap">
            No disponible
          </span>
        )}

        <img
          src={product?.imagen}
          alt={product.nombre}
          className={`w-full h-72 object-cover transition-transform duration-700 ease-out ${isInactive ? 'opacity-60 grayscale' : ''} group-hover:scale-110`}
        />
      </div>

      {/* Información del Producto */}
      <div className="p-4 space-y-2 grow flex flex-col justify-between">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-sm text-brand-brownDark font-semibold wrap-break-words min-w-0 flex-1">
            {product.nombre}
          </h3>

          {/* Estado del Stock (Texto Inferior) */}
          <div className="shrink-0 text-right font-semibold text-xs">
            {isOutOfStock ? (
              <span className="text-red-600">Agotado</span>
            ) : (
              <span className="text-green-600">En stock</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          {discount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-sm font-medium">
                $ {Number(product.precio).toLocaleString('es-AR')}
              </span>
              <span className="text-sm font-bold text-green-600">
                $ {Number(finalPrice).toLocaleString('es-AR')}
              </span>
            </div>
          ) : (
            <span className="text-sm font-medium">
              $ {Number(product.precio).toLocaleString('es-AR')}
            </span>
          )}

          <span className="text-xs text-gray-500">
            Tamaño: {product.tamaño}
          </span>
        </div>
      </div>
    </div>
  );
}