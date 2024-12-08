import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, Card, CardContent, Pagination, Button, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const StockAlerts = () => {
    const [stockAlerts, setStockAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [inventoryChecking, setInventoryChecking] = useState(false);

    const fetchStockAlerts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/stock-alerts/?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock alerts');
            }
            const data = await response.json();
            setStockAlerts(data.stockAlerts);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStockAlerts();
    }, [page, limit]);

    const getAlertIcon = (alertType) => {
        switch (alertType) {
            case 'low_stock':
                return <WarningIcon sx={{ color: 'orange' }} />;
            case 'expiring_soon':
                return <WarningIcon sx={{ color: 'yellow' }} />;
            case 'out_of_stock':
                return <ErrorIcon sx={{ color: 'red' }} />;
            default:
                return <NotificationsIcon />;
        }
    };

    const renderAlertMessage = (alert) => {
        const { alertMessage, alertType, productName, quantity, location, expirationDate } = alert;
        return (
            <Card sx={{ mb: 2, borderLeft: `5px solid ${getAlertIcon(alertType).props.sx.color}` }}>
                <CardContent>
                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        {alertMessage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Product: {productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quantity: {quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Location: {location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Expiration Date: {expirationDate}
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    const handleCheckInventory = async () => {
        try {
            toast.info('Checking inventory started...', { autoClose: 2000 });
            setInventoryChecking(true);
            const response = await fetch('http://localhost:5000/api/inventory/check');
            if (!response.ok) {
                throw new Error('Failed to check inventory stock levels');
            }
            const data = await response.json();
            // Set a timeout of X seconds before showing the success toast
            const timeoutInSeconds = 3; // For example, 3 seconds
            setTimeout(async () => {
                toast.success(data.message || 'Inventory check completed successfully!', { autoClose: 3000 });
            }, timeoutInSeconds * 1000); // Convert seconds to milliseconds
            await fetchStockAlerts();

        } catch (err) {
            setError(err.message);
            toast.error('Error while checking inventory', { autoClose: 2000 });
        } finally {
            setInventoryChecking(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h6" color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, mt: 2 }}>
            <ToastContainer position="top-right" />
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheckInventory}
                    disabled={inventoryChecking}
                    startIcon={inventoryChecking ? <CircularProgress size={24} color="secondary" /> : null}
                    sx={{
                        animation: inventoryChecking ? 'pulse 1.5s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.05)' },
                            '100%': { transform: 'scale(1)' },
                        },
                        bgcolor: 'button.primary', color: 'text.secondary'
                    }}
                >
                    {inventoryChecking ? 'Checking...' : 'Check Inventory Stock Levels'}
                </Button>
            </Box>

            <List>
                {stockAlerts.length > 0 ? (
                    stockAlerts.map((alert) => (
                        <ListItem key={alert.inventoryId} sx={{ display: 'block', mb: 3 }}>
                            {renderAlertMessage(alert)}
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary">No alerts available.</Typography>
                )}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default StockAlerts;
