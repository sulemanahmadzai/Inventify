import React, { useState } from "react";
import { useProduct } from "../../context/ProductContext";
import ProductCard from "../../components/ProductCard";
import { FiLoader } from "react-icons/fi";

function ListProduct() {
  const { products, loading, error, removeProduct } = useProduct();
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleDelete = async (productId) => {
    try {
      setDeletingProductId(productId);
      await removeProduct(productId);
      setDeletingProductId(null);
    } catch (error) {
      console.error(`Error deleting product: ${error}`);
      // Handle error appropriately
      setDeletingProductId(null);
    }
  };

  const handleAddToCart = (product) => {
    // Your addToCart logic here
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen p-8 bg-base-100">
      {error && (
        <div className="alert alert-error shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
        Our Product List
      </h1>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <FiLoader className="animate-spin text-primary text-6xl" />
            <p className="text-primary text-xl font-semibold">
              Loading products...
            </p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-xl text-gray-500">No products available.</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) =>
            product && product.$id ? (
              <ProductCard
                key={product.$id}
                product={product}
                onDelete={handleDelete}
                isDeleting={deletingProductId === product.$id}
                onAddToCart={handleAddToCart}
              />
            ) : null
          )}
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 right-0 m-4">
          <div className="toast toast-bottom bg-green-500 text-white px-4 py-3 rounded-lg shadow-md">
            <span className="font-semibold">Success:</span> Product added to
            cart!
          </div>
        </div>
      )}
    </div>
  );
}

export default ListProduct;
