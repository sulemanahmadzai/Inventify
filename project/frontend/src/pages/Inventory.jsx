import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, Pagination, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';  // Import the useTheme hook
import { fetchInventory } from '../API/Inventory/InventoryAPIs';
import InventoryTable from '../tableComponents/InventoryTable';
import AddProductModal from '../modalsComponent/AddProductModal';
import ViewItemModal from '../modalsComponent/ViewItemModal ';
import EditProductModal from '../modalsComponent/EditProductModal';
import ConfirmationDialog from '../modalsComponent/ConfirmationDialog'; // Import the dialog
import BulkUploadModal from '../modalsComponent/bulkUploadModal';
import { motion } from 'framer-motion'; // Import Framer Motion
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Inventory = () => {
    const theme = useTheme();  // Access the theme using the useTheme hook
    const [inventory, setInventory] = useState([]); // for inventory table data
    const [page, setPage] = useState(1); // current page for table data
    const [totalPages, setTotalPages] = useState(1); // total pages of inventory data
    const [inventoryId, setInventoryId] = useState(''); // Search by inventory ID
    const [productName, setProductName] = useState(''); // Search by product name
    const [category, setCategory] = useState(''); // Search by category
    const [quantity, setQuantity] = useState(''); // Search by quantity
    const [sortBy, setSortBy] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // add product
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // edit product
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null); // inventory item for delete
    const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    // For delete confirmation
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const loadInventory = async () => {
            try {
                const data = await fetchInventory(page, inventoryId, productName, category, quantity, sortBy);
                setInventory(data.data); // Set the inventory items
                setTotalPages(data.pagination.totalPages); // Set the total pages from response
            } catch (error) {
                setInventory([]);
            }
        };

        loadInventory();
    }, [inventoryId, productName, category, quantity, sortBy, page]); // Re-fetch when any filter or page changes

    const handleEdit = (product) => {
        setSelectedInventoryItem(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        setDeleteItemId(id); // Store the item to be deleted
        setIsDeleteDialogOpen(true); // Open the confirmation dialog
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/inventory/delete/${deleteItemId}`);
            setInventory(inventory.filter(item => item.inventoryId !== deleteItemId)); // Remove from state
            setIsDeleteDialogOpen(false); // Close the dialog
            setDeleteItemId(null); // Clear the delete ID
            toast.success('Item deleted successfully!'); // Show success toast
        } catch (error) {
            console.error('Error deleting item', error);
            toast.error('Failed to delete item. Please try again.'); // Show error toast
        }
    };


    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'inventoryId':
                setInventoryId(value);
                break;
            case 'productName':
                setProductName(value);
                break;
            case 'category':
                setCategory(value);
                break;
            case 'quantity':
                setQuantity(value);
                break;
            default:
                break;
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handlePageChange = (event, value) => {
        setPage(value); // Update the current page
    };

    const isSmallScreen = useMediaQuery('(max-width:599px)');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }} // Fade-in for the whole page
        >
            <ToastContainer position="top-right" />

            <Box sx={{ p: 3 }}>
                {/* Buttons with animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, flexDirection: 'row', gap: 2 }}>
                        <Button variant="contained" sx={{ width: 'auto', bgcolor: 'button.primary', color: 'text.secondary' }} onClick={() => setIsAddProductModalOpen(true)}>
                            Add Product
                        </Button>
                        <Button variant="contained" sx={{ width: 'auto', bgcolor: 'button.primary', color: 'text.secondary' }} onClick={() => setBulkUploadModalOpen(true)}>
                            Bulk Upload
                        </Button>
                    </Box>
                </motion.div>

                {/* Search Section with responsiveness */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            mt: 1,
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Inventory ID"
                            variant="outlined"
                            size="small"
                            name="inventoryId"
                            value={inventoryId}
                            onChange={handleSearchChange}
                            sx={{ flex: isSmallScreen ? 'none' : 1, width: isSmallScreen ? '100%' : 'auto', backgroundColor: 'charts.bg', boxShadow: 3, color: 'charts.text' }}
                            inputProps={{
                                style: {
                                    color: theme.palette.charts.text,  // Theme-based text color (black or whatever is set in the theme)
                                },

                            }}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.charts.text, // Sets the label color to black when inside the search bar
                                },
                            }}
                        />
                        <TextField
                            label="Product Name"
                            variant="outlined"
                            size="small"
                            name="productName"
                            value={productName}
                            onChange={handleSearchChange}
                            sx={{ flex: isSmallScreen ? 'none' : 1, width: isSmallScreen ? '100%' : 'auto', backgroundColor: 'charts.bg', boxShadow: 3, color: 'charts.text' }}
                            inputProps={{
                                style: {
                                    color: theme.palette.charts.text,  // Theme-based text color (black or whatever is set in the theme)
                                },

                            }}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.charts.text, // Sets the label color to black when inside the search bar
                                },
                            }}
                        />
                        <TextField
                            label="Category"
                            variant="outlined"
                            size="small"
                            name="category"
                            value={category}
                            onChange={handleSearchChange}
                            sx={{ flex: isSmallScreen ? 'none' : 1, width: isSmallScreen ? '100%' : 'auto', backgroundColor: 'charts.bg', boxShadow: 3, color: 'charts.text' }}
                            inputProps={{
                                style: {
                                    color: theme.palette.charts.text,  // Theme-based text color (black or whatever is set in the theme)
                                },

                            }}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.charts.text, // Sets the label color to black when inside the search bar
                                },
                            }}
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            size="small"
                            name="quantity"
                            value={quantity}
                            onChange={handleSearchChange}
                            sx={{ flex: isSmallScreen ? 'none' : 1, width: isSmallScreen ? '100%' : 'auto', backgroundColor: 'charts.bg', boxShadow: 3, color: 'charts.text' }}
                            inputProps={{
                                style: {
                                    color: theme.palette.charts.text,  // Theme-based text color (black or whatever is set in the theme)
                                },

                            }}
                            InputLabelProps={{
                                style: {
                                    color: theme.palette.charts.text, // Sets the label color to black when inside the search bar
                                },
                            }}
                        />
                        <Select
                            displayEmpty
                            size="small"
                            value={sortBy}
                            onChange={handleSortChange}
                            sx={{
                                minWidth: 150, backgroundColor: 'charts.bg', boxShadow: 3,
                                color: 'charts.text'
                            }}
                        >
                            <MenuItem value="">Sort By</MenuItem>
                            <MenuItem value="threshold">Threshold</MenuItem>
                            <MenuItem value="quantity">Quantity</MenuItem>
                            <MenuItem value="expirationDate">Expiration Date</MenuItem>
                        </Select>
                    </Box>
                </motion.div>

                {/* Inventory Table with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                >
                    <InventoryTable
                        inventory={inventory}
                        onItemClick={(item) => setCurrentItem(item)}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                </motion.div>

                {/* Pagination with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
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
                            }} />
                    </Box>
                </motion.div>

                {/* Modals */}
                <ViewItemModal
                    open={!!currentItem}
                    onClose={() => setCurrentItem(null)}
                    item={currentItem}
                />
                <EditProductModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    item={selectedInventoryItem}
                />
                <AddProductModal open={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)} />
                <BulkUploadModal open={bulkUploadModalOpen} handleClose={() => setBulkUploadModalOpen(false)} />
                <ConfirmationDialog
                    open={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={confirmDelete}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this item?"
                />
            </Box>
        </motion.div>
    );
};

export default Inventory;
