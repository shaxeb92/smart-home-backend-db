const express = require('express');
const router = express.Router();

const { generateHomeId, saveHomeDevices, createNewHome, getHomeRooms, getUserHomes} = require('../db/controllers/homeController');


router.post('/homes/createNewHome', createNewHome);

// Get rooms for a home
router.get('/homes/:homeId/rooms', getHomeRooms);//router.post('/generate-home', generateHomeId);
//router.post('/save-devices', saveHomeDevices);
router.get('/users/:userId/homes', getUserHomes);

module.exports = router;

