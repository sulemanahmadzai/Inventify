import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField"; // Import InputField component
import Button from "../components/Button"; // Import Button component

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state
  const { roles, setRoles } = useContext(AuthContext); // Assuming roles are set in AuthContext after login

  useEffect(() => {
    if (roles.length > 0) {
      if (roles.includes("Admin")) {
        console.log("Navigating to Admin page");
        navigate("/listProducts");
      } else if (roles.includes("User")) {
        console.log("Navigating to User page");
        navigate("/home");
      }
    }
  }, [roles]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting normally
    setLoading(true);
    const user = await handleLogin(email, password);
    setLoading(false);

    if (user) {
      console.log("user", user);
      // No need to set roles here, they will update automatically in AuthContext
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };

  // Function to wait for roles and navigate
  const waitForRolesAndNavigate = () => {
    console.log("hello");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-4xl font-bold text-indigo-500 text-center">
          Welcome Back
        </h2>
        <p className="text-center text-indigo-300 mb-6">
          Please enter your login details to access the dashboard.
        </p>

        {/* Email Input */}
        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        {/* Password Input */}
        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={loading} // Pass loading state to Button
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-md hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
        >
          Login
        </Button>

        <p className="text-center text-indigo-300">
          Don’t have an account?{" "}
          <a href="#" className="text-indigo-400 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
