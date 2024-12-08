import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5000/api/inventory/';

// Fetch inventory items with pagination support
export const fetchInventory = async (page = 1, inventoryId = '', productName = '', category = '', quantity = '', sortBy = '') => {
    try {
        // Construct the API URL with query parameters for pagination
        const response = await axios.get(API_URL, {
            params: {
                page,
                inventoryId,
                productName,
                category,
                quantity,
                sortBy
            },
        });
        // Check if data is returned and return the inventory data
        return response.data || [];  // Return data or empty array if no data
    } catch (error) {
        console.error('Error fetching inventory data', error);
        throw error;  // You can also return a fallback value like []
    }
};


// API call to add a new product
export const addProduct = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}add`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; // Return response data from the API
    } catch (error) {
        console.error("Error adding product:", error);
        throw error; // Re-throw error to be handled in the calling component
    }
};

// You can add other API functions here like updating or deleting products


