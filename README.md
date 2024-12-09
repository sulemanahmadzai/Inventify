
# **Smart Inventory Management System (SIMS)**

---

## **Table of Contents**
1. [Introduction](#introduction)
2. [Features](#features)
   - [Admin Panel](#admin-panel)
   - [Customer Panel](#customer-panel)
   - [Supplier Panel](#supplier-panel)
   - [Backend](#backend)
3. [Project Structure](#project-structure)
4. [Technologies Used](#technologies-used)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Hosting and Deployment](#hosting-and-deployment)
8. [Contributing](#contributing)
9. [License](#license)

---

## **Introduction**

The **Smart Inventory Management System (SIMS)** is a comprehensive solution designed to empower small businesses in managing their inventory, sales, and restocking processes efficiently. It provides tailored user interfaces for different roles—customers, admins, and analytics managers—ensuring smooth operations, better customer experience, and actionable business insights.

The project is built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and incorporates third-party integrations like payment gateways and notification services for enhanced functionality.

---

## **Features**

### **Admin Panel**
- Manage users, inventory, and suppliers.
- Generate performance reports and insights.
- Track revenue, trends, and category-wise analytics.
- Waste and loss tracking.

### **Customer Panel**
- Browse and order products.
- View order history and real-time stock availability.
- User-friendly interface for placing orders and tracking delivery.

### **Supplier Panel**
- Manage product listings and availability.
- Receive and process orders.
- View insights on product demand.

### **Backend**
- Centralized database for inventory, orders, and users.
- Role-based authentication and authorization.
- RESTful APIs for seamless communication between panels.

---

## **Project Structure**

```plaintext
web_project/
├── backend/         # Backend folder (Node.js, Express.js, MongoDB)
├── adminPanel/      # Admin frontend (React.js)
├── customerPanel/   # Customer frontend (React.js)
├── supplierPanel/   # Supplier frontend (React.js)
└── README.md        # Project documentation
```

---

## **Technologies Used**

### **Frontend**
- React.js
- Vite (for faster builds)
- ShadCN UI (for UI components)
- Daisy UI (for UI components)


### **Backend**
- Node.js
- Express.js
- MongoDB (Database)
- JWT for authentication


### **Hosting**
- Vercel (Frontend hosting)
- Railway/Render (Backend hosting)

---

## **Installation**

### **Clone the Repository**
```bash
git clone https://github.com/sulemanahmadzai/Inventify.git
cd Inventify
```

### **Setup Backend**
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```plaintext
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### **Setup Frontend Panels**
Repeat these steps for `adminPanel`, `customerPanel`, and `supplierPanel`:

1. Navigate to the respective panel folder:
   ```bash
   cd adminPanel
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## **Usage**
1. Start the backend server.
2. Start any of the frontend panels (Admin, Customer, Supplier) as needed.
3. Access the panels through the following URLs:
   - Admin Panel: `http://localhost:3000`
   - Customer Panel: `http://localhost:3001`
   - Supplier Panel: `http://localhost:3002`

---

## **Hosting and Deployment**

- **Frontend**: Hosted on [Vercel](https://vercel.com/).
- **Backend**: Hosted on [Railway](https://railway.app/) or [Render](https://render.com/).
- **Custom Domains** (Optional):
  - Admin Panel: `admin.inventify.com`
  - Customer Panel: `customer.inventify.com`
  - Supplier Panel: `supplier.inventify.com`

---

## **Contributing**

We welcome contributions to **SIMS**! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added a new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin my-feature-branch
   ```
5. Submit a Pull Request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
