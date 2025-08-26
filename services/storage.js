import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageService {
  // Generic storage methods
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Error storing data:", error);
      throw error;
    }
  }

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing data:", error);
      throw error;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  }

  // User-specific methods
  async setUser(userData) {
    return this.setItem("user", userData);
  }

  async getUser() {
    return this.getItem("user");
  }

  async removeUser() {
    return this.removeItem("user");
  }

  // Cart-specific methods
  async setCart(cartData) {
    return this.setItem("cart", cartData);
  }

  async getCart() {
    return this.getItem("cart");
  }

  async removeCart() {
    return this.removeItem("cart");
  }

  // Auth token methods
  async setAuthToken(token) {
    return this.setItem("authToken", token);
  }

  async getAuthToken() {
    return this.getItem("authToken");
  }

  async removeAuthToken() {
    return this.removeItem("authToken");
  }

  // App settings methods
  async setSettings(settings) {
    return this.setItem("appSettings", settings);
  }

  async getSettings() {
    return this.getItem("appSettings");
  }

  // Search history methods
  async addSearchHistory(query) {
    try {
      const history = (await this.getItem("searchHistory")) || [];
      const updatedHistory = [
        query,
        ...history.filter((item) => item !== query),
      ].slice(0, 10);
      await this.setItem("searchHistory", updatedHistory);
    } catch (error) {
      console.error("Error adding search history:", error);
    }
  }

  async getSearchHistory() {
    return this.getItem("searchHistory") || [];
  }

  async clearSearchHistory() {
    return this.removeItem("searchHistory");
  }

  // Recently viewed products
  async addRecentlyViewed(product) {
    try {
      const recent = (await this.getItem("recentlyViewed")) || [];
      const updatedRecent = [
        product,
        ...recent.filter((item) => item.id !== product.id),
      ].slice(0, 20);
      await this.setItem("recentlyViewed", updatedRecent);
    } catch (error) {
      console.error("Error adding recently viewed:", error);
    }
  }

  async getRecentlyViewed() {
    return this.getItem("recentlyViewed") || [];
  }

  // Favorites/Wishlist
  async addToFavorites(product) {
    try {
      const favorites = (await this.getItem("favorites")) || [];
      if (!favorites.find((item) => item.id === product.id)) {
        favorites.push(product);
        await this.setItem("favorites", favorites);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  }

  async removeFromFavorites(productId) {
    try {
      const favorites = (await this.getItem("favorites")) || [];
      const updatedFavorites = favorites.filter(
        (item) => item.id !== productId
      );
      await this.setItem("favorites", updatedFavorites);
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  }

  async getFavorites() {
    return this.getItem("favorites") || [];
  }

  async isFavorite(productId) {
    try {
      const favorites = await this.getFavorites();
      return favorites.some((item) => item.id === productId);
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  }
}

export default new StorageService();
