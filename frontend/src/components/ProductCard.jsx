import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">

      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 space-y-2">

        
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">
            {product.name}
          </h3>
          <span className="text-xs text-green-600">
            En stock
          </span>
        </div>

       
        <p className="text-sm font-medium">
          ${product.price}
        </p>

        
        <p className="text-xs text-gray-500">
          Tamaño: {product.size}
        </p>

    

      </div>
    </div>
  );
}
