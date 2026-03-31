import { useEffect, useState, useMemo } from "react";
import { X, Search, Package, Mail, User, ArrowRight, XCircle, MapPin } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-start justify-center p-4 sm:p-6 backdrop-blur-sm font-brand overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 relative my-16 sm:my-20">
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
                <div className="mb-8 relative max-w-xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[#b0997f]" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por código de seguimiento..."
                    className="w-full bg-[#f7f2ec] border border-[#d6cdbf] rounded-xl pl-12 pr-4 py-3 text-[#4a3024] placeholder-[#b0997f] focus:outline-none focus:ring-2 focus:ring-[#634533] transition-shadow shadow-sm"
                  />
                </div>

                {filteredShipments.length === 0 ? (
                  <p className="text-center text-brand-brownDark my-8">No se encontraron pedidos con ese código.</p>
                ) : (
                  <div className="flex flex-col gap-8 pb-4">
                    {filteredShipments.filter(s => s.estado === 'preparado').length > 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-[#f0e3d2] shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-[#f0e3d2] pb-3">
                          <h3 className="text-xl font-bold text-[#634533]">Pedidos Preparados</h3>
                          <span className="bg-[#f0e3d2] text-[#634533] text-sm font-bold px-3 py-1 rounded-full">
                            {filteredShipments.filter(s => s.estado === 'preparado').length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredShipments.filter(s => s.estado === 'preparado').map((shipment) => (
                            <div key={shipment.idenvio} className="bg-[#f7f2ec] rounded-xl overflow-hidden border border-[#e1d0bc] border-t-4 border-t-[#634533] hover:shadow-md transition-all flex flex-col p-5 h-full">
                              <div className="flex justify-between items-start mb-4 border-b border-[#e1d0bc] pb-3 gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Package className="h-5 w-5 text-[#634533] shrink-0" />
                                  <span className="font-bold text-[#4a3024] truncate">{shipment.codigoseguimiento}</span>
                                </div>
                                <span className="font-bold text-[#4a3024] bg-[#e1d0bc] px-3 py-1 rounded-full text-xs whitespace-nowrap shrink-0 mt-0.5">
                                  $ {formatPrice(shipment.total)}
                                </span>
                              </div>
                              
                              <div className="flex flex-col gap-3 text-[#5a3a29] text-sm grow mb-6">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-[#8a6855] shrink-0" />
                                  <span className="truncate" title={shipment.email}>{shipment.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-[#8a6855] shrink-0" />
                                  <span className="truncate">{shipment.nombreusuario} {shipment.apellidousuario}</span>
                                </div>
                                {shipment.calle && (
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-[#8a6855] shrink-0 mt-0.5" />
                                    <span className="line-clamp-2 leading-tight">
                                      {shipment.calle} {shipment.numero}, {shipment.nombreciudad}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-center mt-auto pt-4 border-t border-[#e1d0bc]">
                                <button 
                                  onClick={() => handleActionClick(shipment, 'cancel')}
                                  className="flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span>Cancelar</span>
                                </button>
                                <button 
                                  onClick={() => handleActionClick(shipment, 'next')}
                                  className="flex items-center gap-1.5 bg-[#634533] hover:bg-[#4a3024] text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-sm"
                                >
                                  <span>Avanzar</span>
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredShipments.filter(s => s.estado === 'en proceso').length > 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-[#f0e3d2] shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-[#f0e3d2] pb-3">
                          <h3 className="text-xl font-bold text-[#634533]">Pedidos En Proceso</h3>
                          <span className="bg-[#f0e3d2] text-[#634533] text-sm font-bold px-3 py-1 rounded-full">
                            {filteredShipments.filter(s => s.estado === 'en proceso').length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredShipments.filter(s => s.estado === 'en proceso').map((shipment) => (
                            <div key={shipment.idenvio} className="bg-[#f7f2ec] rounded-xl overflow-hidden border border-[#e1d0bc] border-t-4 border-t-[#b0997f] hover:shadow-md transition-all flex flex-col p-5 h-full">
                              <div className="flex justify-between items-start mb-4 border-b border-[#e1d0bc] pb-3 gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Package className="h-5 w-5 text-[#b0997f] shrink-0" />
                                  <span className="font-bold text-[#4a3024] truncate">{shipment.codigoseguimiento}</span>
                                </div>
                                <span className="font-bold text-[#4a3024] bg-[#e1d0bc] px-3 py-1 rounded-full text-xs whitespace-nowrap shrink-0 mt-0.5">
                                  $ {formatPrice(shipment.total)}
                                </span>
                              </div>
                              
                              <div className="flex flex-col gap-3 text-[#5a3a29] text-sm grow mb-6">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-[#8a6855] shrink-0" />
                                  <span className="truncate" title={shipment.email}>{shipment.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-[#8a6855] shrink-0" />
                                  <span className="truncate">{shipment.nombreusuario} {shipment.apellidousuario}</span>
                                </div>
                                {shipment.calle && (
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-[#8a6855] shrink-0 mt-0.5" />
                                    <span className="line-clamp-2 leading-tight">
                                      {shipment.calle} {shipment.numero}, {shipment.nombreciudad}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-center mt-auto pt-4 border-t border-[#e1d0bc]">
                                <button 
                                  onClick={() => handleActionClick(shipment, 'cancel')}
                                  className="flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span>Cancelar</span>
                                </button>
                                <button 
                                  onClick={() => handleActionClick(shipment, 'next')}
                                  className="flex items-center gap-1.5 bg-[#b0997f] hover:bg-[#8a6855] text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-sm"
                                >
                                  <span>Finalizar</span>
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
