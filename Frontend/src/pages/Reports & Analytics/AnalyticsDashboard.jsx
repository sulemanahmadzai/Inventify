import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert } from "../../components/ui/alert";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import { Line } from "react-chartjs-2"; // Assuming you're still using Chart.js for charts
import axios from "axios";

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [salesTrends, setSalesTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch Key Metrics
    axios.get("/api/analytics/metrics").then((res) => setMetrics(res.data));

    // Fetch Sales Trends
    axios.get("/api/analytics/sales-trends").then((res) => {
      const labels = res.data.map((item) => item._id);
      const data = res.data.map((item) => item.total);
      setSalesTrends({ labels, datasets: [{ label: "Sales", data }] });
    });

    // Fetch Top Products
    axios
      .get("/api/analytics/top-products")
      .then((res) => setTopProducts(res.data));

    // Fetch Alerts
    axios.get("/api/analytics/alerts").then((res) => setAlerts(res.data));
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{`$${metrics.dailySales || 0}`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{`$${
              metrics.weeklySales || 0
            }`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{`$${
              metrics.monthlySales || 0
            }`}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trends */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sales Trends</h3>
        <div className="p-4 border rounded-md">
          <Line data={salesTrends} options={{ responsive: true }} />
        </div>
      </div>

      {/* Top Products */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Products</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Total Sales</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{`$${product.totalSales}`}</TableCell>
                <TableCell>{product.totalQuantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Alerts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Alerts</h3>
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              variant={alert.type === "error" ? "destructive" : "warning"}
            >
              {alert.message}
            </Alert>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
