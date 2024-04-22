const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const Dragon = require('../models/Dragon');
const Garden = require('../models/Garden');
const chatService = require('../services/chatService'); // Assuming chatService is implemented as described
const gardenService = require('../services/gardenService');
const userBalanceService = require('../services/userBalanceService'); // Import userBalanceService
const logger = require('../utils/logger'); // Import logger utility

router.get('/dragon/status', isAuthenticated, async (req, res) => {
  try {
    const dragon = await Dragon.findOne({ userId: req.session.userId });
    if (!dragon) {
      logger.info('No dragon found for the user.');
      return res.status(404).send('Dragon not found');
    }
    res.json(dragon);
  } catch (error) {
    logger.error('Error fetching dragon status:', error);
    res.status(500).send('Error fetching dragon status');
  }
});

router.get('/garden/status', isAuthenticated, async (req, res) => {
  try {
    let garden = await Garden.findOne({ userId: req.session.userId });
    if (!garden) {
      logger.info('No garden found for the user, creating a default garden.');
      garden = await Garden.create({
        userId: req.session.userId,
        treeType: 'lava', // make a lava tree the default tree type
        fruitCount: 0,
        lastHarvested: new Date()
      });
    }
    res.json(garden);
  } catch (error) {
    logger.error('Error fetching garden status:', error);
    res.status(500).send('Error fetching garden status');
  }
});

router.post('/dragon/chat', isAuthenticated, async (req, res) => {
  try {
    const { message, dragonId } = req.body; // Ensure dragonId is included in the request body
    if (!dragonId) {
      logger.info('Dragon ID is missing in the request.');
      return res.status(400).send('Dragon ID is required.');
    }
    // Validate dragonId belongs to the authenticated user
    const dragon = await Dragon.findOne({ _id: dragonId, userId: req.session.userId });
    if (!dragon) {
      logger.info('Dragon not found or does not belong to the user.');
      return res.status(403).send('Unauthorized access to the dragon.');
    }
    const response = await chatService.chatWithDragon(req.session.userId, dragonId, message);
    res.json({ reply: response });
  } catch (error) {
    logger.error('Error in dragon chat interaction:', error);
    res.status(500).send('Error in dragon chat interaction');
  }
});

// delete conversation history with dragon
router.delete('/dragon/conversation', isAuthenticated, async (req, res) => {
  try {
    const { dragonId } = req.query; // Assume dragonId is passed as a query parameter
    if (!dragonId) {
      logger.info('Dragon ID is missing in the request.');
      return res.status(400).send('Dragon ID is required.');
    }
    // Validate dragonId belongs to the authenticated user
    const dragonExists = await Dragon.findOne({ _id: dragonId, userId: req.session.userId });
    if (!dragonExists) {
      logger.info('Dragon not found or does not belong to the user.');
      return res.status(403).send('Unauthorized access to the dragon.');
    }
    const conversation = await chatService.deleteConversationHistory(req.session.userId, dragonId);
    res.json({ conversation });
  } catch (error) {
    logger.error('Error deleting conversation history:', error);
    res.status(500).send('Error deleting conversation history');
  }
});

router.get('/dragon/conversation', isAuthenticated, async (req, res) => {
  try {
    const { dragonId } = req.query; // Assume dragonId is passed as a query parameter
    if (!dragonId) {
      logger.info('Dragon ID is missing in the request.');
      return res.status(400).send('Dragon ID is required.');
    }
    // Validate dragonId belongs to the authenticated user
    const dragonExists = await Dragon.findOne({ _id: dragonId, userId: req.session.userId });
    if (!dragonExists) {
      logger.info('Dragon not found or does not belong to the user.');
      return res.status(403).send('Unauthorized access to the dragon.');
    }
    const conversation = await chatService.getConversationHistory(req.session.userId, dragonId);
    res.json({ conversation });
  } catch (error) {
    logger.error('Error fetching conversation history:', error);
    res.status(500).send('Error fetching conversation history');
  }
});

router.post('/garden/pick-fruit', isAuthenticated, async (req, res) => {
  try {
    const result = await gardenService.pickFruit(req.session.userId);
    if (!result) {
      logger.error(`Error picking fruit for userId: ${req.session.userId}: No fruit available to pick or lava juice could not be increased.`);
      return res.status(400).send('No fruit available to pick or lava juice could not be increased.');
    }
    res.json({ message: 'Fruit successfully picked and lava juice increased.', fruitCount: result.fruitCount, lavaJuiceBalance: result.lavaJuiceBalance });
  } catch (error) {
    logger.error(`Error picking fruit for userId: ${req.session.userId}: ${error}`, error);
    res.status(500).send('Error picking fruit');
  }
});

router.post('/dragon/give-juice', isAuthenticated, async (req, res) => {
  try {
    const result = await userBalanceService.giveLavaJuiceToDragon(req.session.userId);
    if (!result) {
      logger.error(`Error giving lava juice to dragon for userId: ${req.session.userId}: Insufficient lava juice balance or no dragon egg found.`);
      return res.status(400).send('Insufficient lava juice balance or no dragon egg found.');
    }
    res.json({ message: 'Lava juice given to dragon successfully.', experience: result.experience, energy: result.energy });
  } catch (error) {
    logger.error(`Error giving lava juice to dragon egg for userId: ${req.session.userId}: ${error}`, error);
    res.status(500).send('Error giving lava juice to dragon egg');
  }
});

router.post('/dragon/feed', isAuthenticated, async (req, res) => {
  try {
    const { dragonId } = req.body;
    if (!dragonId) {
      return res.status(400).send('Dragon ID is required.');
    }
    const dragon = await Dragon.findById(dragonId);
    if (!dragon) {
      return res.status(404).send('Dragon not found.');
    }
    if (dragon.userId.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized access to the dragon.');
    }
    await dragon.feed(1); // Feed with default amount
    res.json({ message: 'Dragon fed successfully.', energy: dragon.energy, experiencePoints: dragon.experiencePoints, stage: dragon.stage });
  } catch (error) {
    logger.error('Error feeding dragon:', error);
    res.status(500).send('Error feeding dragon');
  }
});

module.exports = router;