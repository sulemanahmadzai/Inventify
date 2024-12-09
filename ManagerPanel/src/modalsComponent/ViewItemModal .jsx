import React from 'react';
import { Modal, Box, Typography, Divider, Button, Grid, Card, CardMedia } from '@mui/material';

const ViewItemModal = ({ open, onClose, item }) => {
    if (!item) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 24,
                    maxWidth: 600,
                    width: '90%',
                    overflowY: 'auto', // Adds scroll for longer descriptions or images
                    maxHeight: '80vh', // Ensure it doesn't stretch too much vertically
                }}
            >
                {/* Product Name */}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {item.productName}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Product Details */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <strong>Inventory ID:</strong> {item.inventoryId}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <strong>Category:</strong>{' '}
                            {Array.isArray(item.categories) ? item.categories.join(', ') : 'No Categories'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <strong>Quantity:</strong> {item.quantity}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <strong>Threshold:</strong> {item.threshold}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <strong>Location:</strong> {item.location}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                            <strong>Price:</strong> ${item.price.toFixed(2)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Description:</strong> {item.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Expiration Date:</strong>{' '}
                            {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString('en-GB') : 'No Expiry Date'}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Product Images */}
                {item.images && item.images.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                            Product Images:
                        </Typography>
                        <Grid container spacing={2}>
                            {item.images.map((image, index) => (
                                <Grid item xs={6} sm={4} md={3} key={index}>
                                    <Card sx={{ maxWidth: 220, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={image}
                                            alt={`Product image ${index + 1}`}
                                            sx={{ borderRadius: 2 }}
                                        />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Close Button */}
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button variant="contained" color="primary" onClick={onClose} sx={{ paddingX: 4 }}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ViewItemModal;
