import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Alert from "../../components/Alert";
import { useProduct } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom"; // To navigate after adding

function AddProduct() {
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);
  let [stockQuantity, setStockQuantity] = useState("");
  let [file, setFile] = useState();
  let [loading, setLoading] = useState(false);
  let [showAlert, setShowAlert] = useState(false);

  const { addProduct, uploadProductImage } = useProduct();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!file) {
      setShowAlert(true);
      setLoading(false);
      return;
    }

    setShowAlert(false);

    try {
      // Wait for the image to upload and get the result
      const imageResponse = await uploadProductImage(file);

      if (imageResponse && imageResponse.$id) {
        const sku = uuidv4();
        const imageId = imageResponse.$id; // Get the file ID from the upload response

        // Convert price to a float
        const formattedPrice = parseFloat(price);

        // Create a new product object with the correct price format
        const newProduct = {
          title: title,
          description: description,
          price: formattedPrice, // Ensure price is a float
          stockQuantity: parseFloat(stockQuantity),
          SKU: sku,
          imageId: imageId,
        };

        // Add the product to the database and context
        await addProduct(newProduct);

        console.log("Product added successfully");

        // Optionally navigate back to the product list or reset form
        navigate("/products"); // Navigate to product list
      } else {
        console.error("Image upload failed.");
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6  text-center text-indigo-500">
          Add New Product
        </h2>

        {showAlert && <Alert message="Product image is required!" />}

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
          isLoading={loading}
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-md hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default AddProduct;
