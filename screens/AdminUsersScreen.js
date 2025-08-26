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
import { COLORS, FONTS, SPACING, USER_ROLES } from "../utils/constants";

const AdminUsersScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      role: USER_ROLES.CUSTOMER,
      joinDate: "2024-01-15",
      isActive: true,
      totalOrders: 5,
      totalSpent: 450.75,
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      role: USER_ROLES.CUSTOMER,
      joinDate: "2024-01-20",
      isActive: true,
      totalOrders: 3,
      totalSpent: 289.99,
    },
    {
      id: 3,
      firstName: "Admin",
      lastName: "User",
      email: "admin@flixfuel.com",
      phone: "+1234567892",
      role: USER_ROLES.ADMIN,
      joinDate: "2024-01-01",
      isActive: true,
      totalOrders: 0,
      totalSpent: 0,
    },
    {
      id: 4,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@example.com",
      phone: "+1234567893",
      role: USER_ROLES.CUSTOMER,
      joinDate: "2024-01-25",
      isActive: false,
      totalOrders: 1,
      totalSpent: 99.99,
    },
  ];

  const roleOptions = [
    { value: "all", label: "All Users" },
    { value: USER_ROLES.CUSTOMER, label: "Customers" },
    { value: USER_ROLES.ADMIN, label: "Admins" },
  ];

  useEffect(() => {
    if (user?.role !== USER_ROLES.ADMIN) {
      navigation.goBack();
      return;
    }
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedRole, users]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      Alert.alert("Error", "Failed to load users");
      console.error("Load users error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleToggleUserStatus = (userId, currentStatus) => {
    const action = currentStatus ? "deactivate" : "activate";
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${action} this user?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === userId
                  ? { ...user, isActive: !currentStatus }
                  : user
              )
            );
            Alert.alert("Success", `User ${action}d successfully`);
          },
        },
      ]
    );
  };

  const handleChangeUserRole = (userId, currentRole) => {
    const newRole =
      currentRole === USER_ROLES.ADMIN ? USER_ROLES.CUSTOMER : USER_ROLES.ADMIN;
    Alert.alert("Change User Role", `Change user role to ${newRole}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Change",
        onPress: () => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, role: newRole } : user
            )
          );
          Alert.alert("Success", "User role updated successfully");
        },
      },
    ]);
  };

  const handleDeleteUser = (userId) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== userId)
            );
            Alert.alert("Success", "User deleted successfully");
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={24} color={COLORS.WHITE} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userPhone}>{item.phone}</Text>
        </View>
        <View style={styles.userStatus}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.isActive ? COLORS.SUCCESS : COLORS.DANGER,
              },
            ]}
          >
            <Text style={styles.statusText}>
              {item.isActive ? "ACTIVE" : "INACTIVE"}
            </Text>
          </View>
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor:
                  item.role === USER_ROLES.ADMIN
                    ? COLORS.WARNING
                    : COLORS.PRIMARY,
              },
            ]}
          >
            <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalOrders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${item.totalSpent.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDate(item.joinDate)}</Text>
          <Text style={styles.statLabel}>Joined</Text>
        </View>
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.PRIMARY }]}
          onPress={() =>
            Alert.alert(
              "User Details",
              `Name: ${item.firstName} ${item.lastName}\nEmail: ${item.email}\nRole: ${item.role}`
            )
          }
        >
          <Ionicons name="eye-outline" size={16} color={COLORS.WHITE} />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: item.isActive ? COLORS.WARNING : COLORS.SUCCESS,
            },
          ]}
          onPress={() => handleToggleUserStatus(item.id, item.isActive)}
        >
          <Ionicons
            name={item.isActive ? "pause-outline" : "play-outline"}
            size={16}
            color={COLORS.WHITE}
          />
          <Text style={styles.actionButtonText}>
            {item.isActive ? "Deactivate" : "Activate"}
          </Text>
        </TouchableOpacity>

        {item.id !== user?.id && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.INFO }]}
              onPress={() => handleChangeUserRole(item.id, item.role)}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={16}
                color={COLORS.WHITE}
              />
              <Text style={styles.actionButtonText}>Role</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.DANGER }]}
              onPress={() => handleDeleteUser(item.id)}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.WHITE} />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Manage Users</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.GRAY[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
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
          data={roleOptions}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedRole === item.value && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedRole(item.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedRole === item.value && styles.filterButtonTextActive,
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
          <Text style={styles.statValue}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {users.filter((user) => user.isActive).length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {users.filter((user) => user.role === USER_ROLES.ADMIN).length}
          </Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
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
  userCard: {
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
  userHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.MEDIUM,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MEDIUM,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
  },
  userEmail: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginTop: SPACING.EXTRA_SMALL,
  },
  userPhone: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
    marginTop: SPACING.EXTRA_SMALL,
  },
  userStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: SPACING.EXTRA_SMALL,
  },
  statusText: {
    fontSize: FONTS.SIZES.EXTRA_SMALL,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.WHITE,
  },
  roleBadge: {
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleText: {
    fontSize: FONTS.SIZES.EXTRA_SMALL,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.WHITE,
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY[200],
  },
  userActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SMALL,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.EXTRA_SMALL,
    borderRadius: 6,
    marginBottom: SPACING.EXTRA_SMALL,
  },
  actionButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.SMALL,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
    marginLeft: SPACING.EXTRA_SMALL,
  },
});

export default AdminUsersScreen;
