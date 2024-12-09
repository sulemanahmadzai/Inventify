import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <motion.div
        className="card w-full max-w-md bg-base-100 shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="card-body items-center text-center">
          <svg
            className="w-24 h-24 text-green-500 mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
          <p className="mt-2">Thank you for your purchase.</p>
          <div className="card-actions mt-6">
            <Link to="/home" className="btn btn-primary">
              Return to Home
            </Link>
            <Link to="/viewOrder" className="btn btn-secondary ml-2">
              View Orders
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
