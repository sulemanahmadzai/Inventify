import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Input,
    IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { addProduct } from "../API/Inventory/InventoryAPIs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddProductModal = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        categories: "",
        tags: "",
        attributes: {}, // Object to hold dynamic key-value pairs
        quantity: "",
        threshold: "",
        location: "",
        expirationDate: "",
        images: null, // For handling image uploads
    });

    // Handle input changes for basic fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle attribute changes for key-value pairs
    const handleAttributeChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            attributes: {
                ...prevData.attributes,
                [key]: value, // Add or update the key-value pair
            },
        }));
    };

    // Remove an attribute field
    const removeAttributeField = (key) => {
        setFormData((prevData) => {
            const updatedAttributes = { ...prevData.attributes };
            delete updatedAttributes[key]; // Remove the key-value pair
            return { ...prevData, attributes: updatedAttributes };
        });
    };

    // Add a new attribute field (input template for the user)
    const addAttributeField = () => {
        setFormData((prevData) => ({
            ...prevData,
            attributes: { ...prevData.attributes, "": "" }, // Add an empty key-value pair for editing
        }));
    };

    // Handle file input change (multiple file uploads)
    const handleFileChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };

    // Handle form submission
    // Handle form submission
    const handleSubmit = async () => {
        const {
            name,
            description,
            price,
            categories,
            tags,
            attributes,
            quantity,
            threshold,
            location,
            expirationDate,
            images,
        } = formData;

        if (
            !name ||
            !price ||
            !quantity ||
            !location ||
            !expirationDate ||
            !description ||
            !categories ||
            !threshold
        ) {
            alert("Please fill all required fields");
            return;
        }

        // Prepare FormData
        const data = new FormData();
        data.append("name", name);
        data.append("description", description);
        data.append("price", price);
        data.append("categories", categories.split(","));
        data.append("tags", tags.split(","));

        // Append each attribute as a separate key-value pair
        Object.entries(attributes).forEach(([key, value]) => {
            data.append(`attributes[${key}]`, value);
        });

        data.append("quantity", quantity);
        data.append("threshold", threshold);
        data.append("location", location);
        data.append("expirationDate", expirationDate);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                data.append("images", images[i]);
            }
        }

        try {
            const result = await addProduct(data); // Using the API function
            toast.success("Product added successfully");  // Success toast
            onClose(); // Close the modal
        } catch (error) {
            alert("An error occurred while adding the product");
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <ToastContainer position="top-right" />

            <DialogTitle>Add New Product</DialogTitle>
            <DialogContent>
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
                        label="Product Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        required
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Categories (comma-separated)"
                        name="categories"
                        value={formData.categories}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Tags (comma-separated)"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                    />

                    {/* Dynamic Attribute Fields */}
                    <Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <strong>Attributes</strong>
                            <IconButton color="primary" onClick={addAttributeField}>
                                <AddCircle />
                            </IconButton>
                        </Box>
                        {Object.entries(formData.attributes).map(([key, value], index) => (
                            <Box key={index} display="flex" alignItems="center" gap={2} mb={1}>
                                <TextField
                                    label="Key"
                                    value={key}
                                    onChange={(e) => {
                                        const newKey = e.target.value;
                                        const newValue = formData.attributes[key];
                                        removeAttributeField(key); // Remove the old key
                                        handleAttributeChange(newKey, newValue); // Add the new key-value pair
                                    }}
                                    required
                                />
                                <TextField
                                    label="Value"
                                    value={value}
                                    onChange={(e) => handleAttributeChange(key, e.target.value)}
                                    required
                                />
                                <IconButton color="error" onClick={() => removeAttributeField(key)}>
                                    <RemoveCircle />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>

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
                        label="Expiration Date"
                        name="expirationDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.expirationDate}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="file"
                        inputProps={{ multiple: true }}
                        onChange={handleFileChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add Product
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductModal;
