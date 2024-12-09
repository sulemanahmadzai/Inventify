import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwordHash: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      console.log(response.data.token);
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
      setMessage("Registration successful!");
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/google-register",
        { token: credentialResponse.credential },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
      setMessage("Google registration successful!");
    } catch (error) {
      console.error("Error during Google registration:", error);
      setMessage(
        error.response?.data?.msg ||
          "An error occurred during Google registration."
      );
    }
  };

  const handleGoogleError = () => {
    setMessage("Google login failed. Please try again.");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen h-screen md:h-auto">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-100 relative px-6 py-8 md:py-0 h-full md:min-h-screen animate-fadeIn">
        {/* Login Button at Top Right */}
        <div className="absolute top-4 right-6">
          <Button
            variant="link"
            className="text-gray-700"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </div>

        {/* Display logo prominently at the top on small screens */}
        <div className="md:hidden flex justify-center mb-6">
          <img
            src="/abc.png"
            alt="Logo"
            className="h-20 w-auto animate-bounceSlow"
          />
        </div>

        <div className="max-w-sm w-full animate-slideUp mt-16">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Create an account
          </h2>
          {message && (
            <p className="mb-4 text-red-500 text-center animate-pulse">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              className="bg-gray-50 w-full px-4 py-3 rounded-md"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              className="bg-gray-50 w-full px-4 py-3 rounded-md"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              className="bg-gray-50 w-full px-4 py-3 rounded-md"
              type="password"
              name="passwordHash"
              placeholder="Password"
              value={formData.passwordHash}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              className="w-full py-3 animate-slideUp delay-300"
            >
              Sign Up with Email
            </Button>
          </form>

          <div className="relative mt-6 mb-5 animate-slideUp delay-500">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full animate-slideUp delay-700">
            <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_API}>
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    borderRadius: "0.375rem",
                  }} // Setting width and padding to match the button above
                />
              </div>
            </GoogleOAuthProvider>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8 animate-slideUp delay-900">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div
        className="hidden md:flex md:w-1/2 h-full md:h-auto bg-cover bg-center animate-fadeIn delay-200"
        style={{
          backgroundImage: `url('/abc.png')`, // Replace with the actual path to your image
        }}
      ></div>
    </div>
  );
};

export default Register;
