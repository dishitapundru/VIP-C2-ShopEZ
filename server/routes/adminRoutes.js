const express = require('express');
const {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    toggleBlockUser,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin auth
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/block', toggleBlockUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
