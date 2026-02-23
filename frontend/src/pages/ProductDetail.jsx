import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetail() {
  const { id } = useParams(); // Obtenemos el ID de la URL (ej: 1)
  
  // Estados para guardar los datos
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Para el contador de cantidad

  // 1. Buscamos la info del producto al Backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Funciones para aumentar/disminuir cantidad
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQty = () => setQuantity(quantity + 1);

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  if (!product) return <div className="text-center py-20">Producto no encontrado</div>;

  return (
    <div className="bg-[#fcf8f5] min-h-screen font-brand">
      <Navbar />

      {/* --- SECCIÓN PRINCIPAL (Fondo blanco centrado) --- */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-8">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-12">
          
          {/* COLUMNA IZQUIERDA: Imagen */}
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md">
              <img 
                src={product.imagen || "/images/producto-clasico.png"} 
                alt={product.nombre} 
                className="w-full h-full object-cover"
              />
              {/* Corazoncito de favorito en la esquina */}
              <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:text-red-500 transition">
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: Información */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            
            {/* Título */}
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-brand-brown">
                {product.nombre}
              </h1>
            </div>

            {/* Estrellas (Estáticas por ahora, luego las conectamos a las reseñas) */}
            <div className="flex gap-1 text-yellow-400 mb-4">
               {[1, 2, 3, 4, 5].map((star) => (
                 <Star key={star} size={20} fill="currentColor" className="text-yellow-400" />
               ))}
               <span className="text-gray-400 text-sm ml-2">(4.8)</span>
            </div>

            {/* Precio */}
            <p className="text-3xl font-bold text-black mb-2">
              $ {product.precio}
            </p>

            {/* Stock status */}
            <p className="text-green-600 font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              En Stock ({product.stock} disponibles)
            </p>

            {/* Selector de Cantidad */}
            <div className="mb-6">
                <span className="text-sm font-bold text-brand-brown block mb-2">Cantidad:</span>
                <div className="flex items-center gap-4 border border-gray-300 rounded-lg w-fit px-4 py-2">
                    <button onClick={decreaseQty} className="hover:text-brand-brownDark"><Minus size={18}/></button>
                    <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                    <button onClick={increaseQty} className="hover:text-brand-brownDark"><Plus size={18}/></button>
                </div>
            </div>
            
            {/* Tamaño */}
            <div className="mb-6">
                 <p className="text-sm text-gray-500 italic">
                    Tamaño: {product.tamaño} unidades por caja
                 </p>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.descripcion}
            </p>

            {/* Botón de Agregar al Carrito */}
            <button 
                className="w-full md:w-auto bg-brand-brown text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-brand-brownDark transition-transform hover:scale-105 flex items-center justify-center gap-3"
                onClick={() => alert(`Agregaste ${quantity} cajas de ${product.nombre} al carrito!`)}
            >
                <ShoppingCart size={24} />
                Agregar al carrito
            </button>

          </div>
        </div>
      </div>

      {/* --- AQUÍ IRÁN LAS RESEÑAS DESPUÉS --- */}
      <div className="max-w-6xl mx-auto p-4 mt-12 mb-20">
          <h2 className="text-2xl font-bold text-brand-brown mb-6">Reseñas y valoraciones</h2>
          <p className="text-gray-500">Próximamente...</p>
      </div>

      <Footer />
    </div>
  );
}