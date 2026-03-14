const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');

const app = express();

// CORS Settings - Vercel এর জন্য এটি খুব জরুরি
app.use(cors({
    origin: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(useragent.express());

// MongoDB Connection Logic (Serverless Optimize)
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ DB Error:", err);
    }
};

// Routes Middleware
app.use('/admin', async (req, res, next) => {
    await connectDB();
    next();
}, adminRoutes);

app.get('/', (req, res) => res.send("Portfolio Backend is Running..."));

// Vercel এর জন্য এক্সপোর্ট
module.exports = app;

// লোকাল হোস্টের জন্য সার্ভার স্টার্ট
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}