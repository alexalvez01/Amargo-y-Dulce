import { useState, useEffect } from "react";

function useAnimatedNumber(value, duration = 800) {
  const [displayValue, setDisplayValue] = useState(value);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    let startTime = null;
    const startValue = displayValue;
    const endValue = value;
    if (startValue === endValue) return;

    setTrend(endValue > startValue ? 'up' : 'down');

    // Duración dinámica: más corto si la diferencia es poca
    const durationToUse = Math.abs(endValue - startValue) < 1000 ? 500 : duration;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / durationToUse, 1);

      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplayValue(startValue + (endValue - startValue) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setTrend(null), 400); // Volver al color original
      }
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value]);

  return { displayValue: Math.round(displayValue), trend };
}

export default function CartSummary({ total, onConfirm, isConfirming }) {
  const { displayValue, trend } = useAnimatedNumber(total);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 w-full lg:w-[400px] h-fit sticky top-28 transition-all duration-300">

      <h2 className="text-3xl font-bold text-[#6B4C3A] font-brand mb-6">
        Resumen de compra
      </h2>

      <div className="h-px bg-gray-200 w-full mb-6"></div>

      <div className="flex justify-between items-center mb-10">
        <span className="text-lg font-bold text-gray-800 font-brand">Total</span>
        <span
          className={`text-2xl font-bold font-brand inline-block transition-all duration-300 ${trend === 'up'
              ? 'text-green-600 scale-110 drop-shadow-sm'
              : trend === 'down'
                ? 'text-red-500 scale-95 drop-shadow-sm'
                : 'text-gray-900 scale-100'
            }`}
        >
          $ {Number(displayValue).toLocaleString('es-AR')}
        </span>
      </div>

      <button
        onClick={onConfirm}
        disabled={isConfirming || total === 0}
        className={`w-full bg-[#6B4C3A] text-white font-bold py-4 rounded-xl transition-all font-brand shadow-md hover:shadow-lg ${isConfirming || total === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#543b2d] hover:scale-105"
          }`}
      >
        {isConfirming ? "Continuando..." : "Continuar"}
      </button>

    </div>
  );
}