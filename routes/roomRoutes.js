// roomRoutes.js - new rout created

const express = require('express');
const router = express.Router();


const { addRoom, getRoomDevices } = require('../db/controllers/roomController');
const { moveDeviceToRoom } = require('../db/controllers/deviceController')

router.post('/homes/:homeId/rooms/add', addRoom); 
router.get('/:roomId/devices', getRoomDevices);

//router.post('/:roomId/devices/:deviceId/move', moveDeviceToRoom);

router.post('/rooms/:roomId/devices/:deviceId/move', moveDeviceToRoom);

module.exports = router;