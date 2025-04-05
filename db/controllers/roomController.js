// roomController.js - Create this new file after group's comment

const mongoose = require('mongoose'); 
const Room = require('../models/Room');
const Device = require('../models/Device');


const addRoom = async (req, res) => {
    try {
        let { homeId } = req.params;
        const { newRoomName: newRoomName } = req.body;

        // ===== IMPROVED VALIDATION =====
        // 1. Clean and validate homeId
        homeId = homeId.replace(/ObjectId\("|"\)/g, '').trim();
        
        if (!/^[0-9a-fA-F]{24}$/.test(homeId)) {
            return res.status(400).json({ 
                message: 'Invalid homeId format',
                solution: 'Must be 24-character hex string (0-9, a-f)',
                example: '507f191e810c19729de860ea',
                received: homeId
            });
        }

        // 2. Validate roomName
        if (!newRoomName?.trim() || typeof newRoomName !== 'string') {
            return res.status(400).json({
                message: 'roomName must be a non-empty string',
                received: newRoomName
            });
        }

        // ===== DATABASE OPERATIONS =====
        const objectId = new mongoose.Types.ObjectId(homeId);
        
        // 1. Verify home exists
        const homeExists = await mongoose.model('Home').exists({ _id: objectId });
        if (!homeExists) {
            return res.status(404).json({ 
                message: 'Home not found',
                homeId: homeId
            });
        }

        // 2. Create and save room
        const room = new Room({
            room_name: newRoomName.trim(),
            home_id: objectId
        });

        await room.save();
        
        // ===== SUCCESS RESPONSE =====
        res.status(201).json({
            success: true,
            room: {
                _id: room._id,
                room_name: room.room_name,
                home_id: room.home_id
            }
        });
        
    } catch (error) {
        // ===== ENHANCED ERROR HANDLING =====
        let statusCode = 500;
        let errorMessage = error.message;
        
        if (error.name === 'ValidationError') {
            statusCode = 400;
            errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        } else if (error.code === 11000) {
            statusCode = 409;
            errorMessage = 'Room name already exists for this home';
        }

        res.status(statusCode).json({
            success: false,
            message: 'Room creation failed',
            error: errorMessage,
            receivedData: {
                homeId: req.params.homeId,
                roomName: req.body.roomName
            },
            troubleshooting: [
                'Verify home exists in database',
                'Check for duplicate room names in same home',
                'Ensure roomName is between 2-50 characters'
            ]
        });
    }
};


// Get devices in room
const getRoomDevices = async (req, res) => {
    try {
        const { roomId } = req.params;
        const devices = await Device.find({ room_id: roomId });
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching devices', error: error.message });
    }
};

module.exports = { addRoom, getRoomDevices };
