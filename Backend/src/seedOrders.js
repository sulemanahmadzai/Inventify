const mongoose = require("mongoose");
const Order = require("./models/Order"); // Adjust the path to your Order model

require("dotenv").config();
mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Sample order data
const sampleOrders = [
  {
    userId: "6742e3f1f4ff13dd68462446", // Replace with valid user IDs
    orderItems: [
      {
        productId: "6742e419f4ff13dd68462472",
        productName: "Product 4",
        quantity: 2,
        price: 20,
      },
      {
        productId: "6742e419f4ff13dd68462475",
        productName: "Product 7",
        quantity: 1,
        price: 50,
      },
    ],
    totalAmount: 90,
    paymentMethod: {
      type: "Credit Card",
      details: { cardNumber: "4111111111111111" },
    },
    shippingAddress: {
      country: "USA",
      city: "New York",
      state: "NY",
      postalCode: "10001",
    },
    status: "delivered",
  },
  {
    userId: "6742e3f1f4ff13dd68462443",
    orderItems: [
      {
        productId: "6742e419f4ff13dd68462470",
        productName: "Product 2",
        quantity: 3,
        price: 15,
      },
    ],
    totalAmount: 45,
    paymentMethod: { type: "PayPal", details: { email: "user@example.com" } },
    shippingAddress: {
      country: "Canada",
      city: "Toronto",
      state: "ON",
      postalCode: "M5H",
    },
    status: "shipped",
  },
  // Add more sample orders
];

// Generate 30 orders
for (let i = 3; i <= 30; i++) {
  sampleOrders.push({
    userId: "6742e3f1f4ff13dd68462455",
    orderItems: [
      {
        productId: "6742e419f4ff13dd68462471",
        productName: `Product ${i}`,
        quantity: (i % 5) + 1,
        price: i * 10,
      },
    ],
    totalAmount: i * 10,
    paymentMethod: {
      type: "Credit Card",
      details: { cardNumber: "4111111111111111" },
    },
    shippingAddress: {
      country: i % 2 === 0 ? "USA" : "Canada",
      city: `City ${i}`,
      state: "State",
      postalCode: `ZIP${i}`,
    },
    status: i % 3 === 0 ? "pending" : i % 5 === 0 ? "delivered" : "shipped",
  });
}

// Insert orders into the database
async function seedOrders() {
  try {
    await Order.insertMany(sampleOrders);
    console.log("Sample orders inserted successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting sample orders:", error);
    mongoose.connection.close();
  }
}

seedOrders();
