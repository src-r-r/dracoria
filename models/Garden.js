const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  treeType: { type: String, required: true },
  fruitCount: { type: Number, default: 0 },
  lastHarvested: { type: Date, default: Date.now }
});

gardenSchema.methods.harvestFruit = async function() {
  try {
    this.fruitCount = 0;
    this.lastHarvested = new Date();
    await this.save();
    console.log(`Fruit harvested for garden ${this._id}`);
  } catch (error) {
    console.error(`Error harvesting fruit for garden ${this._id}: ${error.message}`, error);
    throw error; // Rethrow the error after logging it
  }
};

module.exports = mongoose.model('Garden', gardenSchema);