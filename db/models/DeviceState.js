const mongoose = require('mongoose');

const deviceStateSchema = new mongoose.Schema({
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  timestamp: { type: Date, default: Date.now },
  state_value: String
});

deviceStateSchema.index({ device_id: 1, timestamp: -1 });
module.exports = mongoose.model('DeviceState', deviceStateSchema);