import { Minus, Plus } from "lucide-react";

export default function CartItem({ item, discount, finalPrice, onUpdateQuantity, onRemove }) {
  const imagen = item.imagen || "/images/producto-clasico.webp";
  const productId = item.idproductofk || item.idProductoFK; 

  const basePrice = Number(item.preciounitario || item.precio);

  const handleDecrease = () => {
    if (item.cantidad > 1) {
      onUpdateQuantity(productId, item.cantidad - 1);
    }
  };

  const handleIncrease = () => {
    // Por ahora le sumamos 1. (Nota: Tu backend actual en el update no verifica stock, 
    // ¡sería una buena mejora agregarlo después!)
    onUpdateQuantity(productId, item.cantidad + 1);
  };

return (
    <div className="flex gap-4 md:gap-6 p-6 border-b border-gray-200 last:border-0 bg-white first:rounded-t-2xl last:rounded-b-2xl">
      
      {/* IMAGEN CON CARTELITO DE PROMOCIÓN */}
      <div className="relative shrink-0">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow-sm">
            {discount}% OFF
          </span>
        )}
        <img 
          src={imagen} 
          alt={item.nombre} 
          className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover shadow-sm"
        />
      </div>

      {/* INFORMACIÓN */}
      <div className="flex flex-col flex-1 justify-between">
        
        {/* Título y Precio */}
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-xl md:text-2xl font-bold text-[#6B4C3A] font-brand leading-tight">
              {item.nombre}
            </h3>
            
            {/* LÓGICA DEL PRECIO TACHADO */}
            {discount > 0 ? (
              <div className="flex flex-col items-end">
                <span className="text-gray-400 line-through text-sm font-brand">
                  $ {basePrice.toLocaleString('es-AR')}
                </span>
                <p className="text-lg md:text-xl font-bold text-green-600 font-brand whitespace-nowrap">
                  $ {Number(finalPrice).toLocaleString('es-AR')}
                </p>
              </div>
            ) : (
              <p className="text-lg md:text-xl font-medium text-gray-800 font-brand whitespace-nowrap">
                $ {basePrice.toLocaleString('es-AR')}
              </p>
            )}
          </div>
          
          <p className="text-sm text-gray-500 italic mt-1 font-brand">Tamaño: {item.tamaño}</p>
        </div>

        {/* Controles de Cantidad y Eliminar */}
        <div className="flex flex-col gap-2 mt-4 items-start">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDecrease}
              className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600"
            >
              <Minus size={16}/>
            </button>
            
            <span className="font-semibold w-4 text-center font-brand">{item.cantidad}</span>
            
            <button 
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600"
            >
              <Plus size={16}/>
            </button>
          </div>
          
          <button 
            onClick={() => onRemove(productId)}
            className="text-[#ff6b6b] font-bold text-sm hover:text-red-700 transition-colors mt-1 font-brand"
          >
            Eliminar
          </button>
        </div>

      </div>
    </div>
  );
}