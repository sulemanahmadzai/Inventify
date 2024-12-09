import React from "react";
import PropTypes from "prop-types";

function Alert({ message }) {
  return (
    <div
      role="alert"
      className="alert bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="stroke-info h-6 w-6 shrink-0 inline mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

Alert.propTypes = {

  message: PropTypes.string.isRequired,
};

export default Alert;
