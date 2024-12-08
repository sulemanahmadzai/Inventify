import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
    Chip,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { keyframes } from '@mui/system';

// Defining heavy animations
const slideInFromLeft = keyframes`
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
`;

const buttonBounce = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
`;

const pulse = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.6; }
    100% { transform: scale(1); opacity: 1; }
`;

const highlightChange = keyframes`
    0% { background-color: #f0f0f0; }
    100% { background-color: #ffcc00; }
`;

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders/', {
                params: { page, status: statusFilter, limit: 10 },
            });
            setOrders(response.data.orders);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) {
            toast.error('Please enter an order ID to search');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/orders/search/${searchQuery}`);

            setOrders(response.data.orders);  // Setting orders from response
            setTotalPages(1); // Since we have only one result
            setTotalPages(response.data.totalPages); // Since it's always 1 in this case, it's fine
        } catch (error) {
            console.error('Failed to search for order:', error);
            toast.error('Order not found');
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            setIsDialogOpen(false);
            fetchOrders();
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/invoice`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${orderId}.txt`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Invoice downloaded successfully');
        } catch (error) {
            console.error('Failed to download invoice:', error);
            toast.error('Failed to download invoice');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'shipped':
                return 'info';
            case 'delivered':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <TextField
                        label="Search by Order ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        sx={{
                            minWidth: 200,
                            backgroundColor: 'charts.bg',
                            boxShadow: 3,
                            color: 'charts.text',
                            '& .MuiInputLabel-root': {
                                color: 'charts.text',
                            },
                            '& .MuiInputBase-input': {
                                color: 'charts.text',
                            },
                        }}
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            ml: 2,
                            bgcolor: 'button.primary',
                            color: 'text.secondary',
                            animation: `${buttonBounce} 0.6s ease-out`
                        }}
                    >
                        Search
                    </Button>
                </Box>

                <TextField
                    select
                    label="Filter by Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                        minWidth: 200,
                        backgroundColor: 'charts.bg',
                        boxShadow: 3,
                        color: 'charts.text',
                        '& .MuiInputLabel-root': {
                            color: 'charts.text',
                        },
                    }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                </TextField>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
                    <Table
                        stickyHeader
                        aria-label="sticky table"
                        sx={{
                            minWidth: 650,
                            backgroundColor: '#FFFFFF',
                            '& .MuiTableCell-head': {
                                backgroundColor: 'table.header',
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                            },
                            '& .MuiTableCell-body': {
                                color: 'table.text',
                                backgroundColor: 'table.bg',
                            },
                            '& .MuiTableRow-root': {
                                animation: `${slideInFromLeft} 0.5s ease-in-out`,
                            },
                            '& .MuiTableRow-root:hover': {
                                backgroundColor: '#f0f0f0',
                                transition: 'background-color 0.3s ease-in-out',
                                animation: `${pulse} 1s infinite`
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <TableRow key={order._id} sx={{ animation: `${highlightChange} 0.6s ease-out` }}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>{order.userId ? order.userId.name : 'Guest User'}</TableCell>
                                        <TableCell>
                                            <Chip label={order.status} color={getStatusColor(order.status)} />
                                        </TableCell>
                                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleViewDetails(order)}
                                                variant="contained"
                                                sx={{ mr: 1, animation: `${buttonBounce} 0.6s ease-out` }}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                onClick={() => handleDownloadInvoice(order._id)}
                                                variant="outlined"
                                                sx={{ animation: `${buttonBounce} 0.6s ease-out` }}
                                            >
                                                Download Invoice
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: 'table.page', // default pagination item color
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                            backgroundColor: 'primary.main', // background color for selected page
                            color: 'white', // text color for selected page
                        },
                        '& .MuiPaginationItem-root:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)', // hover effect
                        },
                    }}
                />
            </Box>

            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                sx={{
                    animation: `${fadeIn} 0.5s ease-out`,
                    borderRadius: 2,
                    boxShadow: 3, // Add subtle shadow to give depth
                }}
            >
                <DialogTitle sx={{ backgroundColor: 'table.header', color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Order Details
                </DialogTitle>
                <DialogContent sx={{ padding: 3 }}>
                    {selectedOrder && (
                        <Box>
                            {/* Order Information */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Order Information</Typography>
                            <Typography variant="body1" sx={{ mb: 0.5, ml: 2 }}>Order ID: <strong>{selectedOrder._id}</strong></Typography>
                            <Typography variant="body1" sx={{ mb: 0.5, ml: 2 }}>User: <strong>{selectedOrder.userId ? selectedOrder.userId.name : 'Guest User'}</strong></Typography>
                            <Typography variant="body1" sx={{ mb: 0.5, ml: 2 }}>Status: <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} /></Typography>
                            <Typography variant="body1" sx={{ mb: 0.5, ml: 2 }}>Total Amount: <strong>${selectedOrder.totalAmount.toFixed(2)}</strong></Typography>
                            <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>Date: <strong>{new Date(selectedOrder.createdAt).toLocaleDateString()}</strong></Typography>

                            {/* Shipping Address */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Shipping Address</Typography>
                            <Typography variant="body1" sx={{ mb: 0.5, ml: 2 }}>{selectedOrder.shippingAddress.street}</Typography>
                            <Typography variant="body1" sx={{ mb: 0.5, ml: 2 }}>
                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                            </Typography>
                            <Typography variant="body1" sx={{ ml: 2 }}>{selectedOrder.shippingAddress.country}</Typography>

                            {/* Order Items Table */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>Order Items</Typography>
                            <TableContainer component={Paper} sx={{ mt: 1, boxShadow: 2 }}>
                                <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'table.header' }}>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Product</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Quantity</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Price</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.orderItems.map((item) => (
                                            <TableRow key={item._id} sx={{ '&:hover': { backgroundColor: 'background.nav' } }}>
                                                <TableCell>{item.productName}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                                                <TableCell align="right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ padding: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={handleCloseDialog} sx={{ borderRadius: 3 }} variant="outlined">Close</Button>
                    {selectedOrder && selectedOrder.status === 'pending' && (
                        <Button
                            onClick={() => handleStatusChange(selectedOrder._id, 'shipped')}
                            sx={{
                                ml: 2,
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': { backgroundColor: 'primary.dark' },
                                borderRadius: 3
                            }}
                            variant="contained"
                        >
                            Mark as Shipped
                        </Button>
                    )}
                    {selectedOrder && selectedOrder.status === 'shipped' && (
                        <Button
                            onClick={() => handleStatusChange(selectedOrder._id, 'delivered')}
                            sx={{
                                ml: 2,
                                backgroundColor: 'success.main',
                                color: 'white',
                                '&:hover': { backgroundColor: 'success.dark' },
                                borderRadius: 3
                            }}
                            variant="contained"
                        >
                            Mark as Delivered
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
};

export default OrderManagement;
