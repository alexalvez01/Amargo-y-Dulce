import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t1);
  }, []);

  return (
    <section
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
    >
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
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "400ms",
          }}
        >
          <Link
            to="/shop"
            className="hero-btn inline-block bg-[#fcf8f5] text-[#4a3024] font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-white hover:scale-103 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all duration-300"
          >
            Pedí tus bombones ya!
          </Link>
        </div>
      </div>
    </section>
  );
}