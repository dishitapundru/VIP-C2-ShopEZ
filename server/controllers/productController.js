const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
    try {
        const { category, gender, sort, keyword, page: pageQ, limit: limitQ } = req.query;

        let filter = {};

        // Keyword search
        if (keyword) {
            filter.title = { $regex: keyword, $options: 'i' };
        }

        // Category filter
        if (category) filter.category = category;

        // Gender filter
        if (gender) filter.gender = gender;

        // Sort
        let sortObj = { createdAt: -1 }; // default: newest
        if (sort === 'price-low') sortObj = { price: 1 };
        else if (sort === 'price-high') sortObj = { price: -1 };
        else if (sort === 'highest-rated') sortObj = { ratings: -1 };
        else if (sort === 'popular') sortObj = { numReviews: -1 };
        // 'new-arrivals' and 'highest-discount' handled below

        const page = parseInt(pageQ, 10) || 1;
        const limit = parseInt(limitQ, 10) || 100;
        const startIndex = (page - 1) * limit;

        const total = await Product.countDocuments(filter);
        let products = await Product.find(filter).sort(sortObj).skip(startIndex).limit(limit);

        // Highest discount: computed field, sort in JS
        if (sort === 'highest-discount') {
            products = products.sort((a, b) => {
                const discA = a.discountPrice ? ((a.price - a.discountPrice) / a.price) : 0;
                const discB = b.discountPrice ? ((b.price - b.discountPrice) / b.price) : 0;
                return discB - discA;
            });
        }

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            data: products
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        await product.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
