import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS, FONTS, ORDER_STATUS, SPACING } from "../utils/constants";

const OrdersScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock orders data
  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: ORDER_STATUS.DELIVERED,
      total: 129.97,
      items: [
        { id: 1, name: "Wireless Headphones", quantity: 1, price: 99.99 },
        { id: 2, name: "Phone Case", quantity: 2, price: 14.99 },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-20",
      status: ORDER_STATUS.SHIPPED,
      total: 89.99,
      items: [{ id: 3, name: "Running Shoes", quantity: 1, price: 89.99 }],
    },
    {
      id: "ORD-003",
      date: "2024-01-25",
      status: ORDER_STATUS.PROCESSING,
      total: 199.99,
      items: [{ id: 4, name: "Smart Watch", quantity: 1, price: 199.99 }],
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to view your orders", [
        { text: "Cancel", onPress: () => navigation.goBack() },
        { text: "Login", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders(mockOrders);
    } catch (error) {
      Alert.alert("Error", "Failed to load orders");
      console.error("Load orders error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return COLORS.WARNING;
      case ORDER_STATUS.CONFIRMED:
        return COLORS.INFO;
      case ORDER_STATUS.PROCESSING:
        return COLORS.PRIMARY;
      case ORDER_STATUS.SHIPPED:
        return COLORS.SECONDARY;
      case ORDER_STATUS.DELIVERED:
        return COLORS.SUCCESS;
      case ORDER_STATUS.CANCELLED:
        return COLORS.DANGER;
      default:
        return COLORS.GRAY[500];
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderOrderItem = (order) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderCard}
      onPress={() => {
        // Navigate to order details (you can implement this screen)
        Alert.alert(
          "Order Details",
          `Order ID: ${order.id}\nStatus: ${order.status}`
        );
      }}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          >
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.itemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>Total: ${order.total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>Please login to view your orders</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No orders found</Text>
        <Text style={styles.emptySubtext}>
          Start shopping to see your orders here
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate("Products")}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>{orders.length} order(s)</Text>
      </View>

      {orders.map(renderOrderItem)}
    </ScrollView>
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
    padding: SPACING.LARGE,
  },
  header: {
    padding: SPACING.MEDIUM,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[200],
  },
  title: {
    fontSize: FONTS.SIZES.HEADING,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
  },
  subtitle: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginTop: SPACING.EXTRA_SMALL,
  },
  orderCard: {
    backgroundColor: COLORS.WHITE,
    margin: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    borderRadius: 8,
    boxShadowColor: COLORS.BLACK,
    boxShadowOffset: { width: 0, height: 2 },
    boxShadowOpacity: 0.1,
    boxShadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.MEDIUM,
  },
  orderId: {
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
  },
  orderDate: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginTop: SPACING.EXTRA_SMALL,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.EXTRA_SMALL,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONTS.SIZES.SMALL,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.WHITE,
  },
  orderItems: {
    marginBottom: SPACING.MEDIUM,
  },
  itemText: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[700],
    marginBottom: SPACING.EXTRA_SMALL,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY[200],
    paddingTop: SPACING.MEDIUM,
  },
  totalText: {
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.PRIMARY,
  },
  viewButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: 6,
  },
  viewButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
  },
  messageText: {
    fontSize: FONTS.SIZES.LARGE,
    color: COLORS.GRAY[600],
    textAlign: "center",
    marginBottom: SPACING.MEDIUM,
  },
  loadingText: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginTop: SPACING.MEDIUM,
  },
  emptyText: {
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.GRAY[600],
    textAlign: "center",
    marginBottom: SPACING.SMALL,
  },
  emptySubtext: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[500],
    textAlign: "center",
    marginBottom: SPACING.LARGE,
  },
  loginButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: 8,
  },
  loginButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
  },
  shopButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: 8,
  },
  shopButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
  },
});

export default OrdersScreen;
