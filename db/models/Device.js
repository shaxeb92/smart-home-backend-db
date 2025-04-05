const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    device_name: { type: String, required: true },
    device_type: { type: String, required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    home_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Home' },
    status: { type: String, enum: ['On', 'Off', 'Standby'], default: 'Off' },
    ip_address: String,
    emergency_override: {
        priority: { type: Number, enum: [1, 2], default: 1 },
        last_action: Date,
    },
    created_at: { type: Date, default: Date.now },
});

deviceSchema.index({ home_id: 1, 'emergency_override.priority': 1 });

module.exports = mongoose.models.Device || mongoose.model('Device', deviceSchema);