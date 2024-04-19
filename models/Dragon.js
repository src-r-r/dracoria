const mongoose = require('mongoose');

const dragonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  stage: { type: String, enum: ['egg', 'baby', 'adult'], default: 'egg' },
  hunger: { type: Number, default: 0 },
  happiness: { type: Number, default: 100 }
});

dragonSchema.methods.feed = async function(amount = 1) {
  if (this.hunger > 0) {
    this.hunger = Math.max(0, this.hunger - amount);
    this.happiness = Math.min(100, this.happiness + (10 * amount));
    console.log(`Feeding dragon ${this.name}. Hunger: ${this.hunger}, Happiness: ${this.happiness}`);
    try {
      await this.save();
    } catch (err) {
      console.error('Error saving dragon after feeding:', err);
      throw err;
    }
  } else {
    console.log(`Dragon ${this.name} is not hungry.`);
  }
};

module.exports = mongoose.model('Dragon', dragonSchema);