import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  COLORS,
  DEFAULTS,
  FONTS,
  PAYMENT_METHODS,
  SPACING,
} from "../utils/constants";

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState(
    PAYMENT_METHODS.CREDIT_CARD
  );

  const subtotal = getCartTotal();
  const shipping = DEFAULTS.SHIPPING_COST;
  const tax = subtotal * DEFAULTS.TAX_RATE;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field, value) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];
    for (const field of required) {
      if (!shippingInfo[field]) {
        Alert.alert(
          "Error",
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to place an order", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate order placement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderData = {
        items: cartItems,
        shippingInfo,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        userId: user?.id,
      };

      // Here you would typically send the order to your backend
      console.log("Order placed:", orderData);

      clearCart();

      Alert.alert(
        "Order Placed!",
        "Your order has been placed successfully. You will receive a confirmation email shortly.",
        [
          {
            text: "View Orders",
            onPress: () => navigation.navigate("Orders"),
          },
          {
            text: "Continue Shopping",
            onPress: () => navigation.navigate("Main"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to place order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (field, placeholder, keyboardType = "default") => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{placeholder}</Text>
      <TextInput
        style={styles.input}
        value={shippingInfo[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={field === "email" ? "none" : "words"}
      />
    </View>
  );

  const renderPaymentMethod = (method, label) => (
    <TouchableOpacity
      key={method}
      style={[
        styles.paymentMethod,
        paymentMethod === method && styles.paymentMethodSelected,
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <View
        style={[styles.radio, paymentMethod === method && styles.radioSelected]}
      />
      <Text style={styles.paymentMethodText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              Qty: {item.quantity} × ${item.price.toFixed(2)}
            </Text>
            <Text style={styles.itemTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping:</Text>
            <Text style={styles.totalValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Shipping Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <View style={styles.row}>
          {renderInput("firstName", "First Name")}
          {renderInput("lastName", "Last Name")}
        </View>
        {renderInput("email", "Email Address", "email-address")}
        {renderInput("phone", "Phone Number", "phone-pad")}
        {renderInput("address", "Street Address")}
        <View style={styles.row}>
          {renderInput("city", "City")}
          {renderInput("state", "State")}
        </View>
        <View style={styles.row}>
          {renderInput("zipCode", "ZIP Code", "numeric")}
          {renderInput("country", "Country")}
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {renderPaymentMethod(PAYMENT_METHODS.CREDIT_CARD, "Credit Card")}
        {renderPaymentMethod(PAYMENT_METHODS.DEBIT_CARD, "Debit Card")}
        {renderPaymentMethod(PAYMENT_METHODS.PAYPAL, "PayPal")}
        {renderPaymentMethod(
          PAYMENT_METHODS.CASH_ON_DELIVERY,
          "Cash on Delivery"
        )}
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          isLoading && styles.placeOrderButtonDisabled,
        ]}
        onPress={handlePlaceOrder}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.WHITE} />
        ) : (
          <Text style={styles.placeOrderButtonText}>
            Place Order - ${total.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    margin: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: FONTS.SIZES.TITLE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    marginBottom: SPACING.MEDIUM,
    color: COLORS.DARK,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[200],
  },
  itemName: {
    flex: 1,
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
  },
  itemDetails: {
    fontSize: FONTS.SIZES.SMALL,
    color: COLORS.GRAY[600],
    marginRight: SPACING.SMALL,
  },
  itemTotal: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
    color: COLORS.PRIMARY,
  },
  totalsContainer: {
    marginTop: SPACING.MEDIUM,
    paddingTop: SPACING.MEDIUM,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY[200],
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.SMALL,
  },
  totalLabel: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
  },
  totalValue: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY[300],
    paddingTop: SPACING.SMALL,
    marginTop: SPACING.SMALL,
  },
  grandTotalLabel: {
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
  },
  grandTotalValue: {
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.PRIMARY,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.MEDIUM,
  },
  inputContainer: {
    flex: 1,
    marginBottom: SPACING.MEDIUM,
  },
  inputLabel: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
    marginBottom: SPACING.EXTRA_SMALL,
    color: COLORS.DARK,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.GRAY[300],
    borderRadius: 8,
    padding: SPACING.MEDIUM,
    fontSize: FONTS.SIZES.MEDIUM,
    backgroundColor: COLORS.WHITE,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[200],
  },
  paymentMethodSelected: {
    backgroundColor: COLORS.GRAY[50],
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.GRAY[400],
    marginRight: SPACING.MEDIUM,
  },
  radioSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY,
  },
  paymentMethodText: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.DARK,
  },
  placeOrderButton: {
    backgroundColor: COLORS.PRIMARY,
    margin: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    borderRadius: 8,
    alignItems: "center",
  },
  placeOrderButtonDisabled: {
    backgroundColor: COLORS.GRAY[400],
  },
  placeOrderButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
  },
});

export default CheckoutScreen;
