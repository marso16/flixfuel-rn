import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, onPress }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    width: 160,
    boxShadowColor: "#000",
    boxShadowOffset: { width: 0, height: 2 },
    boxShadowOpacity: 0.1,
    boxShadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  category: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProductCard;
