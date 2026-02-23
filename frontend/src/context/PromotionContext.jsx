import { createContext, useContext, useState, useEffect } from "react";
import { getPromotionsRequest, hidePromotionRequest } from "../api/promotions";

const PromotionContext = createContext();

export const usePromotions = () => {
  const context = useContext(PromotionContext);
  if (!context) throw new Error("usePromotions must be used inside PromotionProvider");
  return context;
};

export const PromotionProvider = ({ children }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const hidePromotion = async (id) => {
    try {
      await hidePromotionRequest(id);
      setPromotions(promotions.filter((p) => p.idpromocion !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPromotions();
  }, []);

  return (
    <PromotionContext.Provider value={{ promotions, loading, getPromotions, hidePromotion}}>
      {children}
    </PromotionContext.Provider>
  );
};
