export default function CartSummary({ total, onConfirm, isConfirming }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 w-full  lg:w-[400px] h-fit sticky top-28">
      
      <h2 className="text-3xl font-bold text-[#6B4C3A] font-brand mb-6">
        Resumen de compra
      </h2>
      
      <div className="h-px bg-gray-200 w-full mb-6"></div>

      <div className="flex justify-between items-center mb-10">
        <span className="text-lg font-bold text-gray-800 font-brand">Total</span>
        <span className="text-2xl font-bold text-gray-900 font-brand">
          $ {Number(total).toLocaleString('es-AR')}
        </span>
      </div>

      <button 
        onClick={onConfirm}
        disabled={isConfirming || total === 0}
        className={`w-full bg-[#6B4C3A] text-white font-bold py-4 rounded-xl transition-all font-brand shadow-md hover:shadow-lg ${
          isConfirming || total === 0 
            ? "opacity-50 cursor-not-allowed" 
            : "hover:bg-[#543b2d] hover:scale-105"
        }`}
      >
        {isConfirming ? "Confirmando..." : "Confirmar"}
      </button>

    </div>
  );
}