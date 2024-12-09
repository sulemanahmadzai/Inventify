import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function InventoryStatus() {
  const [inventoryData, setInventoryData] = useState([]);

  // Fetch inventory status from the backend
  useEffect(() => {
    const fetchInventoryStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/dashboard/inventory-status"
        );
        const { data } = await response.json();

        // Format the data with color fills
        setInventoryData([
          {
            name: "Available",
            value: data.available,
            fill: "hsl(var(--chart-1))",
          },
          {
            name: "Low Stock",
            value: data.lowStock,
            fill: "hsl(var(--chart-2))",
          },
          {
            name: "Out of Stock",
            value: data.outOfStock,
            fill: "hsl(var(--chart-3))",
          },
        ]);
      } catch (error) {
        console.error("Error fetching inventory status:", error);
      }
    };

    fetchInventoryStatus();
  }, []);

  return (
    <Card className="flex flex-col mt-10 ml-10">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Current stock overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full h-[300px]">
          <ResponsiveContainer>
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
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
