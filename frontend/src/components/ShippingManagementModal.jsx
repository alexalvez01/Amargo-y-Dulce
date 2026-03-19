import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { 
  getActiveShipmentsRequest, 
  advanceShipmentStatusRequest, 
  cancelShipmentRequest 
} from "../api/shipping";

export default function ShippingManagementModal({ isOpen, onClose }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredShipments = shipments.filter((s) =>
    s.codigoseguimiento?.toLowerCase().includes(search.toLowerCase())
  );

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await getActiveShipmentsRequest();
      setShipments(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los envíos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchShipments();
      setSearch("");
    } else {
      setSelectedShipment(null);
      setIsConfirming(false);
    }
  }, [isOpen]);

  const handleActionClick = (shipment, type) => {
    setSelectedShipment(shipment);
    setActionType(type);
    setIsConfirming(true);
  };

  const confirmAction = async () => {
    if (!selectedShipment || !actionType) return;
    
    setIsProcessing(true);
    try {
      if (actionType === 'next') {
        await advanceShipmentStatusRequest(selectedShipment.idenvio);
      } else {
        await cancelShipmentRequest(selectedShipment.idenvio);
      }
      
      toast.success(actionType === 'next' ? "Estado actualizado" : "Pedido dado de baja");
      setIsConfirming(false);
      setSelectedShipment(null);
      fetchShipments(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Ocurrió un error al procesar la solicitud");
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelConfirmation = () => {
    setIsConfirming(false);
    setSelectedShipment(null);
    setActionType(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm font-brand overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-1 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {!isConfirming ? (
          <>
            <h2 className="text-3xl font-semibold text-brand-brown mb-8 text-center rounded-2xl border-b border-gray-100 pb-4">
              Lista de pedidos activos
            </h2>

            {loading ? (
              <p className="text-center text-brand-brownDark my-12">Cargando pedidos...</p>
            ) : shipments.length === 0 ? (
              <p className="text-center text-brand-brownDark my-12">No hay pedidos activos.</p>
            ) : (
              <>
                {/* Buscador */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por código de seguimiento..."
                    className="w-full bg-[#f7f2ec] border border-[#d6cdbf] rounded-lg px-4 py-2.5 text-sm text-brand-brownDark placeholder-[#b0997f] focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>

                {filteredShipments.length === 0 ? (
                  <p className="text-center text-brand-brownDark my-8">No se encontraron pedidos con ese código.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    {filteredShipments.map((shipment) => (
                  <div key={shipment.idenvio} className="bg-[#f0e3d2] rounded-xl overflow-hidden border-t-8 border-[#634533] shadow-sm flex flex-col p-5 relative">
                    <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-[#5a3a29] text-sm">Código: {shipment.codigoseguimiento}</span>
                       <span className="font-bold text-[#5a3a29] text-sm">Total $ {formatPrice(shipment.total)}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-[#5a3a29] text-sm grow">
                      <span><span className="font-semibold italic">Email:</span> {shipment.email}</span>
                      <span><span className="font-semibold italic">Usuario:</span> {shipment.nombreusuario} {shipment.apellidousuario}</span>
                      <span><span className="font-semibold italic">Estado:</span> {shipment.estado}</span>
                    </div>

                    <div className="absolute right-5 bottom-4 flex flex-col items-end gap-1 font-semibold text-sm">
                      <button 
                        onClick={() => handleActionClick(shipment, 'next')}
                        className="text-blue-500 hover:text-blue-700 hover:underline transition-all"
                      >
                        Siguiente estado
                      </button>
                      <button 
                        onClick={() => handleActionClick(shipment, 'cancel')}
                        className="text-red-500 hover:text-red-700 hover:underline transition-all"
                      >
                        Dar de baja
                      </button>
                    </div>
                  </div>
                  ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="py-10 px-2 flex flex-col items-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-brownDark mb-3 text-center">
              {actionType === 'next' 
                ? "¿Desea avanzar de estado el siguiente pedido?" 
                : "¿Desea dar de baja el siguiente pedido?"}
            </h2>

            {selectedShipment && (
              <p className="text-brand-brown text-lg mb-10 text-center font-semibold">
                {selectedShipment.codigoseguimiento}
              </p>
            )}

            <div className="flex justify-center gap-4 w-full max-w-sm">
              <button
                onClick={confirmAction}
                disabled={isProcessing}
                className="flex-1 bg-[#634533] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#4a3024] transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Procesando..." : "Confirmar"}
              </button>
              <button
                onClick={cancelConfirmation}
                disabled={isProcessing}
                className="flex-1 bg-white text-[#634533] font-bold py-3 px-6 rounded-lg border-2 border-[#634533] hover:bg-[#f0e3d2] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
