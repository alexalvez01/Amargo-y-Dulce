import { useState } from "react";
import toast from "react-hot-toast";
import { X, Image as ImageIcon } from "lucide-react";
import { createProductRequest } from "../api/products";

const initialForm = {
  nombre: "",
  descripcion: "",
  sabor: "", 
  stock: "",
  tamano: "6",
  precio: "",
};

export default function AddProductModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null); 
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Error"));
      reader.onerror = () => reject(new Error("Error al leer archivo"));
      reader.readAsDataURL(file);
    });

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Imagen no válida"));
      image.src = src;
    });

  const compressImageToDataUrl = async (file) => {
    const source = await fileToDataUrl(file);
    const image = await loadImage(source);

    const maxSize = 1200;
    const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) throw new Error("No se pudo procesar");

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/webp", 0.75);
  };
  // -------------------------------------------------------------

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      return;
    }

    try {
      const compressedImage = await compressImageToDataUrl(file);
      setImageFile(compressedImage);
    } catch (error) {
      toast.error("No se pudo procesar la imagen seleccionada.");
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      return toast.error("Por favor, seleccioná una imagen para el producto.");
    }

    try {
      setLoading(true);
      
      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        sabor: formData.sabor,
        stock: Number(formData.stock),
        precio: Number(formData.precio),
        tamaño: formData.tamano, 
        estado: "activo", 
        imagen: imageFile 
      };
      
      await createProductRequest(productData);
      
      toast.success("¡Producto creado con éxito!");
      
      setFormData(initialForm);
      setImageFile(null);
      onClose();
      
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Hubo un error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-[#FAF7F2] text-[#4a3b32] px-3 py-2.5 rounded-md outline-none focus:ring-1 focus:ring-brand-brown transition-all text-sm border border-transparent";
  const labelStyles = "block text-[13px] font-semibold text-[#4a3b32] mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/40 z-100 flex items-center justify-center p-4 backdrop-blur-sm font-brand">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 rounded-full p-1">
          <X size={20} />
        </button>

        <h2 className="text-3xl font-extrabold text-[#6B4C3A] text-center mb-6">
          Añadir un producto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelStyles}>Nombre *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Bombon 3" className={inputStyles} required />
          </div>

          <div>
            <label className={labelStyles}>Descripción *</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Escriba la descripcion del producto" rows="3" className={`${inputStyles} resize-none`} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Sabor *</label>
              <input 
                type="text" 
                name="sabor" 
                value={formData.sabor} 
                onChange={handleChange} 
                placeholder="Ej: Dulce de leche" 
                className={inputStyles} 
                required 
              />
            </div>
            
            <div>
              <label className={labelStyles}>Stock *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="100" min="0" className={inputStyles} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Tamaño (unidades) *</label>
              <select 
                name="tamano" 
                value={formData.tamano} 
                onChange={handleChange} 
                className={`${inputStyles} cursor-pointer`}
                required
              >
                <option value="6">6 unidades</option>
                <option value="12">12 unidades</option>
                <option value="24">24 unidades</option>
              </select>
            </div>

            <div>
              <label className={labelStyles}>Precio *</label>
              <input type="number" name="precio" value={formData.precio} onChange={handleChange} placeholder="12000" min="1" className={inputStyles} required />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-[72px] h-[72px] bg-[#E8EAEF] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {imageFile ? (
                <img src={imageFile} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={30} className="text-gray-400 opacity-60" />
              )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#4a3b32] mb-2">
                Cargar la imagen
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border file:border-[#6B4C3A] file:text-[13px] file:font-semibold file:bg-white file:text-[#6B4C3A] hover:file:bg-[#fcf8f5] cursor-pointer transition-colors" required />
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            <button type="submit" disabled={loading} className="bg-[#6B4C3A] text-white font-semibold py-2.5 px-12 rounded-lg hover:bg-[#543b2d] transition-colors disabled:opacity-70 text-sm tracking-wide shadow-sm">
              {loading ? "Confirmando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}