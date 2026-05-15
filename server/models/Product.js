const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Electronics', 'Fashion', 'Shoes', 'Watches', 'Beauty', 'Home & Kitchen', 'Grocery', 'Books', 'Mobiles', 'Laptops', 'Gaming', 'Accessories']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    discountPrice: {
        type: Number
    },
    features: {
        type: [String]
    },

    images: {
        type: [String],
        default: ['https://via.placeholder.com/400x400?text=Product+Image']
    },
    stock: {
        type: Number,
        required: [true, 'Please add a stock quantity'],
        default: 0
    },
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
