import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { List, ListItem, ListIcon } from "../../components/list"; // Ensure this is your own List component or customize accordingly
import { ScrollArea } from "@/components/ui/scroll-area"; // Optional for better scrolling
import { ShoppingCart, User, AlertTriangle } from "lucide-react";

export function RecentActivity() {
  const [activityData, setActivityData] = useState({
    recentOrders: [],
    newUsers: [],
    lowStockAlerts: [],
  });

  // Fetch recent activity from the API
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/overview/recent-activity"
        );
        setActivityData(response.data.data);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-8">
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest 5 orders placed by users</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-52">
            {" "}
            {/* Allows scrolling if content overflows */}
            <List>
              {activityData.recentOrders.map((order) => (
                <ListItem key={order._id}>
                  <ListIcon as={ShoppingCart} className="text-primary" />
                  <span>
                    Order #{order._id} -{" "}
                    <strong>{order.userId?.name || "Unknown User"}</strong> (
                    {order.status})
                  </span>
                </ListItem>
              ))}
            </List>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* New Users */}
      <Card>
        <CardHeader>
          <CardTitle>New Users</CardTitle>
          <CardDescription>Recently registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-52">
            <List>
              {activityData.newUsers.map((user) => (
                <ListItem key={user._id}>
                  <ListIcon as={User} className="text-primary" />
                  <span>
                    {user.name} (<em>{user.email}</em>)
                  </span>
                </ListItem>
              ))}
            </List>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Items with critical stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-52">
            <List>
              {activityData.lowStockAlerts.map((item) => (
                <ListItem key={item._id}>
                  <ListIcon as={AlertTriangle} className="text-destructive" />
                  <span>
                    <strong>{item.productId?.name || "Unknown Product"}</strong>{" "}
                    - {item.quantity} remaining
                  </span>
                </ListItem>
              ))}
            </List>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
