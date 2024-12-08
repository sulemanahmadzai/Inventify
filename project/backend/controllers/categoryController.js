const Category = require('../models/Category');

// Add a new category
exports.addCategory = async (req, res) => {
    try {
        const { name, description, parentCategoryId } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }

        // Check if category name is unique
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category name must be unique" });
        }

        // Validate parentCategoryId (if provided)
        if (parentCategoryId) {
            const parentCategory = await Category.findById(parentCategoryId);
            if (!parentCategory) {
                return res.status(404).json({ message: "Parent category not found" });
            }
        }

        const newCategory = new Category({ name, description, parentCategoryId });
        await newCategory.save();
        res.status(201).json({ message: "Category added successfully", data: newCategory });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category name already exists" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Update an existing category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, parentCategoryId } = req.body;

        // Validate category existence
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Validate unique name (if provided and different from the current name)
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: "Category name must be unique" });
            }
        }

        // Validate parentCategoryId (if provided)
        if (parentCategoryId && parentCategoryId !== id) {
            const parentCategory = await Category.findById(parentCategoryId);
            if (!parentCategory) {
                return res.status(404).json({ message: "Parent category not found" });
            }
        }
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }
        // Update fields
        if (name) category.name = name;
        if (description) category.description = description;
        category.parentCategoryId = parentCategoryId || null;

        await category.save();
        res.status(200).json({ message: "Category updated successfully", data: category });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category name already exists" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate category existence
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Ensure no child categories exist
        const childCategories = await Category.find({ parentCategoryId: id });
        if (childCategories.length > 0) {
            return res.status(400).json({ message: "Cannot delete category with child categories" });
        }

        await category.deleteOne();  // Use deleteOne() instead of remove()
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// View all categories
exports.viewAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parentCategoryId', 'name');
        res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
