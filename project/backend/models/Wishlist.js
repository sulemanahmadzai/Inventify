// models/Wishlist.js
const mongoose = require('mongoose');

const { Schema } = mongoose;

const WishlistSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
        items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Wishlist', WishlistSchema);
