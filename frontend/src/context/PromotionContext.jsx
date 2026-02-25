import { createContext, useContext, useState, useEffect } from "react";
import { getPromotionsRequest, hidePromotionRequest, showPromotionRequest} from "../api/promotions";

const PromotionContext = createContext();

export const usePromotions = () => {
  const context = useContext(PromotionContext);
  if (!context) throw new Error("usePromotions must be used inside PromotionProvider");
  return context;
};


export const PromotionProvider = ({ children }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);


// Obtener todas las promociones
  const getPromotions = async () => {
    try {
      const res = await getPromotionsRequest();
      setPromotions(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  // Ocultar una promoción (actualizar su estado a oculto)
  const hidePromotion = async (id) => {
    try {
      await hidePromotionRequest(id);
      getPromotions();
    } catch (error) {
      console.log(error);
    }
  };


  // Mostrar una promoción (actualizar su estado a visible)
  const showPromotion = async (id) => {
    try {
      await showPromotionRequest(id);
      getPromotions();
    } catch (error) {
      console.log(error);
    }};


  useEffect(() => {
    getPromotions();
  }, []);

  return (
    <PromotionContext.Provider value={{ promotions, loading, getPromotions, hidePromotion, showPromotion}}>
      {children}
    </PromotionContext.Provider>
  );
};
