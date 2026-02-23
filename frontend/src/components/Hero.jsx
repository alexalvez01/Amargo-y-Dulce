import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center text-center">
      
      {/* 1. Imagen de Fondo con superposición oscura */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/images/hero-bg.webp")' }} // <--- ¡Pon aquí el nombre real de tu imagen!
      >
        {/* Capa negra semitransparente para que el texto se lea bien */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* 2. Contenido (Texto y Botón) */}
      <div className="relative z-10 px-4 flex flex-col items-center">
        
        {/* Título Principal */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Amargo y dulce
        </h1>
        
        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
          Más que bombones, experiencias que se disfrutan.
        </p>
        
        {/* Botón de Acción */}
        <Link 
          to="/shop" 
          className="bg-[#fcf8f5] text-[#4a3024] font-bold py-3 px-8 rounded-full text-lg hover:scale-105 transition-transform shadow-lg"
        >
          Pedí tus bombones ya!
        </Link>

      </div>
    </section>
  );
}