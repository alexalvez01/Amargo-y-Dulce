import { Link } from "react-router-dom";

export default function ProductCard({ id, image, name, description, price, size }) {
  return (
    <Link 
      to={`/product/${id}`} 
      // 1. CAMBIO AQUÍ: Agregamos 'h-full flex flex-col'
      // h-full: Fuerza a la tarjeta a ocupar toda la altura de la fila.
      // flex flex-col: Organiza el contenido en columna vertical.
      className="block bg-brand-beige rounded-[30px] overflow-hidden shadow-lg font-brand hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col"
    >
      
      {/* Imagen (sin cambios, pero le ponemos shrink-0 para que no se aplaste nunca) */}
      <div className="h-64 overflow-hidden shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. CAMBIO AQUÍ: Agregamos 'flex flex-col flex-grow' */}
      {/* flex-grow: Hace que este div ocupe todo el espacio disponible, empujando los bordes. */}
      <div className="p-8 text-brand-brown flex flex-col flex-grow">
        
        <h3 className="text-2xl font-bold mb-4">{name}</h3>
        
        <p className="text-sm text-brand-brownDark mb-6 leading-relaxed">
          {description}
        </p>
        
        {/* 3. CAMBIO AQUÍ: Agregamos 'mt-auto' */}
        {/* mt-auto (margin-top: auto): En un contenedor flex, esto empuja el elemento
            lo más abajo posible. */}
        <div className="flex items-center justify-between font-bold mt-auto">
          <span className="text-xl">$ {price}</span>
          <span className="text-sm uppercase tracking-wider">Tamaño: {size}</span>
        </div>

      </div>
    </Link>
  );
}