const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  walletAddress: { type: String, unique: true, sparse: true }, // Allows null values but enforces uniqueness where the field is not null
  openAIKey: { type: String }, // Users can input their OpenAI API key via the application interface
  dragon: { type: mongoose.Schema.Types.ObjectId, ref: 'Dragon' },
  garden: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Garden' }],
  isAdmin: { type: Boolean, default: false }, // Indicates if the user has admin privileges
  lavaJuice: { type: Number, default: 0 }
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Error handling for saving user with potentially conflicting unique fields
userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;