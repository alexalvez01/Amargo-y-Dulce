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
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [selectedPromotion, setSelectedPromotion] = useState("");

  useEffect(() => {
    if (getPromotions) {
      getPromotions();
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const promoQuery = searchParams.get("promocion");

    if (location.state?.promoActiva) {
      setSelectedPromotion(location.state.promoActiva);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (promoQuery) {
      setSelectedPromotion(promoQuery);
      searchParams.delete("promocion");
      const newSearch = searchParams.toString();
      navigate(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { replace: true });
    }
  }, [location.state, location.pathname, location.search, navigate]);

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
  
  const activePromotions = promotions ? promotions.filter(promo => promo.estado === 'activo') : [];

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
            <div className="flex items-center gap-3 relative">
              <span className="text-brand-brown font-bold font-brand">Ordenar por:</span>

              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                  className="
                    flex items-center justify-between w-48 bg-[#fcf8f5] text-brand-brownDark font-brand border border-[#d4c3b3] 
                    rounded-lg py-2 px-4 cursor-pointer outline-none shadow-sm hover:border-brand-brown 
                    focus:ring-2 focus:ring-[#968373]/50 transition-all
                  "
                >
                  <span className="truncate">
                    {sort === "" ? "Seleccionar" : 
                     sort === "price-asc" ? "Menor precio" : 
                     sort === "price-desc" ? "Mayor precio" : 
                     sort === "name-asc" ? "Nombre A-Z" : 
                     "Nombre Z-A"}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-brand-brownDark transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown Menu Animado */}
                <div 
                  className={`
                    absolute top-full left-0 mt-2 w-full bg-white border border-[#d4c3b3] rounded-lg shadow-xl 
                    z-50 overflow-hidden transition-all duration-300 origin-top
                    ${isSortOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}
                  `}
                >
                  {[
                    { value: "", label: "Seleccionar" },
                    { value: "price-asc", label: "Menor precio" },
                    { value: "price-desc", label: "Mayor precio" },
                    { value: "name-asc", label: "Nombre A-Z" },
                    { value: "name-desc", label: "Nombre Z-A" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 hover:bg-[#f7f2ec] transition-colors font-brand
                        ${sort === option.value ? "text-brand-brown font-bold bg-[#fcf8f5]" : "text-gray-700"}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout principal */}
        <div className="flex flex-col 2xl:flex-row max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 gap-8">
          
          {/* SIDEBAR */}
          <div className="w-full max-w-2xl 2xl:w-64 mx-auto bg-white p-6 rounded-xl shadow-sm h-fit text-center 2xl:text-start flex flex-row justify-center 2xl:flex-col flex-wrap gap-4 mb-8 2xl:mb-0 ">
            
            {/* NUEVO: FILTRO POR PROMOCIONES ACTIVAS */}
            {activePromotions && activePromotions.length > 0 && (
              <div className="mb-6 w-full md:w-auto">
                <h3 className="font-semibold mb-3 text-brand-brown text-center 2xl:text-left">
                  Promociones Especiales
                </h3>
                {activePromotions.map((promo) => (
                  <label
                    key={promo.idpromocion}
                    className="flex justify-center 2xl:items-center 2xl:justify-normal gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-brand-beige/60 active:scale-95 transition-all duration-200"
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
                  className="flex justify-center 2xl:items-center 2xl:justify-normal gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-brand-beige/60 active:scale-95 transition-all duration-200"
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
                  className="flex justify-center 2xl:items-center 2xl:justify-normal gap-2 px-3 py-2 cursor-pointer rounded-lg hover:bg-brand-beige/60 active:scale-95 transition-all duration-200"
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
                  {filteredProducts.filter(p => p.estado === "activo").slice(0, visible).map((product, index) => (
                    <Link 
                      to={`/product/${product.idproducto}`} 
                      key={product.idproducto}
                      style={{ 
                        animation: `slideDownFade 0.5s ease-out forwards`,
                        animationDelay: `${index * 50}ms`,
                        opacity: 0 // Cascada
                      }}
                    >
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>

                {visible < filteredProducts.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setVisible((prev) => prev + 6)}
                      className="px-8 py-3 bg-[#6B4C3A] text-white font-bold rounded-xl shadow-md hover:shadow-xl hover:bg-[#543b2d] hover:-translate-y-1 active:scale-95 transition-all duration-300"
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