// App Configuration
export const APP_CONFIG = {
  NAME: "FlixFuel",
  VERSION: "1.0.0",
  API_TIMEOUT: 10000,
  PAGINATION_LIMIT: 20,
};

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: "http://localhost:3000/api",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: "/products/:id",
    SEARCH: "/products/search",
    FEATURED: "/products/featured",
    BY_CATEGORY: "/products/category/:category",
  },
  CATEGORIES: "/categories",
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders/user/:userId",
    DETAIL: "/orders/:id",
  },
  USERS: {
    PROFILE: "/users/:id",
    UPDATE: "/users/:id",
  },
  ADMIN: {
    ORDERS: "/admin/orders",
    PRODUCTS: "/admin/products",
    USERS: "/admin/users",
  },
};

// Colors
export const COLORS = {
  PRIMARY: "#007bff",
  SECONDARY: "#6c757d",
  SUCCESS: "#28a745",
  DANGER: "#dc3545",
  WARNING: "#ffc107",
  INFO: "#17a2b8",
  LIGHT: "#f8f9fa",
  DARK: "#343a40",
  WHITE: "#ffffff",
  BLACK: "#000000",
  GRAY: {
    100: "#f8f9fa",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
};

// Typography
export const FONTS = {
  SIZES: {
    EXTRA_SMALL: 10,
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 16,
    EXTRA_LARGE: 18,
    TITLE: 20,
    HEADING: 24,
    LARGE_HEADING: 32,
  },
  WEIGHTS: {
    LIGHT: "300",
    REGULAR: "400",
    MEDIUM: "500",
    SEMI_BOLD: "600",
    BOLD: "700",
    EXTRA_BOLD: "800",
  },
};

// Spacing
export const SPACING = {
  EXTRA_SMALL: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  EXTRA_LARGE: 32,
  HUGE: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  EXTRA_LARGE: 16,
  ROUND: 50,
};

// Screen Dimensions
export const SCREEN = {
  WIDTH: "100%",
  HEIGHT: "100%",
};

// Animation Durations
export const ANIMATION = {
  FAST: 200,
  MEDIUM: 300,
  SLOW: 500,
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  PAYPAL: "paypal",
  APPLE_PAY: "apple_pay",
  GOOGLE_PAY: "google_pay",
  CASH_ON_DELIVERY: "cash_on_delivery",
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  ELECTRONICS: "Electronics",
  CLOTHING: "Clothing",
  HOME: "Home",
  ACCESSORIES: "Accessories",
  SPORTS: "Sports",
  BOOKS: "Books",
  BEAUTY: "Beauty",
  TOYS: "Toys",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  USER_NOT_FOUND: "User not found.",
  PRODUCT_NOT_FOUND: "Product not found.",
  CART_EMPTY: "Your cart is empty.",
  INSUFFICIENT_STOCK: "Insufficient stock available.",
  PAYMENT_FAILED: "Payment failed. Please try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  REGISTER_SUCCESS: "Account created successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  PRODUCT_ADDED_TO_CART: "Product added to cart!",
  PRODUCT_REMOVED_FROM_CART: "Product removed from cart!",
  ORDER_PLACED: "Order placed successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  PASSWORD_CHANGED: "Password changed successfully!",
  PRODUCT_ADDED_TO_FAVORITES: "Added to favorites!",
  PRODUCT_REMOVED_FROM_FAVORITES: "Removed from favorites!",
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: "user",
  AUTH_TOKEN: "authToken",
  CART: "cart",
  FAVORITES: "favorites",
  SEARCH_HISTORY: "searchHistory",
  RECENTLY_VIEWED: "recentlyViewed",
  APP_SETTINGS: "appSettings",
};

// Default Values
export const DEFAULTS = {
  SHIPPING_COST: 5.0,
  TAX_RATE: 0.08,
  CURRENCY: "USD",
  CURRENCY_SYMBOL: "$",
  ITEMS_PER_PAGE: 10,
  MAX_CART_ITEMS: 99,
  MAX_SEARCH_HISTORY: 10,
  MAX_RECENTLY_VIEWED: 20,
};

// Feature Flags
export const FEATURES = {
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_DARK_MODE: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
};
