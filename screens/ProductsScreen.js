import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { useProducts } from "../context/ProductsContext";

const ProductsScreen = ({ route, navigation }) => {
  const { products = [], categories = [], searchProducts } = useProducts();

  // Initialize filteredProducts safely
  const [filteredProducts, setFilteredProducts] = useState(
    Array.isArray(products) ? products : []
  );
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.category || "All"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Update navigation title
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedCategory === "All" ? "All Products" : selectedCategory,
    });
  }, [navigation, selectedCategory]);

  // Keep filteredProducts in sync if products change
  useEffect(() => {
    setFilteredProducts(Array.isArray(products) ? products : []);
  }, [products]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const result = searchProducts(query);
      setFilteredProducts(Array.isArray(result) ? result : []);
    } else {
      setFilteredProducts(Array.isArray(products) ? products : []);
    }
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(Array.isArray(products) ? products : []);
    } else {
      const result = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(Array.isArray(result) ? result : []);
    }
  };

  const navigateToProduct = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} placeholder="Search products..." />

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "All" && styles.categoryButtonActive,
          ]}
          onPress={() => filterByCategory("All")}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "All" && styles.categoryTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {Array.isArray(categories) &&
          categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => filterByCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView style={styles.productsContainer}>
        <View style={styles.productsGrid}>
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id || product.id || index}
                product={product}
                onPress={() => navigateToProduct(product)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No products available"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  categoryFilter: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  categoryText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  productsContainer: {
    flex: 1,
    padding: 10,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default ProductsScreen;
