const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'User'], default: 'User' },
  home_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Home' }]
});


userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.models.User || mongoose.model('User', userSchema);