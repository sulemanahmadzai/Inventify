const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Order = require("./models/Order");
const Inventory = require("./models/Inventory");
const KPI = require("./models/KPI");

require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const insertUsers = async () => {
  const users = [];
  for (let i = 1; i <= 10; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      passwordHash: await bcrypt.hash("password123", 10),
      role: i === 1 ? "admin" : i === 2 ? "manager" : "customer",
      personalDetails: {
        address: `123 Street ${i}, City ${i}`,
        phoneNumber: `12345678${i}`,
      },
      paymentMethods: [
        { type: "Credit Card", details: { last4Digits: `${1000 + i}` } },
      ],
    });
  }
  await User.insertMany(users);
  console.log("10 Users added successfully.");
};

const insertCategories = async () => {
  const categories = [];
  for (let i = 1; i <= 10; i++) {
    categories.push({
      name: `Category ${i}`,
      description: `Description for Category ${i}`,
      parentCategoryId: null,
    });
  }
  await Category.insertMany(categories);
  console.log("10 Categories added successfully.");
};

const insertProducts = async () => {
  const categories = await Category.find();
  const products = [];
  for (let i = 1; i <= 10; i++) {
    products.push({
      name: `Product ${i}`,
      description: `Description for Product ${i}`,
      price: Math.floor(Math.random() * 100) + 10,
      categories: [
        categories[Math.floor(Math.random() * categories.length)]._id,
      ],
      tags: [`Tag${i}`, `Category${i}`],
      attributes: { brand: `Brand${i}`, size: `${i}L` },
      images: [`/images/product${i}.png`],
      status: "available",
    });
  }
  await Product.insertMany(products);
  console.log("10 Products added successfully.");
};

const insertOrders = async () => {
  const users = await User.find({ role: "customer" });
  const products = await Product.find();
  const orders = [];
  for (let i = 1; i <= 10; i++) {
    const orderItems = [];
    for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      orderItems.push({
        productId: randomProduct._id,
        productName: randomProduct.name,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: randomProduct.price,
      });
    }
    orders.push({
      userId: users[Math.floor(Math.random() * users.length)]._id,
      orderItems,
      totalAmount: orderItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      ),
      paymentMethod: { type: "Credit Card", details: { last4Digits: "1234" } },
      shippingAddress: {
        street: `123 Street ${i}`,
        city: `City ${i}`,
        postalCode: `12345`,
      },
      status: ["pending", "shipped", "delivered"][
        Math.floor(Math.random() * 3)
      ],
      trackingNumber: `TRACK${i}`,
    });
  }
  await Order.insertMany(orders);
  console.log("10 Orders added successfully.");
};

const insertInventory = async () => {
  const products = await Product.find();
  const inventory = [];
  for (let i = 0; i < 10; i++) {
    inventory.push({
      productId: products[i]._id,
      quantity: Math.floor(Math.random() * 100) + 10,
      threshold: 15,
      location: `Warehouse ${i + 1}`,
    });
  }
  await Inventory.insertMany(inventory);
  console.log("10 Inventory records added successfully.");
};

const insertKPIs = async () => {
  const today = new Date();
  const kpis = [
    {
      metric: "Total Users",
      value: await User.countDocuments(),
      date: today,
    },
    {
      metric: "Total Revenue",
      value: await Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]).then((result) => result[0]?.total || 0),
      date: today,
    },
    {
      metric: "Total Orders",
      value: await Order.countDocuments(),
      date: today,
    },
    {
      metric: "Inventory Turnover",
      value: await Inventory.aggregate([
        {
          $group: {
            _id: null,
            avgQuantity: { $avg: "$quantity" },
          },
        },
      ]).then((result) => result[0]?.avgQuantity || 0),
      date: today,
    },
  ];
  await KPI.insertMany(kpis);
  console.log("KPIs added successfully.");
};

const populateDatabase = async () => {
  try {
    await connectDB();

    await insertUsers();
    await insertCategories();
    await insertProducts();
    await insertOrders();
    await insertInventory();
    await insertKPIs();

    console.log("Database populated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error populating the database:", error);
    process.exit(1);
  }
};

populateDatabase();
