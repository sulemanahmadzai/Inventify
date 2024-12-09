import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createProduct,
  showProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadPicture,
  getImage,
} from "../appwrite/productService";

const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products and update the state
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await showProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new product
  const addProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      return newProduct; // Return the new product with $id
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update a product by ID
  const modifyProduct = async (productId, updatedData) => {
    try {
      const updatedProduct = await updateProduct(productId, updatedData);
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.$id === productId ? updatedProduct : p))
      );
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete a product by ID
  const removeProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.$id !== productId)
      );
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Upload a picture and return the file result
  const uploadProductImage = async (image) => {
    try {
      return await uploadPicture(image);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get product image by fileId
  const fetchProductImage = (fileId) => {
    try {
      return getImage(fileId);
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  // Get a single product by ID
  const fetchProductById = async (productId) => {
    try {
      return await getProductById(productId);
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        modifyProduct,
        removeProduct,
        uploadProductImage,
        fetchProductImage,
        fetchProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
