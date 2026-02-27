import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getLatestOrderDetailRequest,
  saveOrderDetailDataRequest
} from "../api/orders";
import { createPaymentPreferenceRequest } from "../api/payments";

const formatCurrency = (value) => `$ ${Number(value || 0).toLocaleString("es-AR")}`;

const initialForm = {
  direccion: "",
  pais: "Argentina",
  provincia: "",
  nombreCiudad: "",
  codigoPostal: ""
};

function Step({ label, state, number }) {
  const done = state === "done";
  const active = state === "active";

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
            done ? "bg-[#3f8f54] text-white" : active ? "bg-[#6b4c3a] text-white" : "bg-[#a39b95] text-white"
          }`}
        >
          {done ? <Check size={14} /> : number}
        </div>
        <span
          className={`text-sm font-semibold ${
            done ? "text-[#3f8f54]" : active ? "text-[#6b4c3a]" : "text-[#9d9691]"
          }`}
        >
          {label}
        </span>
      </div>
      <div className={`h-0.5 ${done ? "bg-[#62ad75]" : active ? "bg-[#6b4c3a]" : "bg-transparent"}`} />
    </div>
  );
}


export default function OrderDetail() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [factura, setFactura] = useState(null);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const res = await getLatestOrderDetailRequest();
        setFactura(res.data.factura);
        setProductos(res.data.productos || []);

        if (res.data.direccion) {
          const dir = res.data.direccion;
          setFormData({
            direccion: `${dir.calle || ""} ${dir.numero || ""}`.trim(),
            pais: dir.pais || "Argentina",
            provincia: dir.provincia || "",
            nombreCiudad: dir.nombreciudad || "",
            codigoPostal: dir.codigopostal || ""
          });
        }
      } catch (error) {
        const message = error?.response?.status === 404
          ? "No encontramos un pedido confirmado."
          : "No se pudo cargar el detalle del pedido.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, []);

  const subtotal = useMemo(
    () => productos.reduce((acc, item) => acc + Number(item.subtotalproducto || 0), 0),
    [productos]
  );

  const total = Number(factura?.total || subtotal);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    if (event?.preventDefault) event.preventDefault();

    if (!formData.direccion || !formData.provincia || !formData.nombreCiudad || !formData.codigoPostal) {
      toast.error("Completa todos los campos de envio");
      return;
    }

    try {
      setSaving(true);
      await saveOrderDetailDataRequest({
        calle: formData.direccion.trim(),
        provincia: formData.provincia.trim(),
        nombreCiudad: formData.nombreCiudad.trim(),
        codigoPostal: formData.codigoPostal.trim(),
        pais: formData.pais
      });

      const idFactura = factura?.idfactura ?? factura?.idFactura;
      if (!idFactura) {
        toast.error("No se encontro la factura para iniciar el pago");
        return;
      }

      const paymentRes = await createPaymentPreferenceRequest(idFactura);
      const initPoint = paymentRes.data.initPoint || paymentRes.data.sandboxInitPoint;

      if (!initPoint) {
        toast.error("No se pudo generar el link de pago");
        return;
      }

      window.location.href = initPoint;
    } catch (error) {
      toast.error(error?.response?.data?.error || "No se pudieron guardar los datos");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] flex flex-col font-brand">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-2xl text-brand-brown">Cargando detalle de pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex flex-col font-brand">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-4 mt-10 md:mt-30 mb-16">
        <h1 className="text-4xl md:text-5xl text-brand-brownDark font-semibold mb-7 text-center">Detalles de Pedido</h1>

        <div className="flex gap-5 max-w-3xl mx-auto mb-10">
          <Step number={1} label="Carrito" state="done" />
          <Step number={2} label="Detalles de pago" state="active" />
          <Step number={3} label="Estado de pedido" state="pending" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="bg-[#f4f4f4] rounded-xl p-5 shadow-sm">
              <h2 className="text-3xl font-semibold text-brand-brownDark mb-4">Dirección de envío</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold tracking-wide text-[#626262] mb-1">DIRECCIÓN *</label>
                  <input
                    name="direccion"
                    value={formData.direccion}
                    onChange={onInputChange}
                    placeholder="Ej: Artigas 222"
                    className="w-full border border-[#adb2b8] rounded px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wide text-[#626262] mb-1">PAÍS *</label>
                  <select
                    name="pais"
                    value={formData.pais}
                    onChange={onInputChange}
                    className="w-full border border-[#adb2b8] rounded px-3 py-2 text-sm bg-white"
                  >
                    <option value="Argentina">Argentina</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wide text-[#626262] mb-1">PROVINCIA *</label>
                  <input
                    name="provincia"
                    value={formData.provincia}
                    onChange={onInputChange}
                    placeholder="Pueblo / Ciudad *"
                    className="w-full border border-[#adb2b8] rounded px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wide text-[#626262] mb-1">CIUDAD*</label>
                    <input
                      name="nombreCiudad"
                      value={formData.nombreCiudad}
                      onChange={onInputChange}
                      placeholder="Ciudad"
                      className="w-full border border-[#adb2b8] rounded px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wide text-[#626262] mb-1">CODIGO POSTAL*</label>
                    <input
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={onInputChange}
                      placeholder="Codigo Postal"
                      className="w-full border border-[#adb2b8] rounded px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>

            <section className="bg-[#f4f4f4] rounded-xl p-5 shadow-sm">
              <h3 className="text-3xl font-semibold text-brand-brownDark mb-3">Método de pago (único método)</h3>
                <label className="border border-brand-brownDark rounded px-3 py-2 bg-gray-200 flex items-center gap-3 pointer-events-none select-none">
                <input type="radio" checked readOnly className="accent-[#6b4c3a]" />
                <img src="/images/mercado-pago.webp" alt="Mercado Pago" className="h-6 w-auto object-contain" />
              </label>
            </section>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-[#6b4c3a] text-white font-semibold py-2.5 rounded-md hover:bg-[#543b2d] transition-colors disabled:opacity-60"
            >
              {saving ? "Redirigiendo..." : "Ir a pagar"}
            </button>
          </div>

          <section className="bg-[#f4f4f4] rounded-xl p-5 shadow-sm h-fit">
            <h2 className="text-3xl font-semibold text-[#6b4c3a] mb-3">Orden de compra</h2>

            <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
              {productos.map((item, idx) => (
                <article key={`${item.idproductofk}-${idx}`} className="flex gap-3 items-start py-3 border-t border-[#664C3E44] first:border-t">
                  <img src={item.imagen} alt={item.nombre} className="w-14 h-14 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#242424]">{item.nombre}</p>
                    <p className="text-xs italic text-[#5f5f5f]">Tamaño: {item.tamano || "-"}</p>
                    <p className="text-xs italic text-[#5f5f5f]">Cantidad: {item.cantidad}</p>
                  </div>
                  <p className="font-semibold text-sm text-[#242424]">{formatCurrency(item.subtotalproducto)}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[#664C3E44] text-sm space-y-2">
              <div className="flex justify-between text-[#3f3f3f]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-2xl text-[#222] pt-1">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
