import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { keyframes } from '@mui/system';

const fadeOut = keyframes`
    0% { opacity: 1; }
    100% { opacity: 0; }
`;

const slideIn = keyframes`
    0% { transform: translateX(100%); }
    100% { transform: translateX(0); }
`;

const InventoryTable = ({ inventory, onItemClick, onDelete, onEdit }) => {
    const [items, setItems] = useState(inventory);
    useEffect(() => {
        setItems(inventory);
    }, [inventory]);

    const handleDelete = (itemId) => {
        // Apply fade-out animation before deleting
        const updatedItems = items.filter(item => item.inventoryId !== itemId);
        setItems(updatedItems);
        onDelete(itemId);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer
                sx={{
                    maxHeight: 440,
                    overflowX: 'auto',
                    '@media (max-width: 600px)': {
                        maxWidth: '100%',
                    },
                }}
            >
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
                        '& .MuiTableRow-root:hover': {
                            backgroundColor: '#f0f0f0',
                            transition: 'background-color 0.3s ease-in-out',
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Inventory ID</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Expiration Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(items) && items.length > 0 ? (
                            items.map((item, index) => (
                                <TableRow
                                    key={item.inventoryId}
                                    onClick={() => onItemClick(item)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f0f0f0' },
                                        animation: `${slideIn} 0.3s ease-in-out`,
                                        '&.deleted': {
                                            animation: `${fadeOut} 0.5s forwards`,
                                        },
                                    }}
                                >
                                    <TableCell>{item.inventoryId}</TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>
                                        {Array.isArray(item.categories) && item.categories.length > 0
                                            ? item.categories.join(', ')
                                            : 'No Categories'}
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        {item.expirationDate
                                            ? new Date(item.expirationDate).toLocaleDateString('en-GB')
                                            : 'No Expiry Date'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(item.inventoryId); }}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                        <IconButton onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No inventory items found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default InventoryTable;
