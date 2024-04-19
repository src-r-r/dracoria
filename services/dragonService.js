const Dragon = require('../models/Dragon');
const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Assuming there's a logger utility based on the comprehensive codebase insight

async function feedDragon(dragonId) {
  if (!mongoose.Types.ObjectId.isValid(dragonId)) {
    logger.error(`Invalid dragonId: ${dragonId}`);
    throw new Error('Invalid dragon ID provided');
  }

  try {
    const dragon = await Dragon.findById(dragonId);
    if (!dragon) {
      logger.error(`Dragon not found with ID: ${dragonId}`);
      throw new Error('Dragon not found');
    }
    if (dragon.hunger > 0) {
      dragon.hunger--;
      dragon.happiness = Math.min(100, dragon.happiness + 10);
      await dragon.save();
      logger.info(`Fed dragon ${dragon.name}. Hunger: ${dragon.hunger}, Happiness: ${dragon.happiness}`);
    } else {
      logger.info(`Dragon ${dragon.name} is not hungry.`);
    }
    return dragon;
  } catch (error) {
    logger.error('Error feeding dragon:', error);
    throw error;
  }
}

module.exports = {
  feedDragon
};