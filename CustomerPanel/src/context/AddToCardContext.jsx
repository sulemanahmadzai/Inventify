import { createContext, useState, useEffect, useContext } from "react";

export const AddToCardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage (optional, for persistence)
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Save cart to localStorage (optional, for persistence)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.$id === product.$id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.$id === product.$id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.$id !== productId));
  };

  // Change product quantity
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.$id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <AddToCardContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </AddToCardContext.Provider>
  );
};

// Custom hook to use the CartContext
export function useCart() {
  return useContext(AddToCardContext);
}
