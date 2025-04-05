const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  home_name: { type: String, required: true },
  address: { type: String, required: false },
  owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  emergency_mode: {
    status: { type: String, enum: ['Off', 'On', 'Alert'], default: 'Off' },
    last_activated: Date,
    action: String
  },
  created_at: { type: Date, default: Date.now }
});

homeSchema.index({ owners: 1 });

module.exports = mongoose.model('Home', homeSchema);
