import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ThemeIcon from '@mui/icons-material/Brightness4';
import MenuIcon from '@mui/icons-material/Menu';
import { jwtDecode } from 'jwt-decode'; // Correct named import
import KPI from '../components/dashboard/KPI';
import Overview from '../components/dashboard/Overview';
import { InventoryStatus } from '../components/dashboard/InventoryStatus';
import { motion } from 'framer-motion'; // Importing framer-motion for animations

const Dashboard = ({ toggleTheme, toggleSidebar }) => {
    const [userName, setUserName] = useState('');

    // Extract the token and decode it when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decode the JWT token
                setUserName(decodedToken.name); // Set the user name from the token
            } catch (error) {
                console.error('Error decoding the token:', error);
            }
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }} // Start with opacity 0
            animate={{ opacity: 1 }} // Fade in to opacity 1
            transition={{ duration: 1 }} // 1 second for the entire page fade-in animation
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Main Content */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }} // Start with slight offset and invisible
                    animate={{ y: 0, opacity: 1 }} // Slide in and become visible
                    transition={{ duration: 1.5, delay: 0.3 }} // Delay for a smoother appearance
                >
                    <Box sx={{ bgcolor: 'background.default', p: 3 }}>
                        <Typography variant="h4" color='text.textColor'>
                            Welcome, {userName ? userName : 'Guest'}!
                        </Typography>
                    </Box>
                </motion.div>

                {/* KPI Card Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slightly below
                    animate={{ opacity: 1, y: 0 }} // Fade in and slide up to the correct position
                    transition={{ duration: 1, delay: 0.5 }} // Animate KPI with a delay
                >
                    <KPI />
                </motion.div>

                {/* Overview and Inventory Status in One Row */}
                <Grid container spacing={2}>
                    {/* Overview Bar Chart (2/3 of the row) */}
                    <Grid item xs={12} sm={12} md={8}>
                        <motion.div
                            initial={{ opacity: 0, x: -100 }} // Start from the left
                            animate={{ opacity: 1, x: 0 }} // Slide in and fade in
                            transition={{ duration: 1, delay: 1 }} // Animate after a delay
                        >
                            <Overview />
                        </motion.div>
                    </Grid>

                    {/* Inventory Status Pie Chart (1/3 of the row) */}
                    <Grid item xs={12} sm={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, x: 100 }} // Start from the right
                            animate={{ opacity: 1, x: 0 }} // Slide in and fade in
                            transition={{ duration: 1, delay: 1.2 }} // Animate after a slight delay
                        >
                            <InventoryStatus />
                        </motion.div>
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    );
};

export default Dashboard;
