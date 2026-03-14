const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- CORS Settings ---
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://portfolio-frontend-gold-seven.vercel.app" // আপনার বর্তমান ফ্রন্টএন্ড লিঙ্ক
    ], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(useragent.express());

// --- MongoDB Connection Logic (Serverless Optimized) ---
let isConnected = false; 

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log("✅ New MongoDB Connection Created");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
    }
};

// --- Routes Middleware ---
app.use('/admin', async (req, res, next) => {
    await connectDB();
    next();
}, adminRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({ 
        status: "Active", 
        message: "Portfolio Backend is Running...",
        time: new Date().toLocaleString()
    });
});

// Vercel এর জন্য এক্সপোর্ট
module.exports = app;

// লোকাল হোস্টের জন্য সার্ভার স্টার্ট
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
}