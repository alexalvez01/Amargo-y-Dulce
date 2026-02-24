import { Link } from "react-router-dom";

export default function ProductCard({ id, image, name, description, price, size }) {
  return (
    <Link 
      to={`/product/${id}`} 
      className=" bg-brand-beige rounded-[30px] overflow-hidden shadow-lg font-brand hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col"
    >

      <div className="h-64 overflow-hidden shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
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