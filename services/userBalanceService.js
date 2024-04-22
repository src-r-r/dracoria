const UserBalance = require('../models/UserBalance');
const Dragon = require('../models/Dragon'); // Importing the Dragon model
const logger = require('../utils/logger');
const { getIo } = require('../server'); // Adjusted import to use a getter function for io

async function increaseLavaJuice(userId, amount) {
  try {
    let userBalance = await UserBalance.findOne({ userId });
    if (!userBalance) {
      // If UserBalance does not exist, create it with a balance of 0
      userBalance = new UserBalance({ userId, lavaJuice: 0 });
      await userBalance.save();
      logger.info(`UserBalance created for userId: ${userId} with initial lavaJuice: 0`);
    }
    userBalance.lavaJuice += amount;
    await userBalance.save();
    logger.info(`Increased lava juice for userId: ${userId} by ${amount}`);
    //const io = getIo(); // Using the getter function to obtain the io instance
    //io.emit('lavaJuiceUpdate', { userId, newBalance: userBalance.lavaJuice }); // Emitting event for real-time update
  } catch (error) {
    logger.error(`Error increasing lava juice for userId: ${userId}: ${error}`, error);
    throw error;
  }
}

async function giveLavaJuiceToDragon(userId) {
  try {
    let userBalance = await UserBalance.findOne({ userId });
    if (!userBalance) {
      // If UserBalance does not exist, create it with a balance of 0
      userBalance = new UserBalance({ userId, lavaJuice: 0 });
      await userBalance.save();
      logger.info(`UserBalance created for userId: ${userId} with initial lavaJuice: 0`);
    }
    if (userBalance.lavaJuice < 1) {
      logger.error(`Insufficient lava juice balance for userId: ${userId}. Available balance: ${userBalance.lavaJuice}`);
      throw new Error('Insufficient lava juice balance');
    }
    userBalance.lavaJuice -= 1; // Decrease lava juice by 1
    await userBalance.save();
    logger.info(`Decreased lava juice for userId: ${userId} by 1`);

    const dragon = await Dragon.findOne({ userId });
    if (!dragon) {
      logger.error(`No dragon egg found for userId: ${userId}`);
      throw new Error('No dragon egg found for user');
    }
    dragon.experiencePoints += 1; // Increase experience by 1
    if (dragon.experiencePoints >= 10 && dragon.stage === 'egg') { // Check if experience is enough to hatch
      dragon.stage = 'baby'; // Update dragon stage to baby
    }
    // Update stage based on experience points
    const newLevel = Math.floor(Math.log10(dragon.experiencePoints + 1));
    const stages = ['egg', 'baby', 'child', 'adolescent', 'adult'];
    dragon.stage = stages[newLevel] || dragon.stage;
    await dragon.save();
    logger.info(`Increased experience for dragon of userId: ${userId} by 1. New stage: ${dragon.stage}`);
    //const io = getIo(); // Using the getter function to obtain the io instance
    //io.emit('dragonStatsUpdate', { userId, dragonId: dragon._id, newEnergy: dragon.energy, newExperiencePoints: dragon.experiencePoints, newStage: dragon.stage }); // Emitting event for real-time update

  } catch (error) {
    logger.error(`Error giving lava juice to dragon egg for userId: ${userId}: ${error}`, error);
    throw error;
  }
}

module.exports = {
  increaseLavaJuice,
  giveLavaJuiceToDragon, // Exporting the new method
};