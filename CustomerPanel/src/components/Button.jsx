import React from "react";
import PropTypes from "prop-types";

function Button({
  onClick,
  isLoading = false,
  children,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  ...rest
}) {
  const buttonClass = `btn btn-${variant} ${className}`.trim();

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={buttonClass}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default React.memo(Button);
