import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, Typography } from "@mui/material"; // Material UI components
import { fetchInventoryStatus } from "../../API/Dashboard/dashboardAPIs";

export function InventoryStatus() {
    const [inventoryData, setInventoryData] = useState([]);
    const [key, setKey] = useState(0); // State for key to force a re-render of the chart
    const [isLoading, setIsLoading] = useState(true); // State for controlling the loading delay

    // ShadCN color variables or the color you want from the bar chart
    const COLORS = [
        "#3f51b5", // Available - Blue
        "#ff9800", // Low Stock - Orange
        "#f44336", // Out of Stock - Red
    ];

    // Fetch inventory status from the backend
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchInventoryStatus(); // Use the imported API function
            setInventoryData(data);
        };

        fetchData();

        // After 5 seconds, change isLoading to false to display the chart
        setTimeout(() => {
            setIsLoading(false);
        }, 1000); // 5000 ms = 5 seconds
    }, []);

    return (
        <Card sx={{ mt: 4, ml: 4, backgroundColor: 'charts.bg' }}>
            <CardHeader sx={{ paddingBottom: 0 }}>
                <Typography variant="h6">Inventory Status</Typography>
                <Typography variant="body2" color="text.secondary">
                    Current stock overview
                </Typography>
            </CardHeader>

            {/* Add Heading above the Pie Chart */}
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: 'charts.heading' }}>
                    Inventory Status Distribution
                </Typography>

                {/* Show chart after 5 seconds */}
                {isLoading ? (
                    <Typography variant="body1" color="text.secondary">...</Typography>
                ) : (
                    <div style={{ width: "100%", height: 300 }}>
                        {/* Set the key of the ResponsiveContainer to trigger a re-render when data changes */}
                        <ResponsiveContainer key={key} width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={inventoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                >
                                    {inventoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]} // Use the COLORS array
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
