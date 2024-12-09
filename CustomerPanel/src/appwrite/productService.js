import { Client, Databases, ID, Storage } from "appwrite";

// Appwrite configuration
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT); // Your project ID

const databases = new Databases(client);
const storage = new Storage(client);

// Constant IDs for Database and Storage
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const STORAGE_ID = import.meta.env.VITE_APPWRITE_STORAGE_ID;

// Utility function for handling errors
const handleError = (error, functionName) => {
  console.log(`Error in ${functionName}: ${error.message}`);
  throw error; // Re-throw error to be handled by the calling function
};

// Create a new product in the database
export const createProduct = async (productData) => {
  try {
    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(), // Generate a unique document ID
      productData
    );
    console.log("Product created successfully:", result);
    return result;
  } catch (error) {
    handleError(error, "createProduct");
  }
};

// Upload an image to Appwrite storage
export const uploadPicture = async (image) => {
  try {
    const result = await storage.createFile(STORAGE_ID, ID.unique(), image);
    return result; // Return the upload result
  } catch (error) {
    handleError(error, "uploadPicture");
    return null; // Return null if the upload fails
  }
};

// Fetch all products from the database
export const showProducts = async () => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return result.documents; // Return the list of products
  } catch (error) {
    handleError(error, "showProducts");
    return null; // Return null if fetching products fails
  }
};

// Get a product image using the file ID
export const getImage = (fileId) => {
  try {
    const result = storage.getFileView(STORAGE_ID, fileId);
    return result.href; // Return the URL to view the image
  } catch (error) {
    handleError(error, "getImage");
  }
};

// Delete a product from the database by ID
export const deleteProduct = async (productID) => {
  try {
    const result = await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      productID
    );
    console.log("Product deleted successfully:", result);
    return result;
  } catch (error) {
    handleError(error, "deleteProduct");
  }
};

// Fetch a product by its ID
export const getProductById = async (productID) => {
  try {
    const result = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      productID
    );
    return result; // Return the product details
  } catch (error) {
    handleError(error, "getProductById");
    return null; // Return null if fetching the product fails
  }
};

// Update an existing product by ID
export const updateProduct = async (productID, updatedData) => {
  try {
    const result = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      productID,
      updatedData
    );
    console.log("Product updated successfully:", result);
    return result;
  } catch (error) {
    handleError(error, "updateProduct");
  }
};
