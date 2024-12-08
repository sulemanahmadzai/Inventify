const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const StockAlert = require('../models/StockAlert');
const Product = require('../models/Product'); // Assuming you have a Product model
const Category = require('../models/Category');
const { sendAlertsToManagers } = require('./stockAlertController');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

// Schedule to check stock levels and expiration every day at midnight
cron.schedule('0 0 * * *', async () => {
    await checkStockLevels();  // Call the function periodically
    await sendAlertsToManagers();
});
exports.checkStock = async (req, res) => {
    await checkStockLevels();  // Call the function periodically
    await sendAlertsToManagers();
    res.status(201).json({ message: "Inventory stock level is checked!" });
}

// Add Inventory Item
exports.addInventory = async (req, res) => {
    const { name, description, price, categories, tags, attributes, quantity, threshold, location, expirationDate } = req.body;

    // Check if all required fields are present
    if (!name || !price || !quantity || !location || !expirationDate || !description || !categories || !threshold) {
        return res.status(400).json({ error: 'Name, price, description, quantity, threshold, location, expirationDate, and categories are required.' });
    }

    // Check if price, quantity, threshold, and expirationDate are valid numbers and dates
    if (isNaN(price) || isNaN(quantity) || (threshold && isNaN(threshold))) {
        return res.status(400).json({ error: 'Price, quantity, and threshold must be valid numbers.' });
    }

    if (isNaN(Date.parse(expirationDate))) {
        return res.status(400).json({ error: 'Expiration date must be a valid date.' });
    }

    try {
        // Check if a product with the same name already exists
        const existingProduct = await Product.findOne({ name }).exec();
        if (existingProduct) {
            return res.status(400).json({ error: `Product with name '${name}' already exists.` });
        }

        // Ensure categories is always an array (if it's a single string, wrap it into an array)
        const categoryNames = Array.isArray(categories) ? categories : [categories];

        console.log(categoryNames);
        // Find category IDs based on category names
        const categoryIds = [];
        for (let categoryName of categoryNames) {
            const category = await Category.findOne({ name: categoryName }).exec();
            if (!category) {
                return res.status(400).json({ error: `Category '${categoryName}' not found.` });
            }
            categoryIds.push(category._id);  // Store the category ID
        }

        // Create the product first (without images)
        const newProduct = new Product({
            name,
            description,
            price,
            categories: categoryIds,  // Save the category IDs
            tags,
            attributes,
            images: [],  // Images will be added later
            status: 'available',
        });

        const savedProduct = await newProduct.save();

        // After product creation, handle file upload with multer
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => {
                // Generate image path for saving in the database
                return path.join('uploads', 'product-images', savedProduct.name, file.filename).replace(/\\/g, '/');
            });

            // Update the product with the image paths
            savedProduct.images = uploadedImages;
            await savedProduct.save();
        }

        // Create the inventory item
        const newInventoryItem = new Inventory({
            productId: savedProduct._id,
            quantity,
            threshold,
            location,
            expirationDate,
        });

        const savedInventoryItem = await newInventoryItem.save();

        await manageStockAlerts(savedInventoryItem);
        //await checkStockLevels();  // Check and update all stock and expiration alerts
        // Send the response
        res.status(201).json({ product: savedProduct, inventory: savedInventoryItem });

    } catch (error) {
        // Handle any unexpected errors
        console.error('Error creating inventory:', error);

        if (error.code === 11000) {
            // Duplicate key error (e.g., product name already exists)
            return res.status(400).json({ error: `Duplicate entry: ${error.message}` });
        }

        // Handle other errors (e.g., database issues)
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};
// Update Inventory Item
exports.updateInventory = async (req, res) => {
    const { id } = req.params;
    const { quantity, threshold, location, productPrice, attributes, tags } = req.body;

    // Validate the Inventory ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Inventory ID' });
    }

    try {
        // Find the inventory item by ID
        const inventoryItem = await Inventory.findById(id).populate('productId');
        if (!inventoryItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        // Update the Inventory Item
        if (quantity !== undefined) {
            if (isNaN(quantity) || quantity < 0 || quantity === 0) {
                return res.status(400).json({ error: 'Quantity must be a positive number and greater than 0.' });
            }
            // Add the provided quantity to the existing one
            inventoryItem.quantity += quantity;
        }

        if (threshold !== undefined) {
            if (isNaN(threshold) || threshold < 0 || threshold === 0) {
                return res.status(400).json({ error: 'Threshold must be a non-negative number and greater than 0.' });
            }
            inventoryItem.threshold = threshold;
        }

        if (location !== undefined) {
            if (typeof location !== 'string' || location.trim() === '') {
                return res.status(400).json({ error: 'Location must be a non-empty string' });
            }
            inventoryItem.location = location;
        }

        // Save the updated inventory item
        await inventoryItem.save();

        // Now, update the associated Product details if provided
        if (productPrice !== undefined) {
            if (isNaN(productPrice) || productPrice < 0) {
                return res.status(400).json({ error: 'Product price must be a non-negative number.' });
            }

            // Update the product price
            inventoryItem.productId.price = productPrice;
        }

        if (attributes !== undefined) {
            if (typeof attributes !== 'object' || Array.isArray(attributes)) {
                return res.status(400).json({ error: 'Attributes must be an object of key-value pairs.' });
            }

            // Update the product attributes
            inventoryItem.productId.attributes = attributes;
        }

        if (tags !== undefined) {
            if (!Array.isArray(tags)) {
                return res.status(400).json({ error: 'Tags must be an array of strings.' });
            }

            // Update the product tags
            inventoryItem.productId.tags = tags;
        }

        // Save the updated product details
        await inventoryItem.productId.save();

        // Optionally: Handle stock alerts or other post-save operations
        await manageStockAlerts(inventoryItem); // Manage stock alerts
        //await checkStockLevels();  // Check and update stock levels if necessary
        // Return the updated inventory item
        res.json(inventoryItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Delete Inventory Item
exports.deleteInventory = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Inventory ID' });
    }

    try {
        // Find the inventory item first to get the associated productId
        const inventoryItem = await Inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        // Delete the corresponding product
        const deletedProduct = await Product.findByIdAndDelete(inventoryItem.productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the inventory item
        const deletedItem = await Inventory.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Inventory item deletion failed' });
        }

        // Remove associated alerts
        await StockAlert.deleteMany({ inventoryItemId: id });
        //checkStockLevels();
        res.json({ message: 'Inventory item and corresponding product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Manage Stock Alerts

async function manageStockAlerts(item) {
    const { _id, quantity, threshold, expirationDate } = item;

    // Validate input
    if (!_id || quantity === undefined || threshold === undefined) {
        console.error('Missing necessary inventory data for alert management');
        throw new Error('Missing necessary inventory data');
    }

    console.log(`Managing stock alerts for item ${_id}`);

    try {
        // Helper function to format the expiration date
        function formatExpirationDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString('en-US', options);
        }

        // Remove existing alerts for low stock or out of stock if quantity is updated
        if (quantity > threshold) {
            // Remove Low Stock Alert if quantity is above the threshold
            await StockAlert.deleteOne({ inventoryItemId: _id, type: 'low_stock' });
            console.log(`Low stock alert removed for item ${_id}`);
        }

        if (quantity > 2) {
            // Remove Out of Stock Alert if quantity is greater than 2
            await StockAlert.deleteOne({ inventoryItemId: _id, type: 'out_of_stock' });
            console.log(`Out of stock alert removed for item ${_id}`);
        }

        // Handle Low Stock Alert (if quantity is below threshold but above 2)
        if (quantity <= threshold && quantity > 2) {
            const lowStockAlert = await StockAlert.findOne({ inventoryItemId: _id, type: 'low_stock' });
            if (!lowStockAlert) {
                const newLowStockAlert = new StockAlert({
                    inventoryItemId: _id,
                    type: 'low_stock',
                    message: `Low stock alert for item ${_id}. Current quantity: ${quantity}`,
                });
                await newLowStockAlert.save();
                console.log(`Low stock alert created for item ${_id}`);
            }
        }

        // Handle Out of Stock Alert (if quantity is 2 or less)
        if (quantity <= 2) {
            const outOfStockAlert = await StockAlert.findOne({ inventoryItemId: _id, type: 'out_of_stock' });
            if (!outOfStockAlert) {
                const newOutOfStockAlert = new StockAlert({
                    inventoryItemId: _id,
                    type: 'out_of_stock',
                    message: `Out of stock alert for item ${_id}. Current quantity: ${quantity}`,
                });
                await newOutOfStockAlert.save();
                console.log(`Out of stock alert created for item ${_id}`);
            }
        }

        // Handle Expiring Soon and Expired Alert
        if (expirationDate) {
            const expirationDateObj = new Date(expirationDate);
            const currentDate = new Date();
            const daysUntilExpiration = Math.ceil((expirationDateObj - currentDate) / (1000 * 60 * 60 * 24));

            // Format expiration date
            const formattedExpirationDate = formatExpirationDate(expirationDateObj);

            // If the item is expired
            if (daysUntilExpiration < 0) {
                const expiredAlert = await StockAlert.findOne({
                    inventoryItemId: _id,
                    type: 'expiring_soon',
                    message: `The item is expired. Expiration date: ${formattedExpirationDate}`,
                });
                if (!expiredAlert) {
                    const newExpiredAlert = new StockAlert({
                        inventoryItemId: _id,
                        type: 'expiring_soon',
                        message: `The item is expired. Expiration date: ${formattedExpirationDate}`,
                    });
                    await newExpiredAlert.save();
                    console.log(`Expired alert created for item ${_id}`);
                }
            }
            // If the item is expiring soon (within 7 days)
            else if (daysUntilExpiration <= 7) {
                const expiringAlert = await StockAlert.findOne({
                    inventoryItemId: _id,
                    type: 'expiring_soon',
                    message: `The item is expiring soon. Expiration date: ${formattedExpirationDate}`,
                });
                if (!expiringAlert) {
                    const newExpiringAlert = new StockAlert({
                        inventoryItemId: _id,
                        type: 'expiring_soon',
                        message: `The item is expiring soon. Expiration date: ${formattedExpirationDate}`,
                    });
                    await newExpiringAlert.save();
                    console.log(`Expiring soon alert created for item ${_id}`);
                }
            }
        }

    } catch (error) {
        console.error('Error managing stock alerts:', error);
        throw new Error('Error managing stock alerts');
    }
}

// Check inventory and add stock alerts for items whose quantity is less than the threshold or are expired
async function checkStockLevels() {
    try {
        const inventoryItems = await Inventory.find();

        for (const item of inventoryItems) {
            await manageStockAlerts(item);
        }

    } catch (error) {
        console.error('Error checking stock levels and adding alerts:', error);
    }
}
// Bulk Upload Inventory Function

const parseAttributes = (attributes) => {
    return attributes
        ? attributes.split(',').map(attr => {
            const [key, value] = attr.split(':').map(item => item.trim());
            return { key, value };
        })
        : [];
};

exports.bulkUpload = async (req, res) => {
    try {
        // Step 1: Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Step 2: Determine the file extension
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        if (!['.csv', '.xlsx', '.xls'].includes(fileExtension)) {
            return res.status(400).json({ error: 'Invalid file type. Only CSV and Excel files are allowed.' });
        }

        // Step 3: Parse the file
        const data = fileExtension === '.csv' ? await parseCSV(req.file.path) : await parseExcel(req.file.path);
        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Invalid data in file' });
        }

        // Step 4: Pre-fetch categories and products
        const allCategories = await Category.find({}).exec();
        const categoryMap = new Map(allCategories.map(cat => [cat.name, cat._id]));

        const allProducts = await Product.find({}).exec();
        const productMap = new Map(allProducts.map(prod => [prod.name, prod]));

        const validData = [];
        const invalidData = [];

        // Step 5: Process and validate rows
        for (const row of data) {
            const { name, description, price, categories, attributes, quantity, threshold, location, expirationDate, images } = row;

            // Parse attributes
            const parsedAttributes = parseAttributes(attributes);

            // Validate row data
            const validationResult = validateRow({
                name,
                description,
                price,
                categories,
                attributes: parsedAttributes,
                quantity,
                threshold,
                location,
                expirationDate,
                images,
            });

            if (!validationResult.isValid) {
                invalidData.push({ row, error: validationResult.error });
                continue;
            }

            // Process categories
            const categoryIds = categories.split(',').map(cat => categoryMap.get(cat.trim())).filter(Boolean);

            if (categoryIds.length !== categories.split(',').length) {
                invalidData.push({ row, error: 'Some categories not found' });
                continue;
            }

            validData.push({
                name,
                description,
                price: parseFloat(price),
                categories: categoryIds,
                attributes: parsedAttributes,
                quantity: parseInt(quantity, 10),
                threshold: parseInt(threshold, 10) || 0,
                location,
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                images: images ? images.split(',').map(url => url.trim()) : [],
            });
        }

        // If invalid data exists, return errors
        if (invalidData.length > 0) {
            return res.status(400).json({ errors: invalidData });
        }

        // Step 6: Batch database operations
        await Promise.all(validData.map(async row => {
            const { name, categories, attributes, quantity, threshold, location, expirationDate, images } = row;

            // Check if product exists
            let product = productMap.get(name);
            if (!product) {
                product = new Product({
                    name,
                    description: row.description,
                    price: row.price,
                    categories,
                    attributes,
                    images,
                    status: 'available',
                });
                await product.save();
                productMap.set(name, product);
            }

            // Check if inventory exists
            const inventory = await Inventory.findOne({ productId: product._id }).exec();
            if (inventory) {
                inventory.quantity += quantity;
                inventory.threshold = threshold;
                inventory.location = location;
                inventory.expirationDate = expirationDate;
                await inventory.save();
                await manageStockAlerts(inventory); // Manage stock alerts
            } else {
                const newInventory = new Inventory({
                    productId: product._id,
                    quantity,
                    threshold,
                    location,
                    expirationDate,
                });
                await newInventory.save();
                await manageStockAlerts(newInventory); // Manage stock alerts
            }
        }));

        // Step 7: Send success response
        res.status(201).json({ message: 'Bulk inventory upload successful' });

    } catch (error) {
        console.error('Error processing bulk upload:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};

// Validation function
function validateRow({
    name,
    price,
    categories,
    quantity,
    images,
}) {
    const errorMessages = [];

    if (!name || typeof name !== 'string') errorMessages.push('Name is required and must be a string.');
    if (isNaN(price) || price <= 0) errorMessages.push('Price must be a positive number.');
    if (!categories) errorMessages.push('Categories are required.');
    if (isNaN(quantity) || quantity <= 0) errorMessages.push('Quantity must be a positive number.');
    if (images) {
        const invalidImages = images.split(',').filter(url => !url.startsWith('http'));
        if (invalidImages.length > 0) errorMessages.push(`Invalid image URLs: ${invalidImages.join(', ')}`);
    }

    return errorMessages.length > 0 ? { isValid: false, error: errorMessages } : { isValid: true };
}

// Parse CSV
async function parseCSV(filePath) {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

// Parse Excel
function parseExcel(filePath) {
    try {
        const workbook = xlsx.readFile(filePath, { type: 'file', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(sheet);
    } catch (error) {
        console.error('Error parsing Excel file:', error.message);
        throw new Error('Error parsing Excel file');
    }
}



