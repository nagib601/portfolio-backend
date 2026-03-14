const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  tech: { type: String },
  video: { type: String },
  description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);