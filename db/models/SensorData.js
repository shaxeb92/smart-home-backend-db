const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  device_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Device', 
    required: true 
  },
  reading: { type: String, required: true },
  unit: String,
  timestamp: { type: Date, default: Date.now }
});

sensorDataSchema.index({ timestamp: -1 });
module.exports = mongoose.model('SensorData', sensorDataSchema);
