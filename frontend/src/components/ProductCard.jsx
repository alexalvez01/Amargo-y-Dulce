
export default function ProductCard({ product }) {
    if (product === undefined) {
        return <p>Cargando producto...</p>;
    }
  return (
    <div className="group bg-white rounded-xl min-w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product?.imagen}
          alt={product.nombre}
          className="w-full h-72     object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm text-brand-brownDark font-semibold">{product.nombre}</h3>

          {product.stock > 0 ? (
            <span className="text-xs text-green-600">En stock</span>
          ) : (
            <span className="text-xs text-red-600">Agotado</span>
          )}

        </div>

        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
                {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                }).format(product.precio)}
            </span>

          <span className="text-xs text-gray-500">
            Tamaño: {product.tamaño}
          </span>
        </div>
      </div>
    </div>
  );
}
