const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  tech: { type: String }, // Optional
  video: { type: String }, // Optional
  description: { type: String }, // Optional (required: true soriye dewa hoyeche)
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);