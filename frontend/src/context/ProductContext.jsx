import { createContext, useContext, useState, useEffect } from "react";
import {
  getProductsRequest,
  createProductRequest,
  updateProductRequest,
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

  // Obtener todos los productos
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

// Crear un nuevo producto
  const createProduct = async (product) => {
    try {
      const res = await createProductRequest(product);
      setProducts([...products, res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  // Actualizar un producto por id
  const updateProduct = async (id, productData) => {
    try {
      const res = await updateProductRequest(id, productData);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.idproducto === id ? res.data : product
        )
      );
      return { success: true, data: res.data };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  };

// Ocultar un producto (actualizar su estado a oculto)
  const hideProduct = async (id) => {
    try {
      await hideProductRequest(id);
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };
  // Mostrar un producto (actualizar su estado a visible)
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
        updateProduct,
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
