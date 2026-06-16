const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Electronics', 'Mobiles', 'Laptops', 'Watches', 'Shoes', 'Footwear',
            'Beauty', 'Home & Kitchen', 'Grocery', 'Books', 'Gaming', 'Accessories',
            "Men's Fashion", "Women's Fashion", "Kids Fashion"
        ]
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Kids', 'Unisex'],
        default: 'Unisex'
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
    specifications: {
        type: Map,
        of: String
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
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
