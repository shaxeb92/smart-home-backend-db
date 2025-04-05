const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  home_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true },
  activated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  action: { type: String, required: true },
  devices_impacted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
});

emergencySchema.index({ home_id: 1, timestamp: -1 });
module.exports = mongoose.model('Emergency', emergencySchema);
