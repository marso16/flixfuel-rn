import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts();
      console.log("Fetched products:", data);

      setProducts(Array.isArray(data.products) ? data.products : []);

      const featured = await api.getFeaturedProducts();
      setFeaturedProducts(
        Array.isArray(featured.products) ? featured.products : []
      );

      const cats = await api.getCategories();
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = (id) => products.find((product) => product.id === id);

  const getProductsByCategory = (category) =>
    products.filter((product) => product.category === category);

  const searchProducts = (query) =>
    products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

  const value = {
    products,
    featuredProducts,
    categories,
    isLoading,
    getProductById,
    getProductsByCategory,
    searchProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
