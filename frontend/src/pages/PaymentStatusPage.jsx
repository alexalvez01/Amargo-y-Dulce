import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const statusText = {
  pending: {
    title: "Pago pendiente",
    description: "El pago esta pendiente de confirmacion.",
    color: "text-amber-700"
  },
  failure: {
    title: "Pago rechazado",
    description: "El pago no pudo completarse.",
    color: "text-red-700"
  }
};

export default function PaymentStatusPage() {
  const location = useLocation();
  const status = useMemo(
    () => (location.pathname.includes("/payment/pending") ? "pending" : "failure"),
    [location.pathname]
  );

  const content = statusText[status];

  return (
    <div className="min-h-screen bg-[#f7f2ec] flex flex-col font-brand">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-xl w-full text-center">
          <h1 className={`text-4xl font-bold mb-4 ${content.color}`}>{content.title}</h1>
          <p className="text-gray-700 mb-6">{content.description}</p>

          <div className="flex gap-3 justify-center">
            <Link
              to="/shop"
              className="bg-[#6b4c3a] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#543b2d]"
            >
              Ir a tienda
            </Link>
            <Link
              to="/order-detail"
              className="border border-[#6b4c3a] text-[#6b4c3a] px-5 py-2 rounded-lg font-semibold"
            >
              Ver pedido
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
