import React from 'react';
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icon for Light Mode (Sun)
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icon for Dark Mode (Moon)
import Sidebar from '../components/Sidebar';
import Dashboard from '../pages/Dashboard';//dashboard page
import Inventory from '../pages/Inventory';//inventory page
import StockAlerts from '../pages/StockAlerts';
import Order from '../pages/Order';//order status handler page

const DashboardLayout = ({ isDarkMode, toggleTheme, onLogout }) => {
    const [currentPage, setCurrentPage] = React.useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Media queries
    const isSmallScreen = useMediaQuery('(max-width:599px)');
    const isExtraSmallScreen = useMediaQuery('(max-width:444px)');

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={onLogout}
            />

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    p: 3,
                    ml: { xs: 0, sm: '250px' },  // 250px margin on sm (medium) and larger screens, no margin on smaller screens
                    bgcolor: 'background.default', // Background color for content area
                    height: '100vh',  // Ensures the content takes full height
                    overflowY: 'auto', // Allows scrolling in the content area
                    pt: '80px', // Adds padding-top to prevent overlap with fixed navbar
                }}
            >
                {/* Top Navbar (Fixed) */}
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: isSmallScreen ? 20 : 270,
                        right: 20,

                        mt: 2,
                        display: 'flex',
                        justifyContent: isSmallScreen ? 'flex-start' : 'space-between',
                        alignItems: 'center',
                        bgcolor: 'background.nav',
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                        zIndex: 1200, // Makes sure navbar stays on top
                        gap: isExtraSmallScreen ? 4 : isSmallScreen ? 20 : 0,
                    }}
                >
                    <Typography color="text.secondary">
                        {/*} Dashboard > {currentPage === 'Dashboard' ? 'Home' : currentPage}*/}
                       Dashboard > {currentPage === 'Dashboard' ? 'Home' : currentPage === 'Order Management' ? 'OrderStatus' : currentPage}

                    </Typography>

                    {/* Theme Toggle Icon */}
                    <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
                        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>

                {/* Page Content */}
                {currentPage === 'Dashboard' && <Dashboard />}
                {currentPage === 'Inventory' && <Inventory />}
                {currentPage === 'Order Management' && <Order />}
                {currentPage === 'Stocks Alerts' && <StockAlerts />}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
