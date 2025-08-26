import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS, FONTS, SPACING, USER_ROLES } from "../utils/constants";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.navigate("Main");
        },
      },
    ]);
  };

  const navigateToAdmin = () => {
    navigation.navigate("AdminDashboard");
  };

  const renderProfileField = (field, label, keyboardType = "default") => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.fieldInput}
          value={profileData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          keyboardType={keyboardType}
          autoCapitalize={field === "email" ? "none" : "words"}
        />
      ) : (
        <Text style={styles.fieldValue}>
          {profileData[field] || "Not provided"}
        </Text>
      )}
    </View>
  );

  const renderMenuItem = (
    icon,
    title,
    onPress,
    showArrow = true,
    rightComponent = null
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={COLORS.GRAY[600]} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {rightComponent ||
        (showArrow && (
          <Ionicons name="chevron-forward" size={20} color={COLORS.GRAY[400]} />
        ))}
    </TouchableOpacity>
  );

  const renderSettingItem = (title, value, onValueChange) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.GRAY[300], true: COLORS.PRIMARY }}
        thumbColor={value ? COLORS.WHITE : COLORS.GRAY[100]}
      />
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="person-circle-outline"
          size={80}
          color={COLORS.GRAY[400]}
        />
        <Text style={styles.notLoggedInText}>
          Please login to view your profile
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={COLORS.PRIMARY} />
        </View>
        <Text style={styles.userName}>
          {profileData.firstName} {profileData.lastName}
        </Text>
        <Text style={styles.userEmail}>{profileData.email}</Text>
        {user?.role === USER_ROLES.ADMIN && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        )}
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {renderProfileField("firstName", "First Name")}
        {renderProfileField("lastName", "Last Name")}
        {renderProfileField("email", "Email Address", "email-address")}
        {renderProfileField("phone", "Phone Number", "phone-pad")}

        {isEditing && (
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.WHITE} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {renderMenuItem("bag-outline", "My Orders", () =>
          navigation.navigate("Orders")
        )}
        {renderMenuItem("heart-outline", "Favorites", () =>
          Alert.alert("Coming Soon", "Favorites feature coming soon!")
        )}
        {renderMenuItem("location-outline", "Addresses", () =>
          Alert.alert("Coming Soon", "Address management coming soon!")
        )}
        {renderMenuItem("card-outline", "Payment Methods", () =>
          Alert.alert("Coming Soon", "Payment methods coming soon!")
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {renderSettingItem(
          "Push Notifications",
          notificationsEnabled,
          setNotificationsEnabled
        )}
        {renderSettingItem("Dark Mode", darkModeEnabled, setDarkModeEnabled)}
      </View>

      {/* Admin Section */}
      {user?.role === USER_ROLES.ADMIN && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin</Text>
          {renderMenuItem(
            "settings-outline",
            "Admin Dashboard",
            navigateToAdmin
          )}
          {renderMenuItem("people-outline", "Manage Users", () =>
            navigation.navigate("AdminUsers")
          )}
          {renderMenuItem("cube-outline", "Manage Products", () =>
            navigation.navigate("AdminProducts")
          )}
          {renderMenuItem("receipt-outline", "Manage Orders", () =>
            navigation.navigate("AdminOrders")
          )}
        </View>
      )}

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {renderMenuItem("help-circle-outline", "Help Center", () =>
          Alert.alert("Help", "Contact support at support@flixfuel.com")
        )}
        {renderMenuItem("document-text-outline", "Terms of Service", () =>
          Alert.alert("Terms", "Terms of Service")
        )}
        {renderMenuItem("shield-checkmark-outline", "Privacy Policy", () =>
          Alert.alert("Privacy", "Privacy Policy")
        )}
      </View>

      {/* Logout */}
      <View style={styles.section}>
        {renderMenuItem("log-out-outline", "Logout", handleLogout, false)}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FlixFuel v1.0.0</Text>
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
    padding: SPACING.LARGE,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    padding: SPACING.LARGE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[200],
  },
  avatarContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  userName: {
    fontSize: FONTS.SIZES.HEADING,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
    marginBottom: SPACING.EXTRA_SMALL,
  },
  userEmail: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[600],
  },
  adminBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.EXTRA_SMALL,
    borderRadius: 12,
    marginTop: SPACING.SMALL,
  },
  adminBadgeText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.SMALL,
    fontWeight: FONTS.WEIGHTS.BOLD,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    marginTop: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
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
  editButton: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  editButtonText: {
    color: COLORS.PRIMARY,
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
  },
  fieldContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  fieldLabel: {
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
    color: COLORS.DARK,
    marginBottom: SPACING.EXTRA_SMALL,
  },
  fieldValue: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.GRAY[700],
    paddingVertical: SPACING.SMALL,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: COLORS.GRAY[300],
    borderRadius: 8,
    padding: SPACING.MEDIUM,
    fontSize: FONTS.SIZES.MEDIUM,
    backgroundColor: COLORS.WHITE,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MEDIUM,
    borderRadius: 8,
    alignItems: "center",
    marginTop: SPACING.MEDIUM,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.GRAY[400],
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[100],
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.DARK,
    marginLeft: SPACING.MEDIUM,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY[100],
  },
  settingText: {
    fontSize: FONTS.SIZES.MEDIUM,
    color: COLORS.DARK,
  },
  notLoggedInText: {
    fontSize: FONTS.SIZES.LARGE,
    color: COLORS.GRAY[600],
    textAlign: "center",
    marginTop: SPACING.MEDIUM,
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
  footer: {
    alignItems: "center",
    padding: SPACING.LARGE,
  },
  footerText: {
    fontSize: FONTS.SIZES.SMALL,
    color: COLORS.GRAY[500],
  },
});

export default ProfileScreen;
