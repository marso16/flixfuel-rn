const API_BASE_URL = "https://flixfuel-server.vercel.app";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // Products endpoints
  async getProducts() {
    return this.request("/products");
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getProductsByCategory(category) {
    return this.request(`/products?category=${category}`);
  }

  async searchProducts(query) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getFeaturedProducts() {
    return this.request("/products/featured");
  }

  async getCategories() {
    return this.request("/categories");
  }

  // Orders endpoints
  async createOrder(orderData) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(userId) {
    return this.request(`/orders/user/${userId}`);
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  // User endpoints
  async getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }

  async updateUserProfile(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Admin endpoints
  async getAllOrders() {
    return this.request("/admin/orders");
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async createProduct(productData) {
    return this.request("/admin/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId, productData) {
    return this.request(`/admin/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/admin/products/${productId}`, {
      method: "DELETE",
    });
  }

  async getAllUsers() {
    return this.request("/admin/users");
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }
}

export default new ApiService();
