const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dragonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dragon', required: true },
  messages: [{
    text: String,
    sender: { type: String, enum: ['user', 'dragon'] },
    createdAt: { type: Date, default: Date.now }
  }]
});

conversationSchema.pre('save', function (next) {
  if (this.messages.length > 1000) { // Assuming a limit to prevent document from getting too large
    console.log('Conversation length exceeds the maximum limit. Trimming older messages.');
    this.messages = this.messages.slice(-1000); // Keep the last 1000 messages
  }
  next();
});

conversationSchema.post('save', function (error, doc, next) {
  if (error) {
    console.error('Error saving conversation:', error);
    next(error);
  } else {
    next();
  }
});

// delete conversation by userId
conversationSchema.statics.delete = async function (userId) {
  try {
    const conversation = await this.deleteMany({ userId });
    console.log(`Deleted conversation history for userId: ${userId}`);
    return conversation;
  } catch (error) {
    console.error('Error deleting conversation history:', error);
    throw error;
  }
};

module.exports = mongoose.model('Conversation', conversationSchema);