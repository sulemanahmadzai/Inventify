import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrder } from "../../context/OrderContext";
import { useProduct } from "../../context/ProductContext";

export const ViewOrder = () => {
  const { orders } = useOrder();
  const { fetchProductImage } = useProduct();
  const navigate = useNavigate();

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-3xl font-bold mb-4">No Orders Found</h2>
        <p className="mb-6">You haven't placed any orders yet.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products")}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-10 mb-10">
      <motion.h2
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        My Orders
      </motion.h2>
      <div className="space-y-8">
        {orders.map((order) => (
          <motion.div
            key={order.orderId}
            className="card bg-base-100 shadow-xl overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-2xl font-semibold">
                    Order #{order.orderId}
                  </h3>
                  <p className="text-gray-500">
                    Placed on: {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`badge ${
                    order.status === "Delivered"
                      ? "badge-success"
                      : "badge-info"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Total Amount:</p>
                  <p className="text-xl font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => toggleOrderDetails(order.orderId)}
                >
                  {expandedOrderId === order.orderId
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </div>
              <AnimatePresence>
                {expandedOrderId === order.orderId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center">
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
                            <p className="text-sm text-gray-500">
                              Price: ${item.price.toFixed(2)}
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
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold">
                        Shipping Address
                      </h4>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold">Payment Method</h4>
                      <p>{order.paymentMethod}</p>
                    </div>
                    <div className="card-actions">
                      {order.status !== "Delivered" && (
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            navigate(`/orders/track/${order.orderId}`)
                          }
                        >
                          Track Order
                        </button>
                      )}
                      <button
                        className="btn btn-secondary ml-2"
                        onClick={() => navigate("/home")}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
