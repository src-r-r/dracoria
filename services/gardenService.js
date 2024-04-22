const Garden = require('../models/Garden');
const UserBalance = require('../models/UserBalance'); // Importing the UserBalance model
const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Assuming there's a logger utility based on the comprehensive codebase insight principle
const userBalanceService = require('./userBalanceService');

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
    garden.fruitGrowthTimestamp = Date.now(); // Reset growth timestamp when fruit is harvested
    await garden.save();
    logger.info(`Fruit harvested for garden ${gardenId}. Fruit count reset to 0.`);
    return fruitHarvested;
  } catch (error) {
    logger.error(`Error harvesting fruit for garden ${gardenId}: ${error.message}`, error);
    throw error; // Rethrow the error after logging it
  }
}

async function checkAndGrowFruits() {
  try {
    const gardens = await Garden.find({});
    for (const garden of gardens) {
      const timeNow = new Date();
      const hoursSinceLastGrowth = Math.abs(timeNow - garden.fruitGrowthTimestamp) / 36e5; // Convert milliseconds to hours
      if (hoursSinceLastGrowth >= 1) {
        const fruitsToGrow = Math.floor(hoursSinceLastGrowth);
        garden.fruitCount = Math.min(garden.fruitCount + fruitsToGrow, 10); // Ensure fruit count does not exceed 10
        garden.fruitGrowthTimestamp = new Date(); // Update growth timestamp to current time
        await garden.save();
        logger.info(`Garden ${garden._id} updated. Fruit count: ${garden.fruitCount}`);
      }
    }
  } catch (error) {
    logger.error(`Error in checkAndGrowFruits: ${error.message}`, error);
    throw error;
  }
}

async function pickFruit(userId) {
  try {
    const garden = await Garden.findOne({ userId: userId });
    if (!garden) {
      logger.error(`Garden not found for userId: ${userId}`);
      throw new Error('Garden not found');
    }
    if (garden.fruitCount <= 0) {
      logger.info(`No fruits available to pick for userId: ${userId}`);
      throw new Error('No fruits available to pick');
    }
    garden.fruitCount -= 1;
    garden.fruitGrowthTimestamp = new Date(); // Reset growth timestamp
    await garden.save();
    await userBalanceService.increaseLavaJuice(userId, 1); // Increase lava juice by 1
    logger.info(`Fruit picked from garden for userId: ${userId}. Lava juice increased.`);
    return { fruitCount: garden.fruitCount, lavaJuiceBalance: (await UserBalance.findOne({ userId })).lavaJuice }; // Correctly returning the updated values
  } catch (error) {
    logger.error(`Error picking fruit for userId: ${userId}: ${error.message}`, error);
    throw error;
  }
}

module.exports = {
  harvestFruit,
  checkAndGrowFruits,
  pickFruit,
};