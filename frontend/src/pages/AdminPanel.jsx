import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddPromotionModal from "../components/AddPromotionModal";

const adminMenu = [
  { id: 1, title: 'Añadir un producto' },
  { id: 2, title: 'Actualizar Productos' },
  { id: 3, title: 'Dar de baja un producto o promoción' },
  { id: 4, title: 'Gestionar Pedidos' },
  { id: 5, title: 'Dar de alta un producto o promoción' },
  { id: 6, title: 'Agregar Promociones' },
  { id: 7, title: 'Actualizar Stock' },
];

function AdminPanel() {
  const navigate = useNavigate();
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  return (
    <div>
      <Navbar/>
      <main className="min-h-screen">
      <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center font-brand">

        <div className="my-20 py-14 bg-white rounded-2xl max-w-5xl w-full p-8 shadow-md">

          <h2 className="text-center text-4xl md:text-5xl font-semibold text-brand-brownDark mb-6">Panel de Administrador</h2>

          {/* Menú de opciones para el administrador */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminMenu.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-brand-beige rounded-lg shadow h-[120px] flex flex-col items-center justify-center px-4 font-medium border-t-4 border-brand-brown cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => {
                  if (item.id === 2) navigate("/admin/update-product");
                  else if (item.id === 3) navigate("/admin/delete-product-promotion")
                  else if (item.id === 5) navigate("/admin/enable-product-promotion");
                  else if (item.id === 6) setIsPromoModalOpen(true);
                }}
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#ded1be] text-brand-brownDark text-xl font-bold mb-1">{item.id.toString().padStart(2, '0')}</span>
                <span className="text-xl text-center text-brand-brownDark">{item.title}</span>
              </div>
            ))}
            <div className="md:col-span-2  bg-brand-beige rounded-lg shadow h-[120px] flex flex-col md:flex-row justify-center items-center px-4 border-t-4 font-medium border-brand-brown cursor-pointer transition-transform transform hover:scale-105">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#ded1be]  text-brand-brownDark text-xl font-bold md:mr-4">07</span>
              <span className="text-xl text-center text-brand-brownDark">Actualizar Stock</span>
            </div>
          </div>
        </div>
      </div>
      </main>
      {/* MODAL RENDERIZADO */}
      <AddPromotionModal 
        isOpen={isPromoModalOpen} 
        onClose={() => setIsPromoModalOpen(false)} 
      />
    </div>
  );
}

export default AdminPanel;
