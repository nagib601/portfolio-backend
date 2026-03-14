const mongoose = require('mongoose');

const viewerSchema = new mongoose.Schema({
  ip: { 
    type: String, 
    required: true, 
    unique: true // একই IP থেকে একাধিক ডাটা ঢুকতে বাধা দেবে
  },
  browser: String,
  os: String,
  device: String,
  // ইউজার কোন কোন পেজ ভিজিট করেছে তার লিস্ট (যেমন: ["Home", "About"])
  pagesViewed: { 
    type: [String], 
    default: [] 
  },
  // সর্বশেষ কখন ভিজিট করেছে সেটি আপডেট হবে
  viewedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Viewer', viewerSchema);