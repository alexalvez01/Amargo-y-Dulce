import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { useProducts } from "../context/ProductContext";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export default function Shop() {
  const { products, loading } = useProducts();
  const [visible, setVisible] = useState(6);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const filteredProducts = useMemo(() => {
  let filtered = [...products];

  if (search) {
    filtered = filtered.filter((product) =>
      product.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (selectedCollection) {
    filtered = filtered.filter(
      (product) => product.sabor.toLowerCase() === selectedCollection.toLowerCase()
    );
  }

  if (selectedSize) {
    filtered = filtered.filter(
      (product) => product.tamaño === selectedSize
    );
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.precio - b.precio);
  }

  if (sort === "price-desc") {
    filtered.sort((a, b) => b.precio - a.precio);
  }

  if (sort === "name-asc") {
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  if (sort === "name-desc") {
    filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  return filtered;
}, [products, search, sort, selectedCollection, selectedSize]);



  return (
  <div className="bg-gray-200 min-h-screen">
    <Navbar />

    <div className="max-w-6xl mx-auto px-6 py-10 pt-20 font-brand text-sm">

      {/* Buscador y ordenar */}
      <div className="flex flex-col md:flex-row justify-end items-center mb-10 border-b border-gray-300 pb-6 gap-40">

        <div className="flex min-w-md md:w-1/3">
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisible(6);
            }}
            className="w-full px-5 py-2 bg-white rounded-l-md focus:outline-none"
          />

          <button className="px-6 bg-brand-brown text-white rounded-r-3xl hover:bg-brand-brownDark transition">
            <Search size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-brand-brown font-bold">Ordenar por</span>

              <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-200 focus:outline-none focus:border-none appearance-none focus:ring-0 cursor-pointer px-2 py-1 rounded"
              >
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              </select>
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR */}
        <div className="lg:w-64 bg-white p-6 rounded-xl shadow-sm h-fit text-left">

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-brand-brown">
              Filtrar por Colección
            </h3>

            {["Colección Clásica", "Fusión Moderna", "Esencia Argentina", "Delicias Tropicales", "Selección Gourmet", "Tentación Intensa"].map((col) => (
              <label key={col} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="collection"
                  value={col}
                  checked={selectedCollection === col}
                  onChange={() => {
                    setSelectedCollection(col);
                    setVisible(6);
                    }}
                    className="accent-brand-brown"
                  />
                  <span className={selectedCollection === col ? 'font-semibold text-brand-brown' : ''}>{col}</span>
                  </label>
                ))}

                <button
                  onClick={() => setSelectedCollection("")}
                  className="text-xs text-gray-500 mt-2"
                >
                  Limpiar
                </button>
                </div>

          <div>
            <h3 className="font-semibold mb-3 text-brand-brown">
              Filtrar por Tamaño
            </h3>

                {["6", "12", "24"].map((size) => (
                  <label key={size} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={selectedSize === size}
                    onChange={() => {
                    setSelectedSize(size);
                    setVisible(6);
                    }}
                    className="accent-brand-brown"
                  />
                  <span className={selectedSize === size ? 'font-semibold text-brand-brown' : ''}>{size} Unidades</span>
                  </label>
                ))}

                <button
                  onClick={() => setSelectedSize("")}
                  className="text-xs text-gray-500 mt-2"
                >
                  Limpiar
                </button>
                </div>
              </div>

              {/* PRODUCTOS */}
        <div className="flex-1">

          {loading ? (
            <p className="text-center text-brand-brown">
              Cargando productos...
            </p>
          ) : (
            <>
              {filteredProducts.length === 0 && (
                <p className="text-gray-500">
                  No se encontraron productos.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.slice(0, visible).map((product) => (
                  <ProductCard key={product.idproducto} product={product} />
                ))}
              </div>

              {visible < filteredProducts.length && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisible((prev) => prev + 6)}
                    className="px-6 py-3 bg-brand-brown text-white rounded-lg hover:bg-brand-brownDark transition"
                  >
                    Ver más
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  </div>
);
}
