const multer = require('multer');

// File filter for CSV and Excel files
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV and Excel files are allowed!'));
    }
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/files'); // Adjust the folder path as needed
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadFile = multer({
    storage,
    fileFilter
});

module.exports = uploadFile;
