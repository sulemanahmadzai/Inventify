import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    IconButton,
    TextField,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BulkUploadModal = ({ open, handleClose }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please upload a file before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/inventory/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccessMessage(response.data.message || 'File uploaded successfully.');
            toast.success("File Data Uploaded successfully");  // Success toast
            //handleClose();
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while uploading.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>

            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <ToastContainer position="top-right" />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Bulk Upload</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box mt={2}>
                    <TextField
                        type="file"
                        onChange={handleFileChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ accept: '.csv,.xls,.xlsx' }}
                    />
                </Box>
                {file && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        Selected file: {file.name}
                    </Typography>
                )}
                {error && (
                    <Typography variant="body2" color="error" mt={1}>
                        {error}
                    </Typography>
                )}
                {successMessage && (
                    <Typography variant="body2" color="success.main" mt={1}>
                        {successMessage}
                    </Typography>
                )}
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Submit'}
                    </Button>
                </Box>
            </Box>

        </Modal>
    );
};

export default BulkUploadModal;
