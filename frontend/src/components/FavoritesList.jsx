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
    return <p className="text-center py-10 text-gray-400 font-brand">Cargando tus chocolates favoritos...</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 font-brand">
      
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-500 font-brand">
          <input 
            type="checkbox" 
            className="rounded border-gray-300 text-[#6B4C3A] focus:ring-[#6B4C3A]"
            checked={favorites.length > 0 && selectedItems.length === favorites.length}
            onChange={handleSelectAll}
          />
          <span>Seleccionar todos</span>
        </label>
        
        {selectedItems.length > 0 && (
          <button 
            onClick={handleDeleteSelected}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors font-brand"
          >
            Eliminar seleccionados
          </button>
        )}
      </div>

      <div className="flex flex-col">
        {favorites.length === 0 ? (
          <p className="text-center py-10 text-gray-400 font-brand">No tenés productos en favoritos.</p>
        ) : (
          favorites.map((item) => {
            const itemId = item.id || item.idproductofk || item.idProductoFK;
            const itemName = item.nombre || item.name;
            const itemPrice = item.precio || item.price;
            const itemImage = item.imagen || "/images/producto-clasico.png";
            const itemSize = item.tamaño || item.tamano || item.size || 'Único';

            return (
              <div key={itemId} className="flex items-center p-4 border-b border-gray-100 last:border-b-0">
                
                <input 
                  type="checkbox" 
                  className="mr-4 rounded border-gray-300 text-[#6B4C3A] focus:ring-[#6B4C3A]"
                  checked={selectedItems.includes(itemId)}
                  onChange={() => handleSelectItem(itemId)}
                />
                
                <Link to={`/product/${itemId}`} className="w-24 h-24 shrink-0 bg-gray-200 rounded-md overflow-hidden mr-6 hover:opacity-80 transition-opacity cursor-pointer">
                  <img 
                    src={itemImage} 
                    alt={itemName} 
                    className="w-full h-full object-cover" 
                  />
                </Link>

                <div className="grow flex flex-col justify-center">
                  <Link to={`/product/${itemId}`} className="w-fit">
                    <h3 className="text-[#6B4C3A] text-lg font-medium font-brand hover:underline cursor-pointer">
                      {itemName}
                    </h3>
                  </Link>
                  
                  <p className="text-black font-semibold text-base mt-1 font-brand">
                    $ {Number(itemPrice).toLocaleString('es-AR')}
                  </p>
                  
                  <p className="text-gray-500 text-xs mt-1 font-brand">
                    Tamaño: {itemSize}
                  </p>
                  
                  <button 
                    onClick={() => handleDeleteItem(itemId)}
                    className="text-[#FF6B6B] text-xs font-medium text-left mt-3 hover:underline w-fit font-brand"
                  >
                    Eliminar
                  </button>
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