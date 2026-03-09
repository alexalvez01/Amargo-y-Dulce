import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useProducts } from "../context/ProductContext";

const formatDate = (value) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getProductSize = (product) =>
  product?.tamano ?? product?.["tamaño"] ?? product?.["tama\u00f1o"] ?? product?.["tamaÃ±o"] ?? "";

export default function UpdateStockPanel() {
  const navigate = useNavigate();
  const { products, loading, updateProductStock } = useProducts();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [stock, setStock] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const today = useMemo(() => formatDate(Date.now()), []);
  const activeProducts = useMemo(
    () => products.filter((product) => product.estado === "activo"),
    [products]
  );
  const selectedProduct = useMemo(
    () => activeProducts.find((product) => String(product.idproducto) === String(selectedProductId)),
    [activeProducts, selectedProductId]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    const stockNumber = Number(stock);
    if (!selectedProductId) {
      toast.error("Selecciona un producto.");
      return;
    }
    if (!Number.isFinite(stockNumber) || stockNumber < 0) {
      toast.error("Ingresa un stock valido.");
      return;
    }

    setSaving(true);
    const response = await updateProductStock(Number(selectedProductId), stockNumber);
    setSaving(false);

    if (!response.success) {
      toast.error("No se pudo actualizar el stock.");
      return;
    }

    toast.success("Stock actualizado correctamente.");
    setStock("");
  };

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-brand">
      <Navbar />

      <main className="min-h-screen relative">
        <button
          className="absolute left-6 top-24 flex items-center gap-2 text-brand-brownDark hover:text-brand-brown hover:underline transition-colors z-20 cursor-pointer"
          onClick={() => navigate("/admin-panel")}
        >
          <ChevronLeft size={28} />
          <span className="font-semibold text-lg">Volver</span>
        </button>

        <div className="min-h-screen flex items-center justify-center px-4">
          <section className="w-full max-w-2xl bg-[#f7f7f7] rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-center text-5xl font-semibold text-brand-brownDark mb-10">
              Actualizar stock
            </h2>

            {loading ? (
              <p className="text-center text-brand-brownDark">Cargando productos...</p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="block">
                  <span className="block text-sm text-brand-brownDark mb-1">Producto *</span>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="w-full bg-[#ebe4d8] rounded px-3 py-2 text-sm text-left text-[#6e6e6e] focus:outline-none flex items-center justify-between"
                    >
                      <span>
                        {selectedProduct
                          ? `${selectedProduct.nombre} - ${getProductSize(selectedProduct) || "Sin tamano"}`
                          : "Seleccione un producto"}
                      </span>
                      <ChevronDown size={16} className="shrink-0" />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#ebe4d8] border border-[#d6cdbf] rounded shadow-lg max-h-60 overflow-y-auto">
                        {activeProducts.map((product) => (
                          <button
                            key={product.idproducto}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedProductId(String(product.idproducto));
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-brand-brownDark hover:bg-[#dfd4c2] transition-colors"
                          >
                            {product.nombre} - {getProductSize(product) || "Sin tamano"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm text-brand-brownDark mb-1">Stock ingresado *</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={stock}
                      onChange={(event) => setStock(event.target.value)}
                      placeholder="100"
                      className="w-full bg-[#ebe4d8] rounded px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="block text-sm text-brand-brownDark mb-1">Fecha de actualizacion *</span>
                    <input
                      type="text"
                      value={today}
                      readOnly
                      className="w-full bg-[#ebe4d8] rounded px-3 py-2 text-sm text-[#6e6e6e] focus:outline-none"
                    />
                  </label>
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-brand-brownDark text-white text-sm px-10 py-2 rounded font-semibold hover:bg-brand-brown transition-colors disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Confirmar"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
