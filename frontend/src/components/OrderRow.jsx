import { Package, MapPin, CheckCircle, Clock, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderRow({ order }) {
    const formatDate = (dateString) => {
        // Para evitar desfases de UTC con strings YYYY-MM-DD, creamos la fecha manualmente
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    const getStatusBadge = (estado) => {
        switch (estado.toLowerCase()) {
            case 'entregado':
                return <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle size={14}/> Entregado</span>;
            case 'pendiente':
                return <span className="flex items-center gap-1 text-yellow-600 font-medium"><Clock size={14}/> Pendiente</span>;
            case 'enviado':
                return <span className="flex items-center gap-1 text-blue-600 font-medium"><Package size={14}/> En camino</span>;
            case 'cancelado':
                return <span className="flex items-center gap-1 text-red-600 font-medium"><XCircle size={14}/> Cancelado</span>;
            default:
                return <span className="text-gray-500 font-medium">{estado}</span>;
        }
    };

    return (
        <div className="py-8 border-b border-gray-200 last:border-0 font-brand">
            {/* HEADER DE LA FILA: Fecha (Izquierda) + Data extra (Derecha) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <span className="text-sm text-gray-800">
                    {formatDate(order.fecha)}
                </span>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-bold text-[#6B4C3A]">Total: ${Number(order.total).toLocaleString('es-AR')}</span>
                    <span className="hidden md:inline">|</span>
                    <span>Pedido #{order.idpedido}</span>
                    <span className="hidden md:inline">|</span>
                    <span className="flex items-center gap-1"><MapPin size={12}/> {order.direccion}</span>
                </div>
            </div>

            {/* PRODUCTOS DEL PEDIDO */}
            <div className="space-y-6">
                {order.productos.map((prod, index) => (
                    <div key={index} className="flex gap-6 items-center">
                        <div className="w-28 h-28 md:w-32 md:h-32 shrink-0">
                            <img
                                src={prod.imagen || "/images/producto-clasico.webp"}
                                alt={prod.nombre}
                                className="w-full h-full object-cover rounded-xl shadow-sm"
                            />
                        </div>

                        <div className="flex flex-col justify-center">
                            <h3 className="text-lg md:text-xl text-[#6B4C3A] mb-2 font-medium">
                                {prod.nombre}
                            </h3>
                            <p className="text-lg text-gray-800 mb-1">
                                $ {Number(prod.precio).toLocaleString('es-AR')} 
                                <span className="text-sm text-gray-500 ml-2">x {prod.cantidad} unidades</span>
                            </p>
                            <p className="text-xs text-gray-500 italic">
                                Tamaño: {prod.tamano || 'M'}
                            </p>
                            <p className="text-sm font-medium text-brand-brown mt-1">
                                Subtotal: $ {Number(prod.precio * prod.cantidad).toLocaleString('es-AR')}
                            </p>
                            <Link
                                to={`/product/${prod.idproducto}`}
                                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#6B4C3A] border border-[#6B4C3A] rounded-full px-3 py-1 hover:bg-[#6B4C3A] hover:text-white transition-colors w-fit"
                            >
                                ⭐ Calificar producto
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
