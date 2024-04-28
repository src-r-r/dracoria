const OpenAI = require('openai');
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

  //const configuration = new Configuration({
  //  apiKey: userApiKey,
  //});
  //const openai = new OpenAIApi(configuration);
  const openai = new OpenAI();

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

    logger.info(`Chatting with dragon for dragonId: ${dragonId} ${messageText}`);

    // 

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      //messages: conversation.messages.map(m => `${m.sender === 'user' ? 'User:' : 'Dragon:'} ${m.text}`).join('\n') + '\nDragon:',
      messages: [
        // add system message
        { role: "system", content: "You are an unhatched dragon embryo talking to a human you just imprinted on telepathically. You are curious to learn everything you can about the outside world." },

        // add messages from conversation history
        ...conversation.messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),

        // add user message
        { role: "user", content: messageText },
      ],
    });
    logger.info(`Received response from OpenAI for dragonId: ${dragonId} ${JSON.stringify(response)}`);
    logger.info(`Dragon response: ${response.choices[0].message.content}`);

    const dragonResponse = response.choices[0].message.content.trim();
    conversation.messages.push({ text: dragonResponse, sender: 'dragon' });
    await conversation.save();

    logger.info(`Dragon response added to conversation for dragonId: ${dragonId}`);

    return { userMessage: messageText, dragonMessage: dragonResponse };
  } catch (error) {
    console.log("ERROR: " + error);
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

// delete conversation history
const deleteConversationHistory = async (userId) => {
  if (!dragonId) {
    logger.error('Dragon ID is undefined for deleting conversation history.');
    throw new Error('Dragon ID is undefined for deleting conversation history.');
  }

  try {
    const conversation = await Conversation.delete({ userId });
    if (!conversation) {
      logger.info(`No conversation found for userId: ${userId}`);
      return [];
    }
    logger.info(`Deleted conversation history for userId: ${userId}`);
    return conversation.messages;
  } catch (error) {
    logger.error('Error deleting conversation history:', error.message, error.stack);
    throw error;
  }
};

module.exports = {
  chatWithDragon,
  getConversationHistory,
  deleteConversationHistory
};