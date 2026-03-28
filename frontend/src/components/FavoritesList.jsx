import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavoritesRequest, removeFavoriteRequest } from '../api/favorites';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavoritesRequest();
        setFavorites(res.data);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // --- SELECCIÓN DE FAVORITOS ---
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // --- SELECCIÓN DE TODOS LOS FAVORITOS ---
  const handleSelectAll = () => {
    if (selectedItems.length === favorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(favorites.map(item => item.id || item.idproductofk || item.idProductoFK)); 
    }
  };

  // --- ELIMINAR UN SOLO FAVORITO ---
  const handleDeleteItem = async (id) => {
    try {
      await removeFavoriteRequest(id);
      setFavorites(favorites.filter(item => (item.id || item.idproductofk || item.idProductoFK) !== id));
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // --- ELIMINAR VARIOS FAVORITOS A LA VEZ ---
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedItems.map(id => removeFavoriteRequest(id)));
      
      setFavorites(favorites.filter(item => !selectedItems.includes(item.id || item.idproductofk || item.idProductoFK)));
      setSelectedItems([]);
    } catch (error) {
      console.error("Error al eliminar seleccionados:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#6B4C3A]">
        <svg className="animate-spin h-10 w-10 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="font-brand font-medium">Cargando tus chocolates favoritos...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 font-brand overflow-hidden mt-6 mb-12">
      
      {favorites.length > 0 && (
        <div className="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-100">
          <label className="flex items-center space-x-3 cursor-pointer text-sm text-gray-700 font-bold hover:text-[#4a3024] transition-colors group/label">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-2 border-gray-300 accent-[#4a3024] text-[#4a3024] focus:ring-[#4a3024] focus:ring-offset-1 cursor-pointer transition-all duration-300 active:scale-75 group-hover/label:border-[#4a3024]"
              checked={selectedItems.length === favorites.length}
              onChange={handleSelectAll}
            />
            <span>Seleccionar todos</span>
          </label>
          
          {selectedItems.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all font-brand"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Eliminar seleccionados
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white">
            <svg className="w-20 h-20 text-gray-200 mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <p className="text-xl text-gray-500 font-brand mb-8 max-w-sm">
              Aún no has guardado ningún chocolate. ¡Explorá nuestra tienda y elegí tus favoritos!
            </p>
            <Link to="/shop" className="inline-flex items-center justify-center bg-[#4a3024] text-white font-bold px-8 py-3 rounded-full hover:bg-[#6b4c3a] hover:scale-105 hover:shadow-lg transition-all duration-300">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          favorites.map((item, index) => {
            const itemId = item.id || item.idproductofk || item.idProductoFK;
            const itemName = item.nombre || item.name;
            const itemPrice = item.precio || item.price;
            const itemImage = item.imagen || "/images/producto-clasico.png";
            const itemSize = item.tamaño || item.tamano || item.size || 'Único';
            const isInactive = item.estado === 'inactivo';

            return (
              <div key={itemId} className={`group flex items-center p-5 sm:p-6 border-b border-gray-100 last:border-b-0 hover:bg-[#faf7f5] transition-colors duration-200 ${isInactive ? 'opacity-60 grayscale bg-gray-50' : ''} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                
                <input 
                  type="checkbox" 
                  className="w-5 h-5 mr-4 sm:mr-6 rounded border-2 border-gray-300 accent-[#4a3024] text-[#4a3024] focus:ring-[#4a3024] focus:ring-offset-1 cursor-pointer transition-all duration-300 active:scale-75 hover:border-[#4a3024] hover:scale-110"
                  checked={selectedItems.includes(itemId)}
                  onChange={() => handleSelectItem(itemId)}
                />
                
                <Link to={`/product/${itemId}`} className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mr-5 sm:mr-8 hover:opacity-90 transition-all cursor-pointer group-hover:shadow-md">
                  <img 
                    src={itemImage} 
                    alt={itemName} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                  {isInactive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <span className="bg-white text-gray-800 text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">Agotado</span>
                    </div>
                  )}
                </Link>

                <div className="grow flex flex-col justify-center">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <Link to={`/product/${itemId}`} className="w-fit block">
                        <h3 className="text-[#4a3024] text-lg sm:text-xl font-bold font-brand hover:text-[#d38b5d] transition-colors cursor-pointer line-clamp-2">
                          {itemName}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-500 text-sm mt-1 mb-2 font-brand flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#d38b5d]/50"></span>
                        Tamaño: <span className="font-medium text-gray-700">{itemSize}</span>
                      </p>
                    </div>

                    <p className="text-[#4a3024] font-bold text-xl sm:text-2xl mt-2 sm:mt-0 font-brand">
                      $ {Number(itemPrice).toLocaleString('es-AR')}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <button 
                      onClick={() => handleDeleteItem(itemId)}
                      className="flex items-center gap-1.5 text-gray-400 text-sm font-medium hover:text-red-500 transition-colors w-fit font-brand group/btn"
                    >
                      <svg className="w-4 h-4 opacity-70 group-hover/btn:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FavoritesList;