import { Package, MapPin, CheckCircle, Clock, XCircle } from "lucide-react";

export default function OrderRow({ order }) {
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
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
                            <p className="text-lg text-gray-800 mb-2">
                                $ {Number(prod.precio).toLocaleString('es-AR')}
                            </p>
                            <p className="text-xs text-gray-500 italic">
                                Tamaño: {prod.tamano || 'M'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
