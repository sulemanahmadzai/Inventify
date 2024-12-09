import React, { useEffect, useState } from "react";
import { showProducts } from "../../appwrite/productService";
import ProductCard from "../../components/ProductCard";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const getStoredProducts = () => {
    const storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : null;
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const localStorageProducts = getStoredProducts();

        if (localStorageProducts) {
          setProducts(localStorageProducts);
        } else {
          const docs = await showProducts();
          setProducts(docs);
          localStorage.setItem("products", JSON.stringify(docs));
        }
      } catch (error) {
        console.error(`Error fetching products: ${error}`);
        setError(`Failed to fetch products: ${error.message}`);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleAddToCart = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error shadow-lg max-w-md">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-base-100">
      <motion.h1
        className="text-5xl font-bold text-center mb-12 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Discover Our Collection
      </motion.h1>

      {isLoadingProducts ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiLoader className="animate-spin text-primary text-6xl" />
            <p className="text-primary text-xl font-semibold">
              Loading products...
            </p>
          </motion.div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-xl text-gray-500">No products available.</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) =>
            product && product.$id ? (
              <motion.div
                key={product.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </motion.div>
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

export default Home;
