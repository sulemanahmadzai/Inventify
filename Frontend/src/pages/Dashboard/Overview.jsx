import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Overview() {
  const [period, setPeriod] = useState("daily"); // Selected period
  const [chartData, setChartData] = useState([]);

  const fetchData = async (selectedPeriod) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/overview/top-products?period=${selectedPeriod}`
      );

      // Process the data to get top 5 most sold products
      const processedData = response.data.data
        .map((product) => ({
          name: product.productName,
          total: product.totalSold,
        }))
        .sort((a, b) => b.total - a.total) // Sort by totalSold in descending order
        .slice(0, 7); // Take top 5 products

      setChartData(processedData);
    } catch (error) {
      console.error("Error fetching product performance data:", error);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  return (
    <Card>
      {/* Dropdown Section */}
      <CardHeader className="items-center pb-0">
        <div className="flex justify-end w-auto mb-4 ml-0 self-end">
          <Select onValueChange={(value) => setPeriod(value)} value={period}>
            <SelectTrigger className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Period</SelectLabel>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {/* Chart Section */}
      <CardContent className="flex-1 pb-0">
        <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px] ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, bottom: 50 }}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={0} // Ensures all labels are shown
                angle={-45} // Rotates the labels for better fit
                textAnchor="end" // Aligns the rotated labels
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              {/* Add Tooltip for interactivity */}
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                }}
                cursor={{ fill: "rgba(200, 200, 200, 0.2)" }}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
