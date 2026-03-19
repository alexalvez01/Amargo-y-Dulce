import { Link } from "react-router-dom";

export default function PopularCard({ id, image, name, description, price, size, estado }) {
  const isInactive = estado === 'inactivo';

  return (
    <Link 
      to={`/product/${id}`} 
      className="group bg-brand-beige rounded-[30px] overflow-hidden shadow-lg font-brand hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer h-full flex flex-col"
    >

      <div className="h-64 overflow-hidden shrink-0 relative">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isInactive ? 'opacity-60 grayscale' : 'group-hover:scale-110'}`}
        />
        {isInactive && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded uppercase z-10 shadow-md whitespace-nowrap">
            No disponible
          </span>
        )}
      </div>

      <div className="p-8 text-brand-brown flex flex-col grow">

        <h3 className="text-2xl font-bold mb-4">{name}</h3>

        <p className="text-sm text-brand-brownDark mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between font-bold mt-auto">
          <span className="text-xl">$ {price}</span>
          <span className="text-sm uppercase tracking-wider">Tamaño: {size}</span>
        </div>

      </div>
    </Link>
  );
}