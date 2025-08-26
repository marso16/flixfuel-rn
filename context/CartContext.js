import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload || [],
      };
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) => (item._id || item.id) === (action.payload._id || action.payload.id)
      );
      let newItems;

      if (existingItem) {
        newItems = state.items.map((item) =>
          (item._id || item.id) === (action.payload._id || action.payload.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      // Save to async storage
      AsyncStorage.setItem("cart", JSON.stringify(newItems));

      return {
        ...state,
        items: newItems,
      };

    case "REMOVE_FROM_CART":
      const filteredItems = state.items.filter(
        (item) => (item._id || item.id) !== action.payload
      );
      AsyncStorage.setItem("cart", JSON.stringify(filteredItems));
      return {
        ...state,
        items: filteredItems,
      };

    case "UPDATE_QUANTITY":
      const updatedItems = state.items.map((item) =>
        (item._id || item.id) === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      AsyncStorage.setItem("cart", JSON.stringify(updatedItems));
      return {
        ...state,
        items: updatedItems,
      };

    case "CLEAR_CART":
      AsyncStorage.removeItem("cart");
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, { items: [] });

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      if (cartData) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(cartData) });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: productId, quantity },
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartTotal = () => {
    return cartState.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemsCount = () => {
    return cartState.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cartState.items,
        loadCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
