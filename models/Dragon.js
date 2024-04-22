const mongoose = require('mongoose');
const { getIo } = require('../server'); // Adjusted to use getIo function for socket.io instance

const dragonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  stage: { type: String, enum: ['egg', 'baby', 'child', 'adolescent', 'adult'], default: 'egg' },
  experience: { type: Number, default: 0 }, // Existing field for experience tracking
  energy: { type: Number, default: 100 }, // New field for energy
  experiencePoints: { type: Number, default: 0 } // New field for experience points
});

module.exports = mongoose.model('Dragon', dragonSchema);