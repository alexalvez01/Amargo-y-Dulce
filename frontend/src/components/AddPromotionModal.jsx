import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { X, ChevronDown } from "lucide-react";
import { createPromotionRequest } from "../api/promotions";
import { getProductsRequest } from "../api/products";

const initialForm = {
    nombre: "",
    descripcion: "",
    valor: "",
    fechaInicio: "",
    fechaFin: "",
};

export default function AddPromotionModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState(initialForm);
    const [productos, setProductos] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [overwriteAlert, setOverwriteAlert] = useState({ show: false, productos: [] });

    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchProducts = async () => {
            try {
                const res = await getProductsRequest();
                const activos = res.data.filter((p) => p.estado === "activo");
                setProductos(activos);
            } catch (error) {
                toast.error("No se pudieron cargar los productos.");
            }
        };
        fetchProducts();
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (idProducto) => {
        setSelectedProducts((prev) =>
            prev.includes(idProducto)
                ? prev.filter((id) => id !== idProducto)
                : [...prev, idProducto]
        );
    };

    const submitPromo = async (isOverwrite = false) => {
        try {
            setLoading(true);
            await createPromotionRequest({
                ...formData,
                valor: Number(formData.valor),
                productosIds: selectedProducts,
                overwrite: isOverwrite // Pasamos la bandera al backend
            });
            
            toast.success("¡Promoción creada con éxito!");
            setFormData(initialForm);
            setSelectedProducts([]);
            setOverwriteAlert({ show: false, productos: [] });
            onClose(); 

        } catch (error) {
            // Si el backend nos frena con el 409, mostramos el cartelito
            if (error.response?.status === 409) {
                setOverwriteAlert({ 
                    show: true, 
                    productos: error.response.data.productosAfectados 
                });
            } else {
                toast.error(error.response?.data?.error || "Hubo un error al crear la promoción");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.valor <= 0 || formData.valor > 100) return toast.error("El descuento debe estar entre 1 y 100%");
        if (new Date(formData.fechaInicio) > new Date(formData.fechaFin)) return toast.error("Fecha de inicio mayor a fin");
        if (selectedProducts.length === 0) return toast.error("Seleccioná un producto");

        // Arrancamos asumiendo que no queremos sobreescribir nada
        submitPromo(false);
    };

    if (!isOpen) return null;

    const inputStyles =
        "w-full bg-[#f8f5f1] text-[#4a3b32] px-3 py-2.5 rounded-md outline-none focus:ring-1 focus:ring-brand-brown transition-all text-sm";
    const labelStyles = "block text-[13px] font-semibold text-[#4a3b32] mb-1.5";

    return (
        <>
            {/* MODAL PRINCIPAL */}
            <div className="fixed inset-0 bg-black/40 z-100 flex items-center justify-center p-4 backdrop-blur-sm font-brand">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 rounded-full p-1"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#6B4C3A] text-center mb-6">
                        Añadir una promocion
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={labelStyles}>Nombre *</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="San Valentin"
                                className={inputStyles}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelStyles}>Descripción *</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Escriba la descripcion de la promoción."
                                rows="2"
                                className={`${inputStyles} resize-none`}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelStyles}>Valor *</label>
                                <input
                                    type="number"
                                    name="valor"
                                    value={formData.valor}
                                    onChange={handleChange}
                                    placeholder="10%"
                                    min="1"
                                    max="100"
                                    className={inputStyles}
                                    required
                                />
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <label className={labelStyles}>Producto *</label>
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`${inputStyles} cursor-pointer flex justify-between items-center`}
                                >
                                    <span
                                        className={
                                            selectedProducts.length === 0
                                                ? "text-gray-500 truncate"
                                                : "text-[#4a3b32] truncate"
                                        }
                                    >
                                        {selectedProducts.length === 0
                                            ? "Seleccionar"
                                            : `${selectedProducts.length} seleccionados`}
                                    </span>
                                    <ChevronDown size={16} className="text-[#6b4c3a] shrink-0" />
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-36 overflow-y-auto">
                                        {productos.map((prod) => (
                                            <label
                                                key={prod.idproducto}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-[#f8f5f1] cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(prod.idproducto)}
                                                    onChange={() => handleCheckboxChange(prod.idproducto)}
                                                    className="w-4 h-4 accent-[#6b4c3a]"
                                                />
                                                <span className="text-[13px] text-[#4a3b32]">
                                                    {prod.nombre} ({prod.tamano || prod.tamaño})
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelStyles}>Fecha de Inicio *</label>
                                <input
                                    type="date"
                                    name="fechaInicio"
                                    value={formData.fechaInicio}
                                    onChange={handleChange}
                                    className={inputStyles}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelStyles}>Fecha de Fin *</label>
                                <input
                                    type="date"
                                    name="fechaFin"
                                    value={formData.fechaFin}
                                    onChange={handleChange}
                                    className={inputStyles}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#6B4C3A] text-white font-semibold py-2.5 px-10 rounded-lg hover:bg-[#543b2d] transition-colors disabled:opacity-70 text-sm tracking-wide shadow-sm"
                            >
                                {loading ? "Confirmando..." : "Confirmar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL DE ADVERTENCIA DE SOBREESCRITURA */}
            {overwriteAlert.show && (
                <div className="fixed inset-0 bg-black/50 z-110 flex items-center justify-center p-4 backdrop-blur-sm font-brand">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden text-center animate-fade-in-up pb-10 pt-12 px-6">
                        
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#6b4c3a]"></div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-[#6b4c3a] mb-4">
                            ¡Atención! Promoción superpuesta
                        </h3>
                        
                        <p className="text-gray-500 text-sm mb-4 px-4">
                            Los siguientes productos seleccionados ya tienen una promoción activa:
                        </p>
                        
                        <div className="bg-[#fcf8f5] p-3 rounded-lg mx-4 mb-6 text-sm text-[#6b4c3a] font-semibold text-left max-h-32 overflow-y-auto">
                            <ul className="list-disc list-inside">
                                {overwriteAlert.productos.map((prod, idx) => (
                                    <li key={idx}>{prod}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-8 px-4 font-semibold">
                            Si confirmás, se va a sobreescribir dejando el descuento de la nueva promoción solo en los productos que coinciden.
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => submitPromo(true)} 
                                disabled={loading}
                                className="px-6 py-2.5 bg-[#6b4c3a] text-white rounded-lg font-semibold hover:bg-[#543b2d] transition-colors disabled:opacity-50"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={() => setOverwriteAlert({ show: false, productos: [] })}
                                disabled={loading}
                                className="px-6 py-2.5 bg-white text-[#6b4c3a] border border-[#6b4c3a] rounded-lg font-semibold hover:bg-[#fcf8f5] transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}