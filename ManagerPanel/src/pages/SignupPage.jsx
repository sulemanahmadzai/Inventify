import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios"; // Import Axios
import { Container, Box, Grid, Tabs, Tab, TextField, Button, Radio, RadioGroup, FormControlLabel, Typography, Grow, Alert } from "@mui/material";
import LoadingOverlay from '../components/LoadingOverlay'; // Import LoadingOverlay

function SignupPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // If the user is already logged in, redirect them to the dashboard
        if (localStorage.getItem("token")) {
            navigate("/dashboard"); // Use navigate instead of window.location.href
        }
    }, [navigate]); // Add navigate as dependency


    const [activeTab, setActiveTab] = useState(0);
    const [signupForm, setSignupForm] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        dateOfBirth: "",
        role: "manager",
    });

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false); // To handle page redirection
    const [alertVisible, setAlertVisible] = useState(false); // State to control alert visibility

    const handleTabChange = (event, newValue) => {
        setError("");
        setAlertVisible(false); // Reset alert visibility on tab change
        setActiveTab(newValue);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (activeTab === 0) {
            setLoginForm((prev) => ({ ...prev, [name]: value }));
        } else {
            setSignupForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        // Check if any field is empty
        if (activeTab === 0) {
            // Validate login form
            if (!loginForm.email || !loginForm.password) {
                setError("Please fill in all the required fields.");
                setAlertVisible(true); // Show alert if validation fails
                return false;
            }
        } else {
            // Validate signup form
            if (
                !signupForm.name ||
                !signupForm.email ||
                !signupForm.password ||
                !signupForm.phoneNumber ||
                !signupForm.dateOfBirth
            ) {
                setError("Please fill in all the required fields.");
                setAlertVisible(true); // Show alert if validation fails
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true); // Start loading overlay

        // Validate form before making the request
        if (!validateForm()) {
            setLoading(false); // Stop loading if validation fails
            return;
        }

        try {
            let response;

            if (activeTab === 0) {
                // Login Request
                response = await axios.post("http://localhost:5000/api/auth/login", loginForm);

                console.log("Login Response:", response.data);
                // Store token in localStorage or sessionStorage
                localStorage.setItem("token", response.data.token);
            } else {
                // Signup Request
                response = await axios.post("http://localhost:5000/api/auth/signup", signupForm);
                console.log("Signup Response:", response.data);
                // Store token in localStorage or sessionStorage
                localStorage.setItem("token", response.data.token);
            }

            // Show loading overlay for 3 seconds
            setTimeout(() => {
                setLoading(false); // Stop loading
                setIsRedirecting(true); // Set redirect flag
                window.location.href = "/dashboard"; // Redirect to dashboard route
            }, 3000); // Wait for 3 seconds before redirecting
        } catch (error) {
            setLoading(false); // Hide loading overlay immediately if an error occurs

            setError(error.response?.data?.message || error.response?.data?.errors?.join(", ") || "Server is currently down. kindly try again later!");
            setAlertVisible(true); // Show alert on error
        }
    };

    return (
        <div style={{ backgroundColor: "#030712", minHeight: "100vh" }}>
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#0C121E",
                        p: 4,
                        borderRadius: 2,
                        width: { xs: "90%", sm: "80%", md: activeTab === 0 ? "40%" : "80%" },
                        textAlign: "center",
                        transition: "width 0.5s ease-in-out",
                    }}
                >
                    {/* Tab Navigation */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="auth tabs"
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {/* Display Error with animation */}
                    {alertVisible && (
                        <Grow in={alertVisible} timeout={500}>
                            <Alert severity="error" sx={{ mb: 2, marginTop: 2 }}>
                                {error}
                            </Alert>
                        </Grow>
                    )}

                    {/* Tab Content with Animations */}
                    <Box sx={{ mt: 3 }}>
                        {activeTab === 0 && (
                            <Grow in={activeTab === 0} timeout={800}>
                                <Box key="login" sx={{ my: 3 }}>
                                    <Typography variant="h5" sx={{ mb: 3 }}>
                                        Manager Panel
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Email address"
                                        name="email"
                                        value={loginForm.email}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        margin="normal"
                                        type="email"
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        value={loginForm.password}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        margin="normal"
                                        type="password"
                                        required
                                    />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 3, backgroundColor: '#5F2DAC' }}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Logging in..." : "Log in"}
                                    </Button>
                                </Box>
                            </Grow>
                        )}
                        {activeTab === 1 && (
                            <Grow in={activeTab === 1} timeout={800}>
                                <Box key="register" sx={{ my: 3 }}>
                                    <Typography variant="h5" sx={{ mb: 3 }}>
                                        Manager Panel
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Name"
                                                name="name"
                                                value={signupForm.name}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                margin="normal"
                                                type="text"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                value={signupForm.email}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                margin="normal"
                                                type="email"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                name="password"
                                                value={signupForm.password}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                margin="normal"
                                                type="password"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phoneNumber"
                                                value={signupForm.phoneNumber}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                margin="normal"
                                                type="tel"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Date of Birth"
                                                name="dateOfBirth"
                                                value={signupForm.dateOfBirth}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                margin="normal"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                Role
                                            </Typography>
                                            <RadioGroup
                                                row
                                                name="role"
                                                value={signupForm.role}
                                                onChange={handleInputChange}
                                            >
                                                <FormControlLabel
                                                    value="manager"
                                                    control={<Radio />}
                                                    label="Manager"
                                                />
                                                <FormControlLabel
                                                    value="admin"
                                                    control={<Radio />}
                                                    label="Admin"
                                                />
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 3, backgroundColor: '#5F2DAC' }}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Signing up..." : "Sign up"}
                                    </Button>
                                </Box>
                            </Grow>
                        )}
                    </Box>
                </Box>
            </Container>

            {/* Loading Overlay Component */}
            <LoadingOverlay open={loading} message={loading ? "Processing..." : ""} />
        </div>
    );
}

export default SignupPage;
