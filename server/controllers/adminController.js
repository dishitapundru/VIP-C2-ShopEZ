const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'USER' });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

        const revenueAgg = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // Orders by status for chart
        const statusCounts = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);

        // Monthly revenue for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, orderStatus: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const categories = await Product.distinct('category');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                totalCategories: categories.length,
                statusCounts,
                monthlyRevenue
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'USER' }).sort({ createdAt: -1 });

        // Get order count per user
        const userIds = users.map(u => u._id);
        const orderCounts = await Order.aggregate([
            { $match: { userId: { $in: userIds } } },
            { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);
        const orderCountMap = {};
        orderCounts.forEach(oc => { orderCountMap[oc._id.toString()] = oc.count; });

        const usersWithOrders = users.map(u => ({
            ...u.toObject(),
            orderCount: orderCountMap[u._id.toString()] || 0
        }));

        res.status(200).json({ success: true, count: users.length, data: usersWithOrders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.role === 'ADMIN') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
        await user.deleteOne();
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/admin/users/:id/block
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.role === 'ADMIN') return res.status(403).json({ success: false, message: 'Cannot block admin' });
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.status(200).json({ success: true, data: user, message: user.isBlocked ? 'User blocked' : 'User unblocked' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('products.product', 'title images price')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        order.orderStatus = req.body.orderStatus || order.orderStatus;
        if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
        await order.save();
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
