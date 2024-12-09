import React from "react";
import { useCart } from "../../context/AddToCardContext";
import { Link } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";
import { motion } from "framer-motion"; // For animations

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { fetchProductImage } = useProduct();

  const getImageUrl = (fileId) => {
    return fetchProductImage(fileId);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId); // Remove item if quantity is 0 or less
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-screen bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h2
          className="text-4xl font-bold mb-4 text-gray-800"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Your Cart
        </motion.h2>
        <p className="text-lg text-gray-600">Your cart is empty.</p>
        <Link to="/Home" className="btn btn-primary mt-6">
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-14 mb-14 bg-gray-50">
      <motion.h2
        className="text-4xl font-bold mb-6 text-center text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Your Cart
      </motion.h2>
      <div className="overflow-x-auto">
        <motion.table
          className="table w-full bg-white shadow-lg rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Table Head */}
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4">Product</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Remove</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {cart.map((item) => (
              <motion.tr
                key={item.$id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-200"
              >
                <td className="p-4">
                  <img
                    src={getImageUrl(item.imageId)}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  />
                </td>
                <td className="text-lg text-gray-700 font-medium">
                  {item.title}
                </td>
                <td className="text-lg text-gray-700">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        handleQuantityChange(item.$id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        handleQuantityChange(item.$id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => removeFromCart(item.$id)}
                  >
                    Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
      {/* Summary and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-10 space-y-4 md:space-y-0">
        <button
          className="btn btn-error flex items-center justify-center px-6 py-3"
          onClick={clearCart}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M10 11v6m4-6v6M5 6h14l-1.34 10.56A2 2 0 0115.66 18H8.34a2 2 0 01-1.99-1.44L5 6z"
            />
          </svg>
          Clear Cart
        </button>
        <div className="text-right">
          <motion.h3
            className="text-3xl font-bold text-gray-900"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            Total: ${totalPrice.toFixed(2)}
          </motion.h3>
          <Link to="/checkout" className="btn btn-primary mt-4 px-8 py-4">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
