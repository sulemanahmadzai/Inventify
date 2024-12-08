import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

//for dashboard KPIS
export const fetchKPIData = async () => {
    try {
        const response = await axios.get(`${API_URL}dashboard/kpis`); // Use API_URL constant
        return response.data;
    } catch (error) {
        throw error; // Propagate error so the component can handle it
    }
};

//for overview bar chart dashboard graph
export const fetchTopProducts = async (period) => {
    try {
        const response = await axios.get(`${API_URL}overview/top-products?period=${period}`);
        const processedData = response.data.data
            .map((product) => ({
                name: product.productName,
                total: product.totalSold,
            }))
            .sort((a, b) => b.total - a.total) // Sort by totalSold in descending order
            .slice(0, 5); // Limit to top 5 products

        return processedData;
    } catch (error) {
        console.error("Error fetching product performance data:", error);
        throw error; // Re-throw error to be handled in the component
    }
};

// inventoryApi.js
export const fetchInventoryStatus = async () => {
    try {
        const response = await fetch(
            `${API_URL}overview/inventory-status`
        );
        const { data } = await response.json();

        // Format the data for Recharts
        return [
            { name: "Available", value: data.available },
            { name: "Low Stock", value: data.lowStock },
            { name: "Out of Stock", value: data.outOfStock },
        ];
    } catch (error) {
        console.error("Error fetching inventory status:", error);
        return [];
    }
};
