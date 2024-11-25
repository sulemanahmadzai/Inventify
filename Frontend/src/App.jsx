import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Orders from "./pages/Dashboard/Orders";
import KPI from "./pages/Dashboard/KPI";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DashboardLayout />}>
          {/* Child Routes */}
          <Route path="dashboard" element={<KPI />} />
          <Route path="orders" element={<Orders />} />
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
