import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    IconButton,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt'; // Import an icon for Order Management
import NotificationsIcon from '@mui/icons-material/Notifications'; // Icon for Stocks Alerts
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useTheme } from '@mui/material/styles';

const Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, onLogin, onLogout }) => {
    const theme = useTheme();
    const navigate = useNavigate(); // Initialize navigate hook

    const toggleDrawer = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const getItemColor = (selected) => {
        if (theme.palette.mode === 'dark') {
            return selected ? 'black' : 'text.primary';
        }
        return 'text.primary';
    };

    const getLogoutButtonColor = () => {
        return theme.palette.mode === 'dark' ? 'black' : 'text.primary';
    };

    // Handle logout functionality
    const handleLogout = () => {
        if (onLogout) {
            onLogout(); // Call the onLogout function passed from the parent component (App)
        }
    };

    return (
        <>
            {/* Mobile Sidebar */}
            <Drawer
                anchor="left"
                open={sidebarOpen}
                onClose={toggleDrawer}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                }}
            >
                <Box sx={{ width: 250, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                        <img
                            src="/assets/logo.png"
                            alt="eCommerce Logo"
                            style={{
                                width: 55,
                                height: 65,
                                marginRight: 10,
                                color: 'white',
                            }}
                        />
                        <Typography variant="h6" sx={{ mb: 2, color: 'white', marginLeft: 1, paddingTop: 2, fontWeight: 'bold' }}>
                            Manager Panel
                        </Typography>
                    </Box>
                    <List>
                        <ListItem disablePadding sx={{ mb: 2 }}>
                            <ListItemButton
                                selected={currentPage === 'Dashboard'}
                                onClick={() => {
                                    setCurrentPage('Dashboard');
                                    toggleDrawer();
                                }}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'background.sidebarSelected',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'background.sidebarHover',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: getItemColor(currentPage === 'Dashboard') }}>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Home"
                                    sx={{
                                        color: getItemColor(currentPage === 'Dashboard'),
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                selected={currentPage === 'Inventory'}
                                onClick={() => {
                                    setCurrentPage('Inventory');
                                    toggleDrawer();
                                }}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'background.sidebarSelected',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'background.sidebarHover',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: getItemColor(currentPage === 'Inventory') }}>
                                    <InventoryIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Inventory"
                                    sx={{
                                        color: getItemColor(currentPage === 'Inventory'),
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                selected={currentPage === 'Order Management'}
                                onClick={() => setCurrentPage('Order Management')}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'background.sidebarSelected',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'background.sidebarHover',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: getItemColor(currentPage === 'Order Management') }}>
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Orders Status"
                                    sx={{
                                        color: getItemColor(currentPage === 'Order Management'),
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                        {/* New Stocks Alerts Item */}
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                selected={currentPage === 'Stocks Alerts'}
                                onClick={() => {
                                    setCurrentPage('Stocks Alerts');
                                    toggleDrawer();
                                }}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'background.sidebarSelected',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'background.sidebarHover',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: getItemColor(currentPage === 'Stocks Alerts') }}>
                                    <NotificationsIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Stocks Alerts"
                                    sx={{
                                        color: getItemColor(currentPage === 'Stocks Alerts'),
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider sx={{ my: 2 }} />
                    {/* Logout Button */}
                    <Box sx={{ position: 'absolute', bottom: 20, width: '85%' }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'background.sidebarHover',
                                    },
                                    backgroundColor: 'background.sidebarSelected',
                                    borderRadius: '10px'
                                }}
                            >
                                <ListItemIcon sx={{ color: getLogoutButtonColor() }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Logout"
                                    sx={{
                                        color: getLogoutButtonColor(),
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Box>
                </Box>
            </Drawer>

            {/* Desktop Sidebar */}
            <Box
                sx={{
                    width: { xs: 0, sm: '250px' },
                    bgcolor: 'background.paper',
                    height: '100vh',
                    display: { xs: 'none', sm: 'block' },
                    p: 2,
                    position: 'fixed',  // Change this to fixed
                    top: 0,  // Ensures the sidebar stays at the top of the page
                    left: 0, // Ensures the sidebar stays on the left
                    zIndex: 1200,  // Makes sure the sidebar is above other content
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src="/assets/logo.png"
                        alt="eCommerce Logo"
                        style={{
                            width: 55,
                            height: 65,
                            marginRight: 10,
                            color: 'white',
                        }}
                    />
                    <Typography variant="h6" sx={{ mb: 2, color: 'white', marginLeft: 1, paddingTop: 2, fontWeight: 'bold' }}>
                        Manager Panel
                    </Typography>
                </Box>
                <List>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={currentPage === 'Dashboard'}
                            onClick={() => setCurrentPage('Dashboard')}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'background.sidebarSelected',
                                },
                                '&:hover': {
                                    backgroundColor: 'background.sidebarHover',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: getItemColor(currentPage === 'Dashboard') }}>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Home"
                                sx={{
                                    color: getItemColor(currentPage === 'Dashboard'),
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={currentPage === 'Inventory'}
                            onClick={() => setCurrentPage('Inventory')}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'background.sidebarSelected',
                                },
                                '&:hover': {
                                    backgroundColor: 'background.sidebarHover',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: getItemColor(currentPage === 'Inventory') }}>
                                <InventoryIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Inventory"
                                sx={{
                                    color: getItemColor(currentPage === 'Inventory'),
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={currentPage === 'Order Management'}
                            onClick={() => setCurrentPage('Order Management')}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'background.sidebarSelected',
                                },
                                '&:hover': {
                                    backgroundColor: 'background.sidebarHover',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: getItemColor(currentPage === 'Order Management') }}>
                                <ReceiptIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Order Status"
                                sx={{
                                    color: getItemColor(currentPage === 'Order Management'),
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* New Stocks Alerts Item */}
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={currentPage === 'Stocks Alerts'}
                            onClick={() => setCurrentPage('Stocks Alerts')}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'background.sidebarSelected',
                                },
                                '&:hover': {
                                    backgroundColor: 'background.sidebarHover',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: getItemColor(currentPage === 'Stocks Alerts') }}>
                                <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Stocks Alerts"
                                sx={{
                                    color: getItemColor(currentPage === 'Stocks Alerts'),
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider sx={{ my: 2 }} />
                {/* Logout Button */}
                <Box sx={{ position: 'absolute', bottom: 20, width: '85%' }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'background.sidebarHover',
                                },
                                backgroundColor: 'background.sidebarSelected',
                            }}
                        >
                            <ListItemIcon sx={{ color: getLogoutButtonColor() }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                sx={{
                                    color: getLogoutButtonColor(),
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
                sx={{
                    position: 'fixed',
                    top: 32,
                    right: 30,
                    zIndex: 1201,
                    display: { sm: 'none' },
                }}
                onClick={toggleDrawer}
            >
                <MenuIcon sx={{ color: 'text.secondary' }} />
            </IconButton>

            {/* Login Icon (for the top corner of mobile) */}
            <IconButton
                sx={{
                    position: 'fixed',
                    top: 10,
                    left: 10,
                    zIndex: 1201,
                    display: { xs: 'none', sm: 'none' },
                }}
                onClick={onLogin}
            >
                <LoginIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
        </>
    );
};

export default Sidebar;
