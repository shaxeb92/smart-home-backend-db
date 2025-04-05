const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_name: { type: String, required: true },
  floor_number: Number,
  home_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Home' }
});

roomSchema.index({ home_id: 1 });
module.exports = mongoose.model('Room', roomSchema);

//make the user to change the room id because he may take the device to the room that he wants