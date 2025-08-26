import { createContext, useContext, useEffect, useState } from "react";

const ProductsContext = createContext();

// Mock data - replace with actual API calls
const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    image: "https://via.placeholder.com/300x300?text=Headphones",
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation.",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "https://via.placeholder.com/300x300?text=Smart+Watch",
    category: "Electronics",
    description: "Feature-rich smartwatch with health monitoring.",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 89.99,
    image: "https://via.placeholder.com/300x300?text=Running+Shoes",
    category: "Clothing",
    description: "Comfortable running shoes for all terrains.",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Coffee Maker",
    price: 129.99,
    image: "https://via.placeholder.com/300x300?text=Coffee+Maker",
    category: "Home",
    description: "Automatic coffee maker with programmable settings.",
    rating: 4.3,
  },
  {
    id: 5,
    name: "Backpack",
    price: 59.99,
    image: "https://via.placeholder.com/300x300?text=Backpack",
    category: "Accessories",
    description: "Durable backpack with laptop compartment.",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Water Bottle",
    price: 24.99,
    image: "https://via.placeholder.com/300x300?text=Water+Bottle",
    category: "Accessories",
    description: "Insulated water bottle that keeps drinks cold for 24 hours.",
    rating: 4.8,
  },
];

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
    try {
      // Simulate API call
      setTimeout(() => {
        setProducts(mockProducts);
        setFeaturedProducts(
          mockProducts.filter((product) => product.rating >= 4.5)
        );

        const uniqueCategories = [
          ...new Set(mockProducts.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading products:", error);
      setIsLoading(false);
    }
  };

  const getProductById = (id) => {
    return products.find((product) => product.id === id);
  };

  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category);
  };

  const searchProducts = (query) => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
  };

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
