const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;  // Make sure to include this line for Schema to be defined properly

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        personalDetail: {
            profilePic: { type: String, default: '' },
            address: { type: String, default: '' },
            bio: { type: String, default: '' },
            phoneNumber: { type: String, default: '' },
            dateOfBirth: { type: Date },
        },
        role: { type: String, enum: ['manager', 'admin'] },
        accountStatus: { type: String, enum: ['active', 'deactivated', 'deleted'], default: 'active' },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare the provided password with the hashed one
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
