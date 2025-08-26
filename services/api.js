import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://flixfuel-server.vercel.app";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = await AsyncStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Try parsing JSON even on error to get server-provided error message
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          data?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // ---------------- Auth ----------------
  sendOTP = (userData) =>
    this.request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  verifyOTP = (otpData) =>
    this.request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(otpData),
    });
  resendOTP = (email) =>
    this.request("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  register = (userData) =>
    this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  login = (credentials) =>
    this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  getProfile = () => this.request("/auth/profile");
  updateProfile = (userData) =>
    this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  changePassword = (passwordData) =>
    this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  verifyToken = () => this.request("/auth/verify");
  forgotPassword = (email) =>
    this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  resetPassword = (resetData) =>
    this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  googleLogin = (token) =>
    this.request("/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  linkGoogleAccount = (token) =>
    this.request("/auth/link-google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  unlinkGoogleAccount = () =>
    this.request("/auth/unlink-google", { method: "DELETE" });
  logout = async () => {
    await AsyncStorage.removeItem("token");
    return { success: true };
  };

  // ---------------- Products ----------------
  getProducts = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ""}`);
  };
  getProduct = (id) => this.request(`/products/${id}`);
  getProductsByCategory = (category) =>
    this.request(`/products?category=${encodeURIComponent(category)}`);
  searchProducts = (query) =>
    this.request(`/products/search?q=${encodeURIComponent(query)}`);
  getFeaturedProducts = () => this.request("/products/featured/list");
  getCategories = () => this.request("/categories");

  // ---------------- Orders ----------------
  createOrder = (orderData) =>
    this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  getUserOrders = () => this.request("/orders/my-orders");
  getOrder = (orderId) => this.request(`/orders/${orderId}`);
  cancelOrder = (orderId) =>
    this.request(`/orders/${orderId}/cancel`, { method: "PUT" });

  // ---------------- Admin ----------------
  getAllOrders = () => this.request("/orders");
  updateOrderStatus = (orderId, status) =>
    this.request(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  deleteAllOrders = () => this.request("/orders", { method: "DELETE" });

  createProduct = (productData) =>
    this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  updateProduct = (productId, productData) =>
    this.request(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  deleteProduct = (productId) =>
    this.request(`/products/${productId}`, { method: "DELETE" });

  getAllUsers = () => this.request("/auth/users");
  deleteOneUser = (userId) =>
    this.request(`/auth/users/${userId}`, { method: "DELETE" });
  deleteAllUsers = () => this.request("/auth/users", { method: "DELETE" });
  updateUserRole = (userId, role) =>
    this.request(`/auth/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });

  // ---------------- Notifications ----------------
  getNotifications = () => this.request("/notifications");
  getUnreadCount = () => this.request("/notifications/unread-count");
  markNotificationAsRead = (id) =>
    this.request(`/notifications/${id}/read`, { method: "PATCH" });
  markMultipleNotificationsAsRead = (ids) =>
    this.request("/notifications/read", {
      method: "PATCH",
      body: JSON.stringify({ notificationIds: ids }),
    });
  markAllNotificationsAsRead = () =>
    this.request("/notifications/read-all", { method: "PATCH" });
  deleteNotification = (id) =>
    this.request(`/notifications/${id}`, { method: "DELETE" });
  deleteMultipleNotifications = (ids) =>
    this.request("/notifications", {
      method: "DELETE",
      body: JSON.stringify({ notificationIds: ids }),
    });

  // ---------------- Cart ----------------
  getUserCart = () => this.request("/cart");
  addItemToCart = (productId, quantity) =>
    this.request("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  updateCartItemQuantity = (productId, quantity) =>
    this.request("/cart/update", {
      method: "PUT",
      body: JSON.stringify({ productId, quantity }),
    });
  removeItemFromCart = (productId) =>
    this.request(`/cart/remove/${productId}`, { method: "DELETE" });
  clearCart = () => this.request("/cart/clear", { method: "DELETE" });
  getCartItemCount = () => this.request("/cart/count");

  // ---------------- Payment ----------------
  createPaymentIntent = (orderId) =>
    this.request("/payment/create-intent", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    });
  confirmPayment = (paymentIntentId, orderId) =>
    this.request("/payment/confirm", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId, orderId }),
    });
  getStripePublishableKey = () => this.request("/payment/config");
  createRefund = (orderId, amount) =>
    this.request("/payment/refund", {
      method: "POST",
      body: JSON.stringify({ orderId, amount }),
    });
  getPaymentHistory = () => this.request("/payment/history");

  // ---------------- Wishlist ----------------
  getWishlist = () => this.request("/wishlist");
  addToWishlist = (productId, notes) =>
    this.request(`/wishlist/${productId}`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  removeFromWishlist = (productId) =>
    this.request(`/wishlist/${productId}`, { method: "DELETE" });
  updateWishlist = (wishlistData) =>
    this.request("/wishlist", {
      method: "PUT",
      body: JSON.stringify(wishlistData),
    });
  generateShareToken = () =>
    this.request("/wishlist/share", { method: "POST" });
  getSharedWishlist = (token) => this.request(`/wishlist/shared/${token}`);
  checkWishlistStatus = (productId) =>
    this.request(`/wishlist/check/${productId}`);
  clearWishlist = () => this.request("/wishlist", { method: "DELETE" });
  moveToCart = (productId, quantity) =>
    this.request(`/wishlist/${productId}/move-to-cart`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });
}

export default new ApiService();
