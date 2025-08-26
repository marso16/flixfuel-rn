import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  COLORS,
  FONTS,
  ORDER_STATUS,
  SPACING,
  USER_ROLES,
} from "../utils/constants";

const AdminOrdersScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Mock orders data
  const mockOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      date: "2024-01-15",
      status: ORDER_STATUS.PENDING,
      total: 129.97,
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 99.99 },
        { name: "Phone Case", quantity: 2, price: 14.99 },
      ],
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      date: "2024-01-20",
      status: ORDER_STATUS.SHIPPED,
      total: 89.99,
      items: [{ name: "Running Shoes", quantity: 1, price: 89.99 }],
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      email: "bob@example.com",
      date: "2024-01-25",
      status: ORDER_STATUS.DELIVERED,
      total: 199.99,
      items: [{ name: "Smart Watch", quantity: 1, price: 199.99 }],
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      email: "alice@example.com",
      date: "2024-01-28",
      status: ORDER_STATUS.PROCESSING,
      total: 159.98,
      items: [{ name: "Bluetooth Speaker", quantity: 2, price: 79.99 }],
    },
  ];

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: ORDER_STATUS.PENDING, label: "Pending" },
    { value: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
    { value: ORDER_STATUS.PROCESSING, label: "Processing" },
    { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
    { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
    { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
  ];

  useEffect(() => {
    if (user?.role !== USER_ROLES.ADMIN) {
      navigation.goBack();
      return;
    }
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, selectedStatus, orders]);

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

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    Alert.alert("Update Order Status", `Change order status to ${newStatus}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: () => {
          // Here you would call your API to update the order status
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === orderId ? { ...order, status: newStatus } : order
            )
          );
          Alert.alert("Success", "Order status updated successfully");
        },
      },
    ]);
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

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.orderHeaderRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.customer}</Text>
        <Text style={styles.customerEmail}>{item.email}</Text>
      </View>

      <View style={styles.orderItems}>
        <Text style={styles.itemsTitle}>Items:</Text>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.name} - $
            {orderItem.price.toFixed(2)}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>Total: ${item.total.toFixed(2)}</Text>
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.PRIMARY }]}
            onPress={() =>
              Alert.alert(
                "Order Details",
                `Order ID: ${item.id}\nCustomer: ${item.customer}\nTotal: $${item.total}`
              )
            }
          >
            <Ionicons name="eye-outline" size={16} color={COLORS.WHITE} />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>

          {item.status === ORDER_STATUS.PENDING && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.SUCCESS }]}
              onPress={() =>
                handleUpdateOrderStatus(item.id, ORDER_STATUS.CONFIRMED)
              }
            >
              <Ionicons
                name="checkmark-outline"
                size={16}
                color={COLORS.WHITE}
              />
              <Text style={styles.actionButtonText}>Confirm</Text>
            </TouchableOpacity>
          )}

          {item.status === ORDER_STATUS.CONFIRMED && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.INFO }]}
              onPress={() =>
                handleUpdateOrderStatus(item.id, ORDER_STATUS.PROCESSING)
              }
            >
              <Ionicons name="time-outline" size={16} color={COLORS.WHITE} />
              <Text style={styles.actionButtonText}>Process</Text>
            </TouchableOpacity>
          )}

          {item.status === ORDER_STATUS.PROCESSING && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: COLORS.SECONDARY },
              ]}
              onPress={() =>
                handleUpdateOrderStatus(item.id, ORDER_STATUS.SHIPPED)
              }
            >
              <Ionicons
                name="airplane-outline"
                size={16}
                color={COLORS.WHITE}
              />
              <Text style={styles.actionButtonText}>Ship</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Manage Orders</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.GRAY[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders..."
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

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={statusOptions}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === item.value && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedStatus(item.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === item.value &&
                    styles.filterButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {
              orders.filter((order) => order.status === ORDER_STATUS.PENDING)
                .length
            }
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
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
  headerTitle: {
    fontSize: FONTS.SIZES.HEADING,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
    marginBottom: SPACING.MEDIUM,
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
  filterContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  filterButton: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: 20,
    backgroundColor: COLORS.GRAY[100],
    marginRight: SPACING.SMALL,
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterButtonText: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
  },
  filterButtonTextActive: {
    color: COLORS.WHITE,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
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
  orderCard: {
    backgroundColor: COLORS.WHITE,
    margin: SPACING.MEDIUM,
    borderRadius: 8,
    padding: SPACING.MEDIUM,
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
  orderHeaderLeft: {
    flex: 1,
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
  orderHeaderRight: {
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
  customerInfo: {
    marginBottom: SPACING.MEDIUM,
  },
  customerName: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
    color: COLORS.DARK,
  },
  customerEmail: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginTop: SPACING.EXTRA_SMALL,
  },
  orderItems: {
    marginBottom: SPACING.MEDIUM,
  },
  itemsTitle: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
    color: COLORS.DARK,
    marginBottom: SPACING.EXTRA_SMALL,
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
  orderActions: {
    flexDirection: "row",
    gap: SPACING.SMALL,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.EXTRA_SMALL,
    borderRadius: 6,
  },
  actionButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.SMALL,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
    marginLeft: SPACING.EXTRA_SMALL,
  },
});

export default AdminOrdersScreen;
