import { useState, useEffect } from "react";
import PopularCard from "./PopularCard";

export default function PopularProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        // CAMBIO AQUÍ: Llamamos al nuevo endpoint específico
        const response = await fetch("http://localhost:3000/api/products/top-sales");
        
        if (response.ok) {
           const data = await response.json();
           setProducts(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <section className="h-screen py-20 bg-brand-brownDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-brand-beige mb-16 font-brand">
          Productos Populares
        </h2>

        {products.length === 0 ? (
          <p className="text-brand-beige text-center">Cargando best sellers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Ya no necesitamos .slice ni .filter, el backend hace el trabajo duro */}
            {products.map((product) => (
              <PopularCard
                key={product.idproducto}
                id={product.idproducto}
                name={product.nombre}
                description={product.descripcion}
                size={product.tamaño}
                price={product.precio}
                image={product.imagen || "/images/coleccion-clasica.webp"} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}