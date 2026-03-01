import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useProducts } from "../context/ProductContext";
import { usePromotions } from "../context/PromotionContext";
import { useState, useMemo, useEffect } from "react";
import { Import, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading: loadingProducts } = useProducts();
  const { promotions, getPromotions } = usePromotions();
  const [visible, setVisible] = useState(6);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [selectedPromotion, setSelectedPromotion] = useState("");

  useEffect(() => {
    if (getPromotions) {
      getPromotions();
    }
  }, []);

  useEffect(() => {
    if (location.state?.promoActiva) {
      setSelectedPromotion(location.state.promoActiva);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((product) =>
        product.nombre.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (selectedCollection) {
      filtered = filtered.filter(
        (product) =>
          product.sabor.toLowerCase() === selectedCollection.toLowerCase(),
      );
    }
    
    if (selectedSize) {
      filtered = filtered.filter((product) => product.tamaño === selectedSize);
    }

    if (selectedPromotion && promotions) {
      const promoInfo = promotions.find(p => String(p.idpromocion) === String(selectedPromotion));
      
      if (promoInfo && promoInfo.productos) {
        const promoProductIds = promoInfo.productos.map(p => p.idproducto);
        filtered = filtered.filter(product => promoProductIds.includes(product.idproducto));
      } else {
        filtered = [];
      }
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
  }, [products, search, sort, selectedCollection, selectedSize, selectedPromotion, promotions]);

  return (
    <div className="bg-[#f7f2ec] min-h-screen">
      <Navbar />

      <main className="min-h-screen">
        <div className="max-w-svw mx-auto py-10 pt-20 font-brand text-sm">
          {/* Buscador y ordenar */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 border-b border-[#664C3E44] pb-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
            {/* Buscador */}
            <div className="flex w-full max-w-md">
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

              <button className="px-6 bg-brand-brown text-white rounded-r-4xl hover:bg-brand-brownDark transition">
                <Search size={18} />
              </button>
            </div>

            {/* Ordenar */}
            <div className="flex items-center gap-3">
              <span className="text-brand-brown font-bold font-brand">Ordenar por:</span>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="
                  appearance-none bg-[#fcf8f5] text-brand-brownDark font-brand border border-[#d4c3b3] 
                  rounded-lg py-2 pl-4 pr-12 cursor-pointer outline-none shadow-sm hover:border-brand-brown 
                  focus:ring-2 focus:ring-[#968373]/50 transition-all bg-no-repeat
                "
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234A3024' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="">Seleccionar</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="name-asc">Nombre A-Z</option>
                <option value="name-desc">Nombre Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout principal */}
        <div className="flex flex-col 2xl:flex-row max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 gap-8">
          
          {/* SIDEBAR */}
          <div className="w-full max-w-2xl 2xl:w-64 mx-auto bg-white p-6 rounded-xl shadow-sm h-fit text-center 2xl:text-start flex flex-row justify-center 2xl:flex-col flex-wrap gap-4 mb-8 2xl:mb-0 ">
            
            {/* NUEVO: FILTRO POR PROMOCIONES ACTIVAS */}
            {promotions && promotions.length > 0 && (
              <div className="mb-6 w-full md:w-auto">
                <h3 className="font-semibold mb-3 text-brand-brown text-center 2xl:text-left">
                  Promociones Especiales
                </h3>
                {promotions.map((promo) => (
                  <label
                    key={promo.idpromocion}
                    className="flex justify-center 2xl:items-center 2xl:justify-normal gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="promotion"
                      value={promo.idpromocion}
                      checked={String(selectedPromotion) === String(promo.idpromocion)}
                      onChange={() => {
                        setSelectedPromotion(promo.idpromocion);
                        setVisible(6);
                      }}
                      className="accent-brand-brown"
                    />
                    <span
                      className={
                        String(selectedPromotion) === String(promo.idpromocion)
                          ? "font-semibold text-brand-brown"
                          : ""
                      }
                    >
                      {promo.nombre}
                    </span>
                  </label>
                ))}
                <div className="flex justify-center 2xl:justify-start">
                  <button
                    onClick={() => setSelectedPromotion("")}
                    className="text-xs text-gray-500 mt-2 hover:text-brand-brown"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}

            {/* Colecciones */}
            <div className="mb-6 w-full md:w-auto">
              <h3 className="font-semibold mb-3 text-brand-brown">
                Filtrar por Colección
              </h3>
              {[
                "Colección Clásica",
                "Fusión Moderna",
                "Esencia Argentina",
                "Delicias Tropicales",
                "Selección Gourmet",
                "Tentación Intensa",
              ].map((col) => (
                <label
                  key={col}
                  className="flex justify-center 2xl:items-center 2xl:justify-normal gap-2 mb-2 cursor-pointer"
                >
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
                  <span
                    className={
                      selectedCollection === col
                        ? "font-semibold text-brand-brown"
                        : ""
                    }
                  >
                    {col}
                  </span>
                </label>
              ))}
              <div className="flex justify-center 2xl:justify-start">
                <button onClick={() => setSelectedCollection("")} className="text-xs text-gray-500 mt-2 hover:text-brand-brown">Limpiar</button>
              </div>
            </div>

            {/* Tamaños */}
            <div className="w-full md:w-auto">
              <h3 className="font-semibold mb-3 text-brand-brown">
                Filtrar por Tamaño
              </h3>
              {["6", "12", "24"].map((size) => (
                <label
                  key={size}
                  className="flex justify-center 2xl:items-center 2xl:justify-normal gap-2 mb-2 cursor-pointer"
                >
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
                  <span
                    className={
                      selectedSize === size
                        ? "font-semibold text-brand-brown"
                        : ""
                    }
                  >
                    {size} Unidades
                  </span>
                </label>
              ))}
              <div className="flex justify-center 2xl:justify-start">
                <button onClick={() => setSelectedSize("")} className="text-xs text-gray-500 mt-2 hover:text-brand-brown">Limpiar</button>
              </div>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div className="flex-1">
            {loadingProducts ? (
              <p className="text-center text-brand-brown">
                Cargando productos...
              </p>
            ) : (
              <>
                {filteredProducts.length === 0 && (
                  <p className="text-gray-500 text-center mt-10 text-lg">No se encontraron productos con estos filtros.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
                  {filteredProducts.filter(p => p.estado === "activo").slice(0, visible).map((product) => (
                    <Link to={`/product/${product.idproducto}`} key={product.idproducto}>
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>

                {visible < filteredProducts.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setVisible((prev) => prev + 6)}
                      className="px-6 py-3 bg-brand-brown text-white rounded-lg hover:bg-brand-brownDark transition shadow-md"
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
      </main>
      <Footer />
    </div>
  );
}