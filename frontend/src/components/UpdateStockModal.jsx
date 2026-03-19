import { useEffect, useState, useRef, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
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

export default function UpdateStockModal({ isOpen, onClose, product }) {
  const { products, updateProductStock, loading } = useProducts();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [stock, setStock] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const today = useMemo(() => formatDate(Date.now()), []);

  useEffect(() => {
    if (isOpen && product) {
      setSelectedProductId(String(product.idproducto));
      setStock("");
    } else if (isOpen && !product) {
      setSelectedProductId("");
      setStock("");
    }
  }, [isOpen, product]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  const activeProducts = products.filter((p) => p.estado === "activo");

  const currentSelectedProduct = activeProducts.find(
    (p) => String(p.idproducto) === String(selectedProductId)
  );

  const onSubmit = async (event) => {
    event.preventDefault();

    const stockNumber = Number(stock);
    if (!selectedProductId) {
      toast.error("Selecciona un producto.");
      return;
    }
    if (!Number.isFinite(stockNumber) || stockNumber < 0) {
      toast.error("Ingresa un stock válido.");
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
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-100 flex items-center justify-center p-4 backdrop-blur-sm font-brand">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-brand-brownDark mb-6 pr-8">
          Actualizar Stock
        </h2>

        {loading && !products.length ? (
          <p className="text-brand-brownDark text-center mb-4">Cargando productos...</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="block">
              <span className="block text-sm font-medium text-brand-brownDark mb-1">Producto *</span>

              {product ? (
                <div className="w-full bg-[#f3f4f6] rounded px-3 py-2 text-sm text-[#6e6e6e] cursor-not-allowed border border-gray-200">
                  {product.nombre} - {getProductSize(product) || "Sin tamaño"}
                  {" "} (Stock actual: {product.stock})
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="w-full bg-[#ebe4d8] border border-[#d6cdbf] rounded px-3 py-2 text-sm text-left text-brand-brownDark focus:outline-none focus:ring-2 focus:ring-brand-gold flex items-center justify-between"
                  >
                    <span>
                      {currentSelectedProduct
                        ? `${currentSelectedProduct.nombre} - ${getProductSize(currentSelectedProduct) || "Sin tamaño"} (Stock actual: ${currentSelectedProduct.stock})`
                        : "Seleccione un producto"}
                    </span>
                    <ChevronDown size={16} className="shrink-0 text-brand-brown" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#ebe4d8] border border-[#d6cdbf] rounded shadow-lg max-h-60 overflow-y-auto">
                      {activeProducts.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">No hay productos activos</div>
                      ) : (
                        activeProducts.map((p) => (
                          <button
                            key={p.idproducto}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedProductId(String(p.idproducto));
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-brand-brownDark hover:bg-[#dfd4c2] transition-colors"
                          >
                            {p.nombre} - {getProductSize(p) || "Sin tamaño"} <span className="text-xs text-brand-brown opacity-80">(Stock: {p.stock})</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-brand-brownDark mb-1">Stock a ingresar *</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="Ej. 100"
                  className="w-full bg-white border border-[#d6cdbf] rounded px-3 py-2 text-sm text-brand-brownDark focus:outline-none focus:ring-2 focus:ring-brand-gold placeholder-gray-400"
                  required
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-brand-brownDark mb-1">Fecha de actualización *</span>
                <input
                  type="text"
                  value={today}
                  readOnly
                  className="w-full bg-[#f3f4f6] border border-gray-200 rounded px-3 py-2 text-sm text-[#6e6e6e] cursor-not-allowed focus:outline-none"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={saving || !selectedProductId}
                className="bg-[#6B4C3A] text-white font-semibold flex items-center justify-center py-2.5 px-12 rounded-lg hover:bg-[#543b2d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto min-w-[150px]"
              >
                {saving ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
