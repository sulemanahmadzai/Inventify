import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material"; // For adding and removing key-value pairs
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProductModal = ({ open, onClose, item }) => {
    const [formData, setFormData] = useState({
        quantity: "",
        threshold: "",
        location: "",
        productPrice: "",
        attributes: [], // Attributes as an array of objects
        tags: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    // Update formData whenever 'item' prop changes
    useEffect(() => {
        if (open && item) {
            setFormData({
                quantity: item.quantity,
                threshold: item.threshold,
                location: item.location,
                productPrice: item.price,
                attributes: item.attributes || [], // Ensure attributes is an array
                tags: item.tags ? item.tags.join(", ") : "",
            });
        }
    }, [open, item]);

    // Handle input changes for basic fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle attribute changes for key-value pairs
    const handleAttributeChange = (index, name, value) => {
        const updatedAttributes = [...formData.attributes];
        updatedAttributes[index][name] = value; // Update either 'key' or 'value'
        setFormData((prevData) => ({
            ...prevData,
            attributes: updatedAttributes,
        }));
    };

    // Remove an attribute by index
    const removeAttributeField = (index) => {
        const updatedAttributes = formData.attributes.filter((_, i) => i !== index);
        setFormData({ ...formData, attributes: updatedAttributes });
    };

    // Add a new attribute field (with empty key-value pair)
    const addAttributeField = () => {
        setFormData((prevData) => ({
            ...prevData,
            attributes: [...prevData.attributes, { key: "", value: "" }], // Add a new empty key-value pair
        }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        const { quantity, threshold, location, productPrice, attributes, tags } = formData;

        if (!quantity || !threshold || !location) {
            toast.error("Please fill all required fields");
            return;
        }

        // Convert the attributes array to an object (key-value pairs)
        const attributesObject = attributes.reduce((acc, { key, value }) => {
            if (key.trim() && value.trim()) {
                acc[key.trim()] = value.trim(); // Add the key-value pair to the object
            }
            return acc;
        }, {});

        try {
            const response = await fetch(`http://localhost:5000/api/inventory/update/${item.inventoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quantity: parseInt(quantity, 10),
                    threshold: parseInt(threshold, 10),
                    location: location.trim(),
                    productPrice: parseFloat(productPrice),
                    attributes: attributesObject, // Send the attributes as an object
                    tags: tags.split(",").map((tag) => tag.trim()),
                }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("Product Edited successfully");  // Success toast
                onClose(); // Close the modal
            } else {
                toast.error(`Error: ${result.error || "Something went wrong"}`); // Error toast
            }
        } catch (error) {
            console.error("Error updating inventory item:", error);
            toast.error("An error occurred while updating the product");  // Error toast
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <ToastContainer position="top-right" />

            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            marginTop: 2,
                        }}
                    >
                        <TextField
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Threshold"
                            name="threshold"
                            type="number"
                            value={formData.threshold}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Product Price"
                            name="productPrice"
                            type="number"
                            value={formData.productPrice}
                            onChange={handleChange}
                        />

                        {/* Render key-value pairs for attributes */}
                        <Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <strong>Attributes</strong>
                                <IconButton color="primary" onClick={addAttributeField}>
                                    <AddCircle />
                                </IconButton>
                            </Box>

                            {formData.attributes.map((attribute, index) => (
                                <Box key={index} display="flex" alignItems="center" gap={2} mb={1}>
                                    <TextField
                                        label="Key"
                                        value={attribute.key}
                                        onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                                        required
                                    />
                                    <TextField
                                        label="Value"
                                        value={attribute.value}
                                        onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                        required
                                    />
                                    <IconButton color="error" onClick={() => removeAttributeField(index)}>
                                        <RemoveCircle />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        <TextField
                            label="Tags (comma-separated)"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Update Product
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProductModal;
