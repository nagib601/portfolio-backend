const mongoose = require('mongoose');

const viewerSchema = new mongoose.Schema({
  browser: String,
  os: String,
  device: String,
  ip: String,
  viewedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Viewer', viewerSchema);