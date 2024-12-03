import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Orders from "./pages/Dashboard/Orders";
import Dashboard from "./pages/Dashboard/Dashboard";

import Users from "./pages/Users/Users";
import UserDetail from "./pages/Users/UserDetail";
import EditUser from "./pages/Users/EditUser";
import SalesByRegion from "./pages/Sales/SalesByRegion";
import AddUser from "./pages/Users/AddUser";
import AnalyticsDashboard from "./pages/Reports & Analytics/AnalyticsDashboard";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DashboardLayout />}>
          {/* Child Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users/:id/edit" element={<EditUser />} />
          <Route path="user-management" element={<Users />} />
          <Route path="users/new" element={<AddUser />} />
          <Route path="geo-sales" element={<SalesByRegion />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />

          {/* <Route path="inventory" element={<InventoryStatus />} />
          <Route path="activity" element={<RecentActivity />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
