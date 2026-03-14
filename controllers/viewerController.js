const Viewer = require('../models/Viewer');

exports.trackViewer = async (req, res) => {
  try {
    const { pageName } = req.body;
    const { browser, os, isMobile, isDesktop } = req.useragent;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    await Viewer.findOneAndUpdate(
      { ip: ip }, // এই IP দিয়ে খুঁজবে
      { 
        $set: { 
          browser, 
          os, 
          device: isMobile ? "Mobile" : isDesktop ? "Desktop" : "Tablet",
          viewedAt: Date.now() // টাইম আপডেট হবে
        },
        $addToSet: { pagesViewed: pageName || 'Home' } // নতুন পেজ হলে লিস্টে যোগ হবে, ডুপ্লিকেট হবে না
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Tracking Error:", err);
    res.status(500).json({ success: false });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Viewer.countDocuments();
    const today = await Viewer.countDocuments({
      viewedAt: { $gte: new Date().setHours(0,0,0,0) }
    });
    // ড্যাশবোর্ডের টেবিলের জন্য সব ভিউয়ার ডাটা পাঠানো হচ্ছে
    const viewers = await Viewer.find().sort({ viewedAt: -1 });
    
    res.json({ success: true, total, today, viewers });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};