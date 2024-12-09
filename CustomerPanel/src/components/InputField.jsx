import React from "react";
import PropTypes from "prop-types";

function InputField({
  label,
  name,
  type = "text", // Default parameter for type
  value = "", // Default parameter for value
  onChange,
  placeholder = "", // Default parameter for placeholder
  accept = "", // Default parameter for accept (for file inputs)
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium " // Same text color as ProductCard
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={type !== "file" ? value : undefined} // For file input, no value binding
        onChange={onChange}
        placeholder={placeholder}
        accept={type === "file" ? accept : undefined} // Accept is used only for file input
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-base-100 focus:outline-none focus:ring-2" // Copied styles from ProductCard
      />
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "number", "file", "email","password"]).isRequired, // Validates input types
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  accept: PropTypes.string,
};

export default InputField;
