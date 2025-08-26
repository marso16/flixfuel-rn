import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import ApiService from "../services/api";
import {
  COLORS,
  FONTS,
  ORDER_STATUS,
  SPACING,
  USER_ROLES,
} from "../utils/constants";

const { width } = Dimensions.get("window");

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    ordersByStatus: {},
  });

  useEffect(() => {
    if (user?.role !== USER_ROLES.ADMIN) {
      navigation.goBack();
      return;
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // ------------------ Fetch Data ------------------
      const [orders, products, users] = await Promise.all([
        ApiService.getAllOrders(),
        ApiService.getAllProducts(),
        ApiService.getAllUsers(),
      ]);

      // Total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

      // Recent orders (most recent 5)
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Low stock products (stock <= 5)
      const lowStockProducts = products.filter((p) => p.stock <= 5);

      // Orders by status
      const ordersByStatus = {};
      Object.values(ORDER_STATUS).forEach((status) => {
        ordersByStatus[status] = orders.filter(
          (o) => o.status === status
        ).length;
      });

      setDashboardData({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        totalRevenue,
        recentOrders,
        lowStockProducts,
        ordersByStatus,
      });
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const renderStatCard = (title, value, icon, color, onPress) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.statCardContent}>
        <View style={styles.statCardLeft}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardValue}>{value}</Text>
        </View>
        <View style={[styles.statCardIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color={COLORS.WHITE} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickAction = (title, icon, color, onPress) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color={COLORS.WHITE} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderRecentOrder = (order) => (
    <View key={order.id} style={styles.recentOrderItem}>
      <View style={styles.recentOrderLeft}>
        <Text style={styles.recentOrderId}>{order.id}</Text>
        <Text style={styles.recentOrderCustomer}>
          {order.customerName || order.customer?.firstName}
        </Text>
      </View>
      <View style={styles.recentOrderRight}>
        <Text style={styles.recentOrderTotal}>${order.total.toFixed(2)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return COLORS.WARNING;
      case ORDER_STATUS.PROCESSING:
        return COLORS.PRIMARY;
      case ORDER_STATUS.SHIPPED:
        return COLORS.INFO;
      case ORDER_STATUS.DELIVERED:
        return COLORS.SUCCESS;
      default:
        return COLORS.GRAY[500];
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Welcome back, {user?.firstName}!
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {renderStatCard(
          "Total Orders",
          dashboardData.totalOrders,
          "receipt-outline",
          COLORS.PRIMARY,
          () => navigation.navigate("AdminOrders")
        )}
        {renderStatCard(
          "Total Products",
          dashboardData.totalProducts,
          "cube-outline",
          COLORS.SUCCESS,
          () => navigation.navigate("AdminProducts")
        )}
        {renderStatCard(
          "Total Users",
          dashboardData.totalUsers,
          "people-outline",
          COLORS.INFO,
          () => navigation.navigate("AdminUsers")
        )}
        {renderStatCard(
          "Revenue",
          `$${dashboardData.totalRevenue.toLocaleString()}`,
          "trending-up-outline",
          COLORS.WARNING,
          () => {}
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {renderQuickAction(
            "Add Product",
            "add-circle-outline",
            COLORS.SUCCESS,
            () => navigation.navigate("AdminProductForm")
          )}
          {renderQuickAction(
            "View Orders",
            "list-outline",
            COLORS.PRIMARY,
            () => navigation.navigate("AdminOrders")
          )}
          {renderQuickAction(
            "Manage Users",
            "people-outline",
            COLORS.INFO,
            () => navigation.navigate("AdminUsers")
          )}
          {renderQuickAction(
            "Analytics",
            "analytics-outline",
            COLORS.WARNING,
            () => {}
          )}
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AdminOrders")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentOrdersContainer}>
          {dashboardData.recentOrders.map(renderRecentOrder)}
        </View>
      </View>

      {/* Low Stock Alert */}
      {dashboardData.lowStockProducts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Low Stock Alert</Text>
          <View style={styles.lowStockContainer}>
            {dashboardData.lowStockProducts.map((product) => (
              <View key={product.id} style={styles.lowStockItem}>
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color={COLORS.WARNING}
                />
                <Text style={styles.lowStockText}>
                  {product.name} - Only {product.stock} left
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Order Status Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Status Overview</Text>
        <View style={styles.orderStatusContainer}>
          {Object.entries(dashboardData.ordersByStatus).map(
            ([status, count]) => (
              <View key={status} style={styles.orderStatusItem}>
                <View
                  style={[
                    styles.orderStatusDot,
                    { backgroundColor: getStatusColor(status) },
                  ]}
                />
                <Text style={styles.orderStatusLabel}>{status}</Text>
                <Text style={styles.orderStatusCount}>{count}</Text>
              </View>
            )
          )}
        </View>
      </View>
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
  },
  loadingText: {
    marginTop: SPACING.MEDIUM,
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
  },
  header: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.LARGE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[200],
  },
  headerTitle: {
    fontSize: FONTS.SIZES.LARGE_HEADING,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
  },
  headerSubtitle: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginTop: SPACING.EXTRA_SMALL,
  },
  statsContainer: {
    padding: SPACING.MEDIUM,
  },
  statCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
    borderLeftWidth: 4,
    boxShadowColor: COLORS.BLACK,
    boxShadowOffset: { width: 0, height: 2 },
    boxShadowOpacity: 0.1,
    boxShadowRadius: 4,
    elevation: 3,
  },
  statCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCardLeft: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginBottom: SPACING.EXTRA_SMALL,
  },
  statCardValue: {
    fontSize: FONTS.SIZES.HEADING,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
  },
  statCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    backgroundColor: COLORS.WHITE,
    margin: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.MEDIUM,
  },
  sectionTitle: {
    fontSize: FONTS.SIZES.TITLE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
  },
  viewAllText: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAction: {
    width: (width - SPACING.LARGE * 3) / 2,
    alignItems: "center",
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.SMALL,
  },
  quickActionText: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
    color: COLORS.DARK,
    textAlign: "center",
  },
  recentOrdersContainer: {
    gap: SPACING.SMALL,
  },
  recentOrderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[100],
  },
  recentOrderLeft: {
    flex: 1,
  },
  recentOrderId: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
    color: COLORS.DARK,
  },
  recentOrderCustomer: {
    fontSize: FONTS.SIZES.SMALL,
    color: COLORS.GRAY[600],
  },
  recentOrderRight: {
    alignItems: "flex-end",
  },
  recentOrderTotal: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.EXTRA_SMALL,
  },
  statusBadge: {
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: FONTS.SIZES.EXTRA_SMALL,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.WHITE,
  },
  lowStockContainer: {
    gap: SPACING.SMALL,
  },
  lowStockItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.SMALL,
    backgroundColor: COLORS.WARNING + "20",
    borderRadius: 6,
  },
  lowStockText: {
    marginLeft: SPACING.SMALL,
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.DARK,
  },
  orderStatusContainer: {
    gap: SPACING.SMALL,
  },
  orderStatusItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.SMALL,
  },
  orderStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.SMALL,
  },
  orderStatusLabel: {
    flex: 1,
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.DARK,
    textTransform: "capitalize",
  },
  orderStatusCount: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
    color: COLORS.PRIMARY,
  },
});

export default AdminDashboardScreen;
