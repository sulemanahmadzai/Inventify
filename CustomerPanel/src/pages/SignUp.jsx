import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField"; // Import InputField component
import Button from "../components/Button"; // Import Button component
import { signup } from "../appwrite/authService"; // Import your signup function

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New input for password confirmation
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signup(email, password); // Call your signup function
      const user = await handleLogin(email, password); // Automatically log in after signup

      setLoading(false);

      if (user) {
        navigate("/dashboard"); // Navigate to the user dashboard after signup
      }
    } catch (error) {
      alert("Signup failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-4xl font-bold text-indigo-500 text-center">
          Create Your Account
        </h2>
        <p className="text-center text-indigo-300 mb-6">
          Please fill out the form to create a new account.
        </p>

        {/* Email Input */}
        <InputField
          label="Email"
          name="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        {/* Password Input */}
        <InputField
          label="Password"
          name="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        {/* Confirm Password Input */}
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="text"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={loading} // Pass loading state to Button
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-md hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
        >
          Sign Up
        </Button>

        <p className="text-center text-indigo-300">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
