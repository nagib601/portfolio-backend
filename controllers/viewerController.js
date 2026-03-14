const Viewer = require('../models/Viewer');

exports.trackViewer = async (req, res) => {
  try {
    const { browser, os, isMobile, isDesktop } = req.useragent;
    const newViewer = new Viewer({
      browser,
      os,
      device: isMobile ? "Mobile" : isDesktop ? "Desktop" : "Tablet",
      ip: req.ip
    });
    await newViewer.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Viewer.countDocuments();
    const today = await Viewer.countDocuments({
      viewedAt: { $gte: new Date().setHours(0,0,0,0) }
    });
    res.json({ success: true, total, today });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};