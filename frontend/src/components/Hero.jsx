import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    // Después de que todas las animaciones de entrada terminan
    const t2 = setTimeout(() => setEntered(true), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center text-center">
      
      {/* 1. Imagen de Fondo con superposición oscura */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("/images/hero-bg.webp")',
          backgroundAttachment: "fixed",
        }} 
      >
        
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* 2. Contenido (Texto y Botón) */}
      <div className="relative z-10 px-4 flex flex-col items-center">
        
        {/* Título Principal */}
        <h1 
          className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          Amargo y dulce
        </h1>
        
        {/* Subtítulo */}
        <p 
          className="text-xl md:text-2xl text-white mb-8 drop-shadow-md transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "200ms",
          }}
        >
          Más que bombones, experiencias que se disfrutan.
        </p>
        
        {/* Botón de Acción */}
        <Link 
          to="/shop" 
          className="hero-btn bg-[#fcf8f5] text-[#4a3024] font-bold py-3 px-8 rounded-full text-lg shadow-lg"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
            transitionDelay: "400ms",
            ...(entered ? { opacity: 1, transform: undefined, transition: undefined, transitionDelay: undefined } : {}),
          }}
        >
          Pedí tus bombones ya!
        </Link>

      </div>
    </section>
  );
}