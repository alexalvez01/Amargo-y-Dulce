import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight / 2;
    setButtonPos({ x: x * 0.08, y: y * 0.08 });
  };

  const handleMouseLeave = () => {
    setButtonPos({ x: 0, y: 0 });
  };

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    // Después de que todas las animaciones de entrada terminan
    const t2 = setTimeout(() => setEntered(true), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
        <Link
          to="/shop"
          className="hero-btn bg-[#fcf8f5] text-[#4a3024] font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-white hover:shadow-2xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: entered
              ? `translate3d(${buttonPos.x}px, ${buttonPos.y}px, 0)`
              : (visible ? "translateY(0)" : "translateY(30px)"),
            transition: entered
              ? (buttonPos.x === 0 && buttonPos.y === 0
                ? "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.3s, box-shadow 0.3s"
                : "transform 0.1s ease-out, background-color 0.3s, box-shadow 0.3s")
              : "opacity 700ms ease-out, transform 700ms ease-out",
            transitionDelay: entered ? "0ms" : "400ms",
          }}
        >
          Pedí tus bombones ya!
        </Link>
      </div>
    </section >
  );
}