import { createContext, useContext, useState, useEffect } from "react";
import {
  getProductsRequest,
  createProductRequest,
  hideProductRequest,
  getProductRequest,
  getTopSalesProductsRequest,
  showProductRequest
} from "../api/products";

  const ProductContext = createContext();


export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used inside ProductProvider");
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

   // Obtener un producto por id (petición individual)
  const getProductById = async (id) => {
    try {
      const res = await getProductRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Obtener productos más vendidos
  const getTopSalesProducts = async () => {
    try {
      const res = await getTopSalesProductsRequest();
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getProducts = async () => {
    try {
      const res = await getProductsRequest();
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const createProduct = async (product) => {
    try {
      const res = await createProductRequest(product);
      setProducts([...products, res.data]);
    } catch (error) {
      console.log(error);
    }
  };


  const hideProduct = async (id) => {
    try {
      await hideProductRequest(id);
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };
  
  const showProduct = async (id) => {
  try {
    await showProductRequest(id);
    await getProducts();
  } catch (error) {
    console.log(error);
  }
};
  
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        getProducts,
        createProduct,
        hideProduct,
        getProductById,
        getTopSalesProducts,
        showProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
