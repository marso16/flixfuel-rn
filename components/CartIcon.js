import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

const CartIcon = () => {
  const navigation = useNavigation();
  const { getCartItemsCount } = useCart();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Cart")}
      style={styles.container}
    >
      <Ionicons name="cart-outline" size={24} color="#000" />
      {getCartItemsCount() > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getCartItemsCount()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 5,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default CartIcon;
