import React, { useState } from "react";
import { useCart } from "../../context/AddToCardContext";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";
import { motion } from "framer-motion"; // For animations
import { useOrder } from "../../context/OrderContext";

const CheckOut = () => {
  const { cart, clearCart } = useCart();
  const { fetchProductImage } = useProduct();
  const navigate = useNavigate();
  const { addOrder } = useOrder();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "Credit Card",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate a unique order ID (for example, using current timestamp)
    const orderId = Date.now().toString();

    // Calculate total amount including shipping and tax
    const shippingCost = 5.0;
    const tax = totalPrice * 0.08;
    const totalAmount = totalPrice + shippingCost + tax;

    // Create the order object
    const order = {
      orderId: orderId,
      date: new Date().toISOString(),
      status: "Processing",
      totalAmount: totalAmount,
      paymentMethod: shippingInfo.paymentMethod,
      shippingAddress: {
        fullName: shippingInfo.fullName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
      },
      items: cart.map((item) => ({
        id: item.$id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        imageId: item.imageId,
      })),
    };

    // Add the order to the orders context
    addOrder(order);

    // Simulate form submission delay
    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      navigate("/order-success");
    }, 2000);
  };

  return (
    <div className="container mx-auto p-4 mt-10 mb-10">
      <motion.h2
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Checkout
      </motion.h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Information */}
        <div className="w-full lg:w-2/3">
          <motion.div
            className="card bg-base-100 shadow-xl"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="card-body">
              <h3 className="text-2xl font-semibold mb-4">
                Shipping Information
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="John Doe"
                    required
                  />
                </div>
                {/* Email Address */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                {/* Address */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="123 Main St"
                    required
                  />
                </div>
                {/* City and Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Postal Code</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
                {/* Country */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="United States"
                    required
                  />
                </div>
                {/* Payment Method */}
                <div className="form-control mt-6">
                  <label className="label">
                    <span className="label-text">Payment Method</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="paymentMethod"
                    value={shippingInfo.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                {/* Place Order Button */}
                <button
                  type="submit"
                  className={`btn btn-primary w-full mt-8 ${
                    isSubmitting ? "loading" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <motion.div
            className="card bg-base-100 shadow-xl sticky top-20"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="card-body">
              <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.$id} className="flex items-center">
                    <div className="avatar mr-4">
                      <div className="w-16 h-16 rounded">
                        <img
                          src={fetchProductImage(item.imageId)}
                          alt={item.title}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider"></div>
              {/* Total Price */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Subtotal:</span>
                <span className="text-lg font-semibold">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Shipping:</span>
                <span className="text-lg font-semibold">$5.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Tax:</span>
                <span className="text-lg font-semibold">
                  ${(totalPrice * 0.08).toFixed(2)}
                </span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-xl font-bold">
                  ${(totalPrice + 5 + totalPrice * 0.08).toFixed(2)}
                </span>
              </div>
              {/* Continue Shopping Button */}
              <button
                className="btn btn-outline w-full mt-6"
                onClick={() => navigate("/Home")}
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
