// models/Category.js
const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: String,
        parentCategoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);