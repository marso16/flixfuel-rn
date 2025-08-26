import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import { COLORS, FONTS, SPACING, USER_ROLES } from "../utils/constants";

const AdminProductsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (user?.role !== USER_ROLES.ADMIN) {
      navigation.goBack();
      return;
    }
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const filterProducts = () => {
    if (!searchQuery) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Here you would call your API to delete the product
            Alert.alert("Success", "Product deleted successfully");
          },
        },
      ]
    );
  };

  // const handleEditProduct = (product) => {
  //   navigation.navigate("AdminProductForm", { product });
  // };

  const handleToggleStock = (productId) => {
    Alert.alert("Success", "Product stock status updated");
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.productMeta}>
          <Text style={styles.productRating}>⭐ {item.rating}</Text>
          <View
            style={[
              styles.stockBadge,
              {
                backgroundColor:
                  item.stock > 0 ? COLORS.SUCCESS : COLORS.DANGER,
              },
            ]}
          >
            <Text style={styles.stockText}>
              {item.stock > 0 ? `${item.stock || 10} in stock` : "Out of stock"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.productActions}>
        {/* <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.PRIMARY }]}
          onPress={() => handleEditProduct(item)}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.WHITE} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.WARNING }]}
          onPress={() => handleToggleStock(item.id)}
        >
          <Ionicons name="eye-outline" size={20} color={COLORS.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.DANGER }]}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Manage Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AdminProductForm")}
        >
          <Ionicons name="add" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.GRAY[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.GRAY[500]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.GRAY[500]} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {products.filter((p) => (p.stock || 10) > 0).length}
          </Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {products.filter((p) => (p.stock || 10) === 0).length}
          </Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item, index) =>
          (item?.id ?? item?._id ?? index).toString()
        }
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.MEDIUM,
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
  },
  listContainer: {
    paddingBottom: SPACING.LARGE,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[200],
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.MEDIUM,
  },
  headerTitle: {
    fontSize: FONTS.SIZES.HEADING,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.GRAY[100],
    borderRadius: 8,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    marginBottom: SPACING.MEDIUM,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.SMALL,
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.DARK,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: FONTS.SIZES.TITLE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: FONTS.SIZES.SMALL,
    color: COLORS.GRAY[600],
    marginTop: SPACING.EXTRA_SMALL,
  },
  productCard: {
    backgroundColor: COLORS.WHITE,
    margin: SPACING.MEDIUM,
    borderRadius: 8,
    padding: SPACING.MEDIUM,
    flexDirection: "row",
    boxShadowColor: COLORS.BLACK,
    boxShadowOffset: { width: 0, height: 2 },
    boxShadowOpacity: 0.1,
    boxShadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: SPACING.MEDIUM,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
    marginBottom: SPACING.EXTRA_SMALL,
  },
  productCategory: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginBottom: SPACING.EXTRA_SMALL,
  },
  productPrice: {
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SMALL,
  },
  productMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productRating: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
  },
  stockBadge: {
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 2,
    borderRadius: 10,
  },
  stockText: {
    fontSize: FONTS.SIZES.SMALL,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.WHITE,
  },
  productActions: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.SMALL,
  },
});

export default AdminProductsScreen;
