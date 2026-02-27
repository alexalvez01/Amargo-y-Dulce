import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PromotionCard from "../components/PromotionCard";
import { usePromotions } from "../context/PromotionContext";

export default function Promotions() {
    const { promotions, getPromotions } = usePromotions();
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        await getPromotions();
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, [getPromotions]);

  return (
    <div className="bg-[#EBE7E0] flex flex-col min-h-screen font-brand">
      <Navbar />

      <main className="grow max-w-6xl mx-auto w-full px-4 pt-24 pb-24">
        <h1 className="text-4xl md:text-5xl font-semibold text-brand-brownDark text-center mb-15">
          Promociones
        </h1>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            Cargando promociones...
          </div>
        ) : promotions && promotions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <PromotionCard key={promo.idpromocion || promo.id} promo={promo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-400 mb-2">¡Ups!</h3>
            <p className="text-gray-500">
              No hay promociones activas en este momento. ¡Volvé a revisar pronto!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}