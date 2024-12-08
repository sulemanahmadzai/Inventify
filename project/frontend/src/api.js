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

// Delete an inventory item by id
export const deleteInventoryItem = async (id) => {
    try {
        await axios.delete(`${API_URL}${id}`);
    } catch (error) {
        console.error('Error deleting inventory item', error);
        throw error;
    }
};

// You can add more functions here as needed, for example, for creating or updating items.
