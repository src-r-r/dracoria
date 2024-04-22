const mongoose = require('mongoose');
const { getIo } = require('../server'); // Adjusted to use getIo function for socket.io instance

const dragonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  stage: { type: String, enum: ['egg', 'baby', 'child', 'adolescent', 'adult'], default: 'egg' },
  hunger: { type: Number, default: 0 },
  happiness: { type: Number, default: 100 },
  experience: { type: Number, default: 0 }, // Existing field for experience tracking
  energy: { type: Number, default: 100 }, // New field for energy
  experiencePoints: { type: Number, default: 0 } // New field for experience points
});

dragonSchema.methods.feed = async function(amount = 1) {
  if (this.hunger > 0) {
    this.hunger = Math.max(0, this.hunger - amount);
    this.happiness = Math.min(100, this.happiness + (10 * amount));
    console.log(`Feeding dragon ${this.name}. Hunger: ${this.hunger}, Happiness: ${this.happiness}`);
  } else {
    console.log(`Dragon ${this.name} is not hungry.`);
  }
  // Always increase energy and experience points when fed
  this.energy = Math.min(100, this.energy + (10 * amount));
  this.experiencePoints += amount;
  // Update stage based on experience points
  const newLevel = Math.floor(Math.log10(this.experiencePoints + 1));
  const stages = ['egg', 'baby', 'child', 'adolescent', 'adult'];
  this.stage = stages[newLevel] || this.stage;
  console.log(`Dragon ${this.name} fed. Energy: ${this.energy}, Experience Points: ${this.experiencePoints}, Stage: ${this.stage}`);
  try {
    await this.save();
    // Emitting event for real-time update after feeding the dragon
    const io = getIo(); // Correctly obtaining io instance
    io.emit('dragonStatsUpdate', { dragonId: this._id, newEnergy: this.energy, newExperiencePoints: this.experiencePoints, newStage: this.stage });
    console.log(`Emitting dragonStatsUpdate event for dragon ${this._id}`);
  } catch (err) {
    console.error('Error saving dragon after feeding:', err);
    throw err;
  }
};

module.exports = mongoose.model('Dragon', dragonSchema);