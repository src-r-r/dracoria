const { Configuration, OpenAIApi } = require('openai');
const Conversation = require('../models/Conversation');
const logger = require('../utils/logger');
const Dragon = require('../models/Dragon');
const User = require('../models/User'); // Added to access the User model for OpenAI key retrieval

const chatWithDragon = async (userId, dragonId, messageText) => {
  if (!dragonId) {
    logger.error('Dragon ID is undefined.');
    throw new Error('Dragon ID is undefined.');
  }

  // Retrieve the user's OpenAI API key or use the default
  let userApiKey;
  try {
    const user = await User.findById(userId);
    userApiKey = user.openAIKey || process.env.OPENAI_API_KEY;
  } catch (error) {
    logger.error('Error retrieving user for OpenAI API key:', error.message, error.stack);
    throw new Error('Error retrieving user information');
  }

  const configuration = new Configuration({
    apiKey: userApiKey,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const dragonExists = await Dragon.findById(dragonId);
    if (!dragonExists) {
      logger.error(`Dragon not found with ID: ${dragonId}`);
      throw new Error('Dragon not found');
    }

    let conversation = await Conversation.findOne({ userId, dragonId });
    if (!conversation) {
      conversation = new Conversation({ userId, dragonId, messages: [] });
      logger.info(`New conversation started with dragonId: ${dragonId} for userId: ${userId}`);
    }

    conversation.messages.push({ text: messageText, sender: 'user' });
    await conversation.save();

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: conversation.messages.map(m => `${m.sender === 'user' ? 'User:' : 'Dragon:'} ${m.text}`).join('\n') + '\nDragon:',
      temperature: 0.5,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const dragonResponse = response.data.choices[0].text.trim();
    conversation.messages.push({ text: dragonResponse, sender: 'dragon' });
    await conversation.save();

    logger.info(`Dragon response added to conversation for dragonId: ${dragonId}`);

    return { userMessage: messageText, dragonMessage: dragonResponse };
  } catch (error) {
    logger.error('Error chatting with dragon:', error.message, error.stack);
    throw error;
  }
};

const getConversationHistory = async (userId, dragonId) => {
  if (!dragonId) {
    logger.error('Dragon ID is undefined for fetching conversation history.');
    throw new Error('Dragon ID is undefined for fetching conversation history.');
  }

  try {
    const conversation = await Conversation.findOne({ userId, dragonId });
    if (!conversation) {
      logger.info(`No conversation found for userId: ${userId} and dragonId: ${dragonId}`);
      return [];
    }
    logger.info(`Fetched conversation history for userId: ${userId} and dragonId: ${dragonId}`);
    return conversation.messages;
  } catch (error) {
    logger.error('Error fetching conversation history:', error.message, error.stack);
    throw error;
  }
};

module.exports = {
  chatWithDragon,
  getConversationHistory
};