const Order = require('../models/Order');

exports.addOrderItems = async (req, res, next) => {
    try {
        const { products, shippingAddress, totalAmount } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        } else {
            const order = new Order({
                userId: req.user._id,
                products,
                shippingAddress,
                totalAmount
            });

            const createdOrder = await order.save();

            res.status(201).json({
                success: true,
                data: createdOrder
            });
        }
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email').populate('products.product', 'title price images');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user._id });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('userId', 'id name');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.orderStatus = req.body.orderStatus;
        order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
        
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
