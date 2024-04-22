const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  lavaJuice: { type: Number, default: 0 }
});

userBalanceSchema.index({ userId: 1 }, { unique: true });

userBalanceSchema.pre('save', function(next) {
  console.log(`Saving user balance for userId: ${this.userId}`);
  next();
});

userBalanceSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error('Error saving user balance:', error);
    next(new Error('There was a duplicate key error in UserBalance'));
  } else if (error) {
    console.error('Error saving user balance:', error);
    next(error);
  } else {
    console.log(`User balance saved successfully for userId: ${doc.userId}`);
    next();
  }
});

const UserBalance = mongoose.model('UserBalance', userBalanceSchema);

module.exports = UserBalance;