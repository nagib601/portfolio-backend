const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Viewer = require('../models/Viewer');
const User = require('../models/User'); 

// --- ১. লগইন রাউট (Database Based) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ডাটাবেসে ইমেইল এবং পাসওয়ার্ড চেক করা
    // .select("+password") দেওয়া হয়েছে যদি মডেল-এ password select: false করা থাকে
    const admin = await User.findOne({ email, password });

    if (admin) {
      res.json({ success: true, message: "Login Successful" });
    } else {
      res.status(401).json({ success: false, message: "ইমেইল বা পাসওয়ার্ড ভুল!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "সার্ভারে সমস্যা হয়েছে" });
  }
});

// --- ২. প্রজেক্ট রাউটস ---
router.get('/projects/all', async (req, res) => {
  try {
    // .lean() যোগ করা হয়েছে ফাস্ট ডাটা রিড করার জন্য
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/projects/add', async (req, res) => {
  try {
    const { title, image, link, tech, video, description } = req.body;
    if (!title || !image || !link) {
      return res.status(400).json({ success: false, message: "সবগুলো ঘর পূরণ করুন" });
    }
    const newProject = new Project({ title, image, link, tech, video, description });
    await newProject.save();
    res.json({ success: true, message: "প্রজেক্ট সফলভাবে যুক্ত হয়েছে!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/projects/delete/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted!" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// --- ৩. ভিউয়ার রাউটস ---
router.post('/viewers/track', async (req, res) => {
  try {
    const { browser, os, isMobile, isDesktop } = req.useragent;
    const newViewer = new Viewer({
      browser,
      os,
      device: isMobile ? "Mobile" : isDesktop ? "Desktop" : "Tablet",
      // Vercel এর জন্য IP ট্র্যাকিং অপ্টিমাইজড
      ip: req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
    });
    await newViewer.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get('/viewers/stats', async (req, res) => {
  try {
    // সব কাউন্ট একসাথে করার জন্য Promise.all ব্যবহার করলে ফাস্ট হয়
    const [total, today, totalProjects] = await Promise.all([
      Viewer.countDocuments(),
      Viewer.countDocuments({ viewedAt: { $gte: new Date().setHours(0,0,0,0) } }),
      Project.countDocuments()
    ]);
    
    res.json({ success: true, total, today, totalProjects });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get('/viewers/all', async (req, res) => {
  try {
    const viewers = await Viewer.find().sort({ viewedAt: -1 }).limit(100).lean();
    res.json({ success: true, viewers });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;