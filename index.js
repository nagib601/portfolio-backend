const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- ডাইনামিক CORS সেটিংস ---
const allowedOrigins = [
    "http://localhost:5173",
    "https://portfolio-frontend-gold-seven.vercel.app" // আপনার প্রোডাকশন লিঙ্ক
];

app.use(cors({
    origin: function (origin, callback) {
        // origin নেই (যেমন মোবাইল অ্যাপ বা পোস্টম্যান) অথবা যদি ভেরসেল ডোমেইন বা লোকালহোস্ট হয়
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(useragent.express());

// --- MongoDB কানেকশন (Serverless Optimized) ---
let isConnected = false; 

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected) return;

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log("✅ Database Connected");
    } catch (err) {
        console.error("❌ MongoDB Error:", err.message);
    }
};

// --- মিডলওয়্যার এবং রাউটস ---
app.use('/admin', async (req, res, next) => {
    await connectDB();
    next();
}, adminRoutes);

app.get('/', (req, res) => {
    res.json({ 
        status: "Active", 
        message: "Portfolio Backend is Running...",
        time: new Date().toLocaleString()
    });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}