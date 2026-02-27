import { useMemo, useState } from "react";
import { ChevronLeft, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";

const getProductSize = (product) => product?.tamaño ?? product?.tamano ?? "";

export default function UpdateProductPanel() {
  const navigate = useNavigate();
  const { products, loading, updateProduct } = useProducts();

  const [modal, setModal] = useState({ open: false, product: null });
  const [form, setForm] = useState({
    nombre: "",
    sabor: "",
    precio: "",
    tamaño: "",
    imagen: "",
    descripcion: "",
  });
  const [saving, setSaving] = useState(false);

  const activeProducts = useMemo(
    () => products.filter((product) => product.estado === "activo"),
    [products]
  );

  const openModal = (product) => {
    setModal({ open: true, product });
    setForm({
      nombre: product.nombre ?? "",
      sabor: product.sabor ?? "",
      precio: product.precio ?? "",
      tamaño: getProductSize(product),
      imagen: product.imagen ?? "",
      descripcion: product.descripcion ?? "",
    });
  };

  const closeModal = () => {
    if (saving) return;
    setModal({ open: false, product: null });
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        typeof reader.result === "string"
          ? resolve(reader.result)
          : reject(new Error("No se pudo leer la imagen."));
      reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
      reader.readAsDataURL(file);
    });

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Archivo de imagen no válido."));
      image.src = src;
    });

  const compressImageToDataUrl = async (file) => {
    // 1) Leer archivo local como data URL
    const source = await fileToDataUrl(file);
    // 2) Cargar imagen para conocer dimensiones reales
    const image = await loadImage(source);

    // 3) Redimensionar si supera el límite
    const maxSize = 1200;
    const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) throw new Error("No se pudo procesar la imagen.");

    // 4) Convertir a WebP comprimido para enviar menos peso al backend
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/webp", 0.75);
  };

  const onImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressedImage = await compressImageToDataUrl(file);
      setForm((prev) => ({ ...prev, imagen: compressedImage }));
    } catch {
      toast.error("No se pudo procesar la imagen seleccionada.");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!modal.product) return;

    setSaving(true);
    const productId = Number(modal.product.idproducto);

    const response = await updateProduct(productId, {
      nombre: form.nombre.trim(),
      sabor: form.sabor.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      tamaño: form.tamaño.trim(),
      imagen: form.imagen.trim(),
    });

    setSaving(false);

    if (!response.success) {
      toast.error("No se pudo actualizar el producto.");
      return;
    }

    toast.success("Producto actualizado correctamente.");
    closeModal();
  };

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f2ec] font-brand relative">
      <Navbar />

      <button
        className="absolute left-6 top-24 flex items-center gap-2 text-brand-brownDark hover:text-brand-brown hover:underline transition-colors z-20 cursor-pointer"
        onClick={() => navigate("/admin-panel")}
      >
        <ChevronLeft size={28} />
        <span className="font-semibold text-lg">Volver</span>
      </button>

      <div className="max-w-svw mx-auto py-10 pt-20 font-brand text-sm">
        <h2 className="text-center text-4xl md:text-5xl font-semibold text-brand-brownDark mb-8 border-b border-[#664C3E44] pb-4">
          Actualizar un producto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-4xl px-4">
          {activeProducts.map((product) => (
            <div key={product.idproducto} className="relative">
              <Link to={`/product/${product.idproducto}`} className="block">
                <ProductCard product={product} />
              </Link>
              <button
                type="button"
                onClick={() => openModal(product)}
                className="absolute z-10 top-2 right-2 bg-gray-200 hover:bg-brand-brownDark hover:text-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors"
                title="Editar producto"
              >
                <Pencil size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {modal.open && modal.product && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#00000050]"
            onClick={closeModal}
          />

          <div className="relative z-50 bg-[#f4f0ea] rounded-md shadow-xl w-full max-w-4xl overflow-hidden">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-2 text-brand-brownDark hover:text-brand-brown text-2xl"
            >
              ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <img
                src={form.imagen || modal.product.imagen}
                alt={form.nombre || modal.product.nombre}
                className="w-full h-full min-h-[280px] object-cover border-r border-[#4aa3ff]"
              />

              <form onSubmit={onSubmit} className="p-6 md:p-8 text-brand-brownDark">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <label className="text-xs">
                    <span className="block mb-1">Nombre</span>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={onInputChange}
                      className="w-full bg-[#ebe4d8] px-2 py-1 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="text-xs">
                    <span className="block mb-1">Sabor</span>
                    <input
                      name="sabor"
                      value={form.sabor}
                      onChange={onInputChange}
                      className="w-full bg-[#ebe4d8] px-2 py-1 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="text-xs">
                    <span className="block mb-1">Precio</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="precio"
                      value={form.precio}
                      onChange={onInputChange}
                      className="w-full bg-[#ebe4d8] px-2 py-1 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="text-xs">
                    <span className="block mb-1">Tamaño</span>
                    <input
                      name="tamaño"
                      value={form.tamaño}
                      onChange={onInputChange}
                      className="w-full bg-[#ebe4d8] px-2 py-1 text-sm focus:outline-none"
                      required
                    />
                  </label>
                </div>

                <div className="mb-3">
                  <span className="block mb-1 text-xs">Imagen</span>
                  <label className="inline-flex cursor-pointer items-center justify-center px-4 py-1.5 border border-brand-brown text-brand-brown rounded text-xs font-semibold hover:bg-white transition-colors">
                    Subir desde mi PC
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Se reemplaza la imagen actual al seleccionar un archivo.
                  </p>
                </div>

                <label className="text-xs block mb-6">
                  <span className="block mb-1">Descripción</span>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={onInputChange}
                    rows={4}
                    className="w-full bg-[#ebe4d8] px-2 py-1 text-sm resize-none focus:outline-none"
                    required
                  />
                </label>

                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-white border border-brand-brownDark text-brand-brownDark px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors"
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-brownDark text-white px-6 py-2 rounded font-semibold hover:bg-brand-brown transition-colors disabled:opacity-70"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
