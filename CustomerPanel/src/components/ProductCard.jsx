import React, { useContext } from "react";
import { getImage } from "../appwrite/productService";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/AddToCardContext";

function ProductCard({ product, onDelete = "", isDeleting = false }) {
  const navigate = useNavigate();
  const { roles } = useContext(AuthContext);

  const { addToCart } = useCart();
  // Handle product edit click
  const handleEditClick = () => {
    navigate(`/editProduct/${product.$id}`);
  };

  // Handle adding product to cart
  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div>
      <div className="relative card card-compact bg-base-100 w-80 shadow-xl h-full">
        <figure className="h-48">
          <img
            src={getImage(product.imageId)}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </figure>
        <div className="card-body min-h-36 flex flex-col justify-between">
          <h2 className="card-title justify-center">{product.title}</h2>
          {roles === "Admin" ? (
            <p className="flex-grow">{product.description}</p>
          ) : (
            <p className="flex justify-center font-extrabold">
              {product.price}$
            </p>
          )}
          {roles == "Admin" ? (
            <div className="card-actions mt-4 justify-between">
              <Button
                variant="primary"
                onClick={handleEditClick}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-md hover:from-indigo-600 hover:to-blue-600"
              >
                Edit
              </Button>
              <Button
                isLoading={isDeleting}
                onClick={() => onDelete(product.$id)}
                variant="danger"
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-md hover:from-indigo-600 hover:to-blue-600"
              >
                Delete
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleAddToCart} // Call the handleAddToCart function
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-md hover:from-indigo-600 hover:to-blue-600"
            >
              Add To Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
