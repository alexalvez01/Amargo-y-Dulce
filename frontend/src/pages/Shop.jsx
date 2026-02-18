import ProductCard from "../components/ProductCard"
import { useProducts } from "../context/ProductContext";

export default function Shop() {
  const { products, loading } = useProducts();

  if (loading) return <p>Cargando productos...</p>;

  if (!Array.isArray(products)) return <p>No hay productos</p>;


  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
  );
}