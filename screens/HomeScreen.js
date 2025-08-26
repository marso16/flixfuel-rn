import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";

const HomeScreen = ({ navigation }) => {
  const { products, featuredProducts, categories } = useProducts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false);
    }
  }, [products]);

  const navigateToCategory = (category) => {
    navigation.navigate("Products", { category });
  };

  const navigateToProduct = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hero Banner */}
      <View style={styles.hero}>
        <Image
          source={require("../assets/images/sale_banner.png")}
          style={styles.heroImage}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Summer Sale</Text>
          <Text style={styles.heroSubtitle}>
            Up to 50% off on selected items
          </Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={`category-${index}`}
              style={styles.categoryCard}
              onPress={() => navigateToCategory(category)}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>
                  {category.charAt(0)}
                </Text>
              </View>
              <Text style={styles.categoryName}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={`featured-${product._id || product.id || index}`}
              product={product}
              onPress={() => navigateToProduct(product)}
            />
          ))}
        </ScrollView>
      </View>

      {/* New Arrivals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Arrivals</Text>
        <View style={styles.productGrid}>
          {products.slice(0, 4).map((product, index) => (
            <ProductCard
              key={`new-arrival-${product._id || product.id || index}`}
              product={product}
              onPress={() => navigateToProduct(product)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    position: "relative",
    height: 200,
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  banner: {
    height: 200,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  bannerSubtext: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
  },
  shopButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
  },
  shopButtonText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    alignItems: "center",
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryIconText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default HomeScreen;
