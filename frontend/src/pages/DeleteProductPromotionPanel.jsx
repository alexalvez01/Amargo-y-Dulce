import ProductCard from "../components/ProductCard";
import PromotionCard from "../components/PromotionCard";
import { useProducts } from "../context/ProductContext";
import { usePromotions } from "../context/PromotionContext";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function DeleteProductPromotionPanel() {
  const { products, loading: loadingProducts, hideProduct} = useProducts();
  const { promotions, loading: loadingPromotions, hidePromotion} = usePromotions();
  const [modal, setModal] = useState({ open: false, type: null, item: null });
  const [entityFilter, setEntityFilter] = useState("all");
  const navigate = useNavigate();

  const loading = loadingProducts || loadingPromotions;
  const showProducts = entityFilter === "all" || entityFilter === "products";
  const showPromotions = entityFilter === "all" || entityFilter === "promotions";



  // Modal confirm handlers
  const openModal = (type, item) => setModal({ open: true, type, item });
  const closeModal = () => setModal({ open: false, type: null, item: null });
  const confirmHide = async () => {
    if (modal.type === "product") {
      await hideProduct(modal.item.idproducto);
    } else if (modal.type === "promotion") {
      await hidePromotion(modal.item.idpromocion);
    }
    closeModal();
  };
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }


  if (loading) return <div className="text-center py-10">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-brand relative">
      <Navbar />
      <main className="min-h-screen">
      {/* Flecha para volver */}
      <button
        className="absolute left-6 top-24 flex items-center gap-2 text-brand-brownDark hover:text-brand-brown hover:underline transition-colors z-20 cursor-pointer "
        onClick={() => navigate("/admin-panel")}
      >
        <ChevronLeft size={28} />
        <span className="font-semibold text-lg">Volver</span>
      </button>
      <div className="max-w-svw mx-auto py-10 pt-20 font-brand text-sm">
        <h2 className="text-center text-4xl md:text-5xl font-semibold text-brand-brownDark mb-8 border-b border-[#664C3E44] pb-4">
          Dar de baja un producto o promoción
        </h2>

        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="flex items-center justify-end gap-3">
            <span className="text-brand-brown font-bold">Mostrar:</span>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="appearance-none bg-[#fcf8f5] text-brand-brownDark border border-[#d4c3b3] rounded-lg py-2 pl-4 pr-12 cursor-pointer outline-none shadow-sm hover:border-brand-brown focus:ring-2 focus:ring-[#968373]/50 transition-all bg-no-repeat"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234A3024' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="all">Todos</option>
              <option value="products">Solo productos</option>
              <option value="promotions">Solo promociones</option>
            </select>
          </div>
        </div>

        {/* Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-4xl px-4">
          {showProducts && products.filter(p => p.estado === "activo").map((product) => (
            <div key={product.idproducto} className="relative">
              <Link to={`/product/${product.idproducto}`} key={product.idproducto}>
                <ProductCard product={product} />
              </Link>
              <button
                onClick={() => openModal("product", product)}
                className="absolute top-2 right-2 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors"
                title="Eliminar producto"
              >
                ×
              </button>
            </div>
          ))}
          {/* Promociones */}
          {showPromotions && promotions.filter(p => p.estado === "activo").map((promo) => (
            <div key={promo.idpromocion} className="relative">
              <PromotionCard promo={promo} />
              <button
                onClick={() => openModal("promotion", promo)}
                className="absolute top-2 right-2 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors"
                title="Eliminar promoción"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Modal de confirmación */}
      {modal.open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          
          <div className="absolute inset-0 bg-[#00000044] transition-opacity" onClick={closeModal}></div>
          <div className="relative z-50 bg-white rounded-xl shadow-xl p-8 min-w-[340px] max-w-[95vw] w-[500px] border-t-4 border-brand-brownDark">
            <h3 className="text-2xl font-semibold text-brand-brownDark mb-6 text-center">
              ¿Desea dar de baja el siguiente {modal.type === "product" ? "producto" : "promoción"}?
            </h3>
            <div className="flex items-center gap-4 mb-6">
              {modal.type === "product" ? (
                <>
                  <img src={modal.item.imagen} alt={modal.item.nombre} className="w-20 h-20 object-cover rounded-lg border" />
                  <div className="flex-1">
                    <div className="font-semibold text-brand-brownDark">{modal.item.nombre}</div>
                    <div className="italic text-gray-600 text-sm mb-1">Tamaño: {modal.item.tamaño}</div>
                  </div>
                  <div className="font-bold text-brand-brownDark text-lg ml-auto">
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(modal.item.precio)}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="font-semibold text-brand-brownDark">{modal.item.nombre}</div>
                    <div className="italic text-gray-600 text-sm mb-1">{modal.item.descripcion}</div>
                    <div className="text-xs text-gray-500 mb-1">Válido: {formatDate(modal.item.fechainicio)} - {formatDate(modal.item.fechafin)}</div>
                  </div>
                  <div className="font-bold text-brand-brownDark text-lg ml-auto">
                    {modal.item.valor}%
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-brand-brownDark text-white px-6 py-2 rounded font-semibold hover:bg-brand-brown transition-colors"
                onClick={confirmHide}
              >
                Confirmar
              </button>
              <button
                className="bg-white border border-brand-brownDark text-brand-brownDark px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
