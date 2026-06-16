const path = require('path');
const dotenv = require('dotenv');

// Load env vars with explicit path — works regardless of where node is started from
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const auth = require('./routes/authRoutes');
const products = require('./routes/productRoutes');
const orders = require('./routes/orderRoutes');
const chat = require('./routes/chatRoutes');
const admin = require('./routes/adminRoutes');
const upload = require('./routes/uploadRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/chat', chat);
app.use('/api/admin', admin);
app.use('/api/upload', upload);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.use((req, res) =>
        res.sendFile(path.resolve(__dirname, '../client/dist/index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
