import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfilePage from "./pages/Profile/ProfilePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import UserDetail from "./pages/Users/UserDetail";
import EditUser from "./pages/Users/EditUser";
import SalesByRegion from "./pages/Sales/SalesByRegion";
import AddUser from "./pages/Users/AddUser";
import AnalyticsDashboard from "./pages/Reports & Analytics/AnalyticsDashboard";
import DetailedReports from "./pages/Reports & Analytics/DetailedReports";

// Example 404 Page using shadcn UI components
// For the sake of example, let's assume you've installed shadcn components
// and have a Button or Alert component. Adjust as needed based on your setup.
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <a href="/dashboard">Go to Dashboard</a>
      </Button>
    </div>
  );
};

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* 
          Root route logic: If token exists, redirect to /dashboard.
          Otherwise, redirect to /login.
        */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public routes: accessible without token */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes: wrapped in DashboardLayout */}
        <Route path="/" element={<DashboardLayout />}>
          {/* Note: Since we've already handled the '/' route, this will not conflict */}
          <Route
            path="dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="users/:id"
            element={token ? <UserDetail /> : <Navigate to="/login" replace />}
          />
          <Route
            path="users/:id/edit"
            element={token ? <EditUser /> : <Navigate to="/login" replace />}
          />
          <Route
            path="user-management"
            element={token ? <Users /> : <Navigate to="/login" replace />}
          />
          <Route
            path="users/new"
            element={token ? <AddUser /> : <Navigate to="/login" replace />}
          />
          <Route
            path="geo-sales"
            element={
              token ? <SalesByRegion /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="analytics"
            element={
              token ? <AnalyticsDashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="reports"
            element={
              token ? <DetailedReports /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="profile"
            element={token ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
