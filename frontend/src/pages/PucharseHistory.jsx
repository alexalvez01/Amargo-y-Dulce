import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { getPurchaseHistoryRequest } from "../api/orders";
import OrderRow from "../components/OrderRow";


export default function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

// Reemplazá el useEffect
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getPurchaseHistoryRequest();
        setOrders(res.data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#EBE7E0] flex flex-col font-brand">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 w-full mt-24 md:mt-32 mb-20 grow">
        
        {/* TÍTULO */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#6B4C3A] mb-10 text-center">
          Historial de compras
        </h1>

        {loading ? (
          <div className="text-center py-20 text-brand-brown font-medium">
            Cargando tu historial...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Todavía no hiciste ninguna compra</h2>
            <Link to="/shop" className="inline-block bg-brand-brown text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-brownDark transition-colors">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm px-6 md:px-10">
              {orders.map((order) => (
                <OrderRow key={order.idpedido} order={order} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}