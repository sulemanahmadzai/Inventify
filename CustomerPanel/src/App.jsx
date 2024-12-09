// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CardProvider } from "./context/AddToCardContext";
import AddProduct from "./pages/Admin/AddProduct";
import ListProduct from "./pages/Admin/ListProduct";
import EditProduct from "./pages/Admin/EditProduct";
import Home from "./pages/User/Home";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./pages/User/Cart";
import { ProductProvider } from "./context/ProductContext";
import Signup from "./pages/SignUp";
import { ViewOrder } from "./pages/User/ViewOrder";
import CheckOut from "./pages/User/CheckOut"; // Import the CheckOut component
import OrderSuccess from "./pages/User/OrderSuccess";
import { OrderProvider } from "./context/OrderContext";
import Dashboard from "./pages/Admin/Dashboard";
// Inside your Routes

function App() {
  return (
    <Router>
      <OrderProvider>
        <AuthProvider>
          <ProductProvider>
            <CardProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route
                      path="/addProduct"
                      element={
                        <PrivateRoute requiredRoles="Admin">
                          <AddProduct />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listProducts"
                      element={
                        <PrivateRoute requiredRoles="Admin">
                          <ListProduct />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/editProduct/:id"
                      element={
                        <PrivateRoute requiredRoles="Admin">
                          <EditProduct />
                        </PrivateRoute>
                      }
                    />
                    // customer routes
                    <Route
                      path="/home"
                      element={
                        <PrivateRoute requiredRoles="User">
                          <Home />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/cart"
                      element={
                        <PrivateRoute requiredRoles="User">
                          <Cart />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <PrivateRoute requiredRoles="User">
                          <CheckOut />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/order-success"
                      element={
                        <PrivateRoute requiredRoles="User">
                          <OrderSuccess />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/viewOrder"
                      element={
                        <PrivateRoute requiredRoles="User">
                          <ViewOrder />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
                </main>
                <Footer /> {/* Footer remains consistent */}
              </div>
            </CardProvider>
          </ProductProvider>
        </AuthProvider>
      </OrderProvider>
    </Router>
  );
}

export default App;
