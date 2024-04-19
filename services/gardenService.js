const Garden = require('../models/Garden');
const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Assuming there's a logger utility based on the comprehensive codebase insight principle

async function harvestFruit(gardenId) {
  if (!mongoose.Types.ObjectId.isValid(gardenId)) {
    logger.error(`Invalid gardenId: ${gardenId}`);
    throw new Error('Invalid garden ID provided');
  }

  try {
    const garden = await Garden.findById(gardenId);
    if (!garden) {
      logger.error(`Garden not found with ID: ${gardenId}`);
      throw new Error('Garden not found');
    }
    const fruitHarvested = garden.fruitCount;
    garden.fruitCount = 0; // Assuming all fruits are harvested at once.
    garden.lastHarvested = Date.now();
    await garden.save();
    logger.info(`Fruit harvested for garden ${gardenId}. Fruit count reset to 0.`);
    return fruitHarvested;
  } catch (error) {
    logger.error(`Error harvesting fruit for garden ${gardenId}: ${error.message}`, error);
    throw error; // Rethrow the error after logging it
  }
}

module.exports = {
  harvestFruit,
};