import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Alert from "../../components/Alert";
import { useParams } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";

function EditProduct() {
  const { id } = useParams();
  const { fetchProductById, modifyProduct, uploadProductImage } = useProduct();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [file, setFile] = useState(null);
  const [imageId, setImageId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(id);
        if (fetchedProduct) {
          setTitle(fetchedProduct.title || "");
          setDescription(fetchedProduct.description || "");
          setPrice(fetchedProduct.price || 0);
          setStockQuantity(fetchedProduct.stockQuantity || 0);
          setImageId(fetchedProduct.imageId || null);
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, fetchProductById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let uploadedImageId = imageId;

      if (file) {
        const imageUploadResult = await uploadProductImage(file);
        if (imageUploadResult && imageUploadResult.$id) {
          uploadedImageId = imageUploadResult.$id;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const updatedData = {
        title,
        description,
        price: parseFloat(price),
        stockQuantity: parseFloat(stockQuantity),
        imageId: uploadedImageId,
      };

      await modifyProduct(id, updatedData);
      setSuccessMessage("Product updated successfully!");
    } catch (error) {
      setError("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || updating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2 mb-4">
            <span className="loading loading-ball loading-xs animate-bounce"></span>
            <span className="loading loading-ball loading-sm animate-bounce delay-100"></span>
            <span className="loading loading-ball loading-md animate-bounce delay-200"></span>
            <span className="loading loading-ball loading-lg animate-bounce delay-300"></span>
          </div>
          <p className="text-indigo-300 text-lg animate-pulse">
            {updating ? "Updating product..." : "Loading product details..."}
          </p>
          <p className="text-indigo-400 text-sm animate-pulse">
            Please wait, this won't take long!
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-indigo-500 text-center">
          Edit Product
        </h2>
        {error && <Alert message={error} />}
        {successMessage && <Alert message={successMessage} />}
        <InputField
          label="Title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title"
          className="text-gray-300"
        />
        <InputField
          label="Description"
          name="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description"
          className="text-gray-300"
        />
        <InputField
          label="Price"
          name="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Product price"
          className="text-gray-300"
        />
        <InputField
          label="Stock Quantity"
          name="stockQuantity"
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          placeholder="Available stock quantity"
          className="text-gray-300"
        />
        <InputField
          label="Product Image"
          name="image"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*"
          className="text-gray-300"
        />
        <Button
          type="submit"
          isLoading={updating}
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-md hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default EditProduct;
