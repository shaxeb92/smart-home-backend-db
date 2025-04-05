const mongoose = require('mongoose');
const User = require('../models/User');
const Home = require('../models/Home');
const Device = require('../models/Device');
const Room = require('../models/Room');

// Get device info
const deviceInfo = async (req, res) => {
    try {
        const { deviceId } = req.params;

        // Finding the device by its _id
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        // Response formating
        const deviceInfo = {
            id: device._id.toString(), // Convert ObjectId to string
            device_name: device.device_name,
            status: device.status,
        };

        res.status(200).json(deviceInfo);
    } catch (error) {
        console.error('Error in getDeviceInfo:', error);
        res.status(500).json({ message: 'Error fetching device info', error: error.message });
    }
};

// Change device status 
const controlDevice = async (req, res) => {
    try {
        const { deviceId } = req.params; // Get deviceId from path
        const { status } = req.body;     // Get status from body

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const result = await Device.collection.updateOne(
            { _id: new mongoose.Types.ObjectId(deviceId) },
            { $set: { status: status } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.status(200).json({ message: 'Status changed' });
    } catch (error) {
        console.error('Error in controlDevice:', error);
        res.status(500).json({ message: 'Error changing device status', error: error.message });
    }
};

/*
// Get all devices in user's home
const getHomeDevices = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const devices = await Device.find({ home_id: user.home_id }).populate('room_id');
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching devices', error: error.message });
    }
}; 
// Change device room
const changeDeviceRoom = async (req, res) => {
    try {
        const { userId, deviceId, roomId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const device = await Device.findOne({ _id: deviceId, home_id: user.home_id });
        if (!device) {
            return res.status(404).json({ message: 'Device not found or not in your home' });
        }

        const room = await Room.findOne({ _id: roomId, home_id: user.home_id });
        if (!room) {
            return res.status(404).json({ message: 'Room not found or not in your home' });
        }

        device.room_id = roomId;
        await device.save();

        res.status(200).json({ message: 'Device room updated', device });
    } catch (error) {
        res.status(500).json({ message: 'Error changing device room', error: error.message });
    }
};
*/


//The following functionalities are added after the group's comment

const createNewDevice = async (req, res) => {
    try {
        let { homeId, roomId } = req.params;
        const { name, type, status } = req.body;

        // Clean and validate IDs
        homeId = homeId.replace(/ObjectId\("|"\)/g, '').trim();
        roomId = roomId.replace(/ObjectId\("|"\)/g, '').trim();
        
        if (!/^[0-9a-fA-F]{24}$/.test(homeId) || !/^[0-9a-fA-F]{24}$/.test(roomId)) {
            return res.status(400).json({ 
                message: 'Invalid ID format',
                solution: 'Use 24-character hex string',
                example: '507f191e810c19729de860ea'
            });
        }

        // Convert to ObjectId
        const homeObjectId = new mongoose.Types.ObjectId(homeId);
        const roomObjectId = new mongoose.Types.ObjectId(roomId);

        // Verify home and room exist
        const [homeExists, roomExists] = await Promise.all([
            mongoose.model('Home').exists({ _id: homeObjectId }),
            mongoose.model('Room').exists({ _id: roomObjectId, home_id: homeObjectId })
        ]);

        if (!homeExists || !roomExists) {
            return res.status(404).json({ 
                message: 'Home or Room not found',
                homeExists,
                roomExists
            });
        }

        // Validate device data
        if (!name?.trim() || !type?.trim()) {
            return res.status(400).json({
                message: 'Device validation failed',
                requiredFields: {
                    name: 'string (2-50 chars)',
                    type: 'string (e.g., light, thermostat)'
                }
            });
        }

        const device = new Device({
            device_name: name.trim(),
            device_type: type.trim(),
            status: ['On', 'Off', 'Standby'].includes(status) ? status : 'Off',
            room_id: roomObjectId,
            home_id: homeObjectId
        });

        await device.save();
        res.status(201).json({
            success: true,
            device: {
                _id: device._id,
                name: device.device_name,
                type: device.device_type,
                status: device.status,
                room_id: device.room_id,
                home_id: device.home_id
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Device creation failed',
            error: error.message,
            received: {
                params: req.params,
                body: req.body
            }
        });
    }
};

// Move device to another room
const moveDeviceToRoom = async (req, res) => {
    try {
        const { deviceId, roomId } = req.params;
        const { newRoomId } = req.body;

        console.log(`Looking for device ${deviceId} in room ${roomId}`); // for debugging

        // Find device in current room
        const device = await Device.findOne({
            _id: deviceId,
            room_id: roomId
        });

        if (!device) {
            console.log('Device not found in specified room'); // Debug log
            return res.status(404).json({ message: 'Device not found' });
        }

        // Verify new room exists
        const newRoom = await Room.findById(newRoomId);
        if (!newRoom) {
            return res.status(404).json({ message: 'New room not found' });
        }

        // Update device
        device.room_id = newRoomId;
        await device.save();

        res.status(200).json({ 
            message: 'Device moved successfully',
            device: {
                _id: device._id,
                name: device.device_name,
                new_room_id: device.room_id,
                home_id: device.home_id
            }
        });

    } catch (error) {
        console.error('Move device error:', error); // Add error logging
        res.status(500).json({ 
            message: 'Error moving device',
            error: error.message
        });
    }
};

module.exports = { 
    /*changeDeviceRoom, 
    getHomeDevices, */
    controlDevice,
    createNewDevice,
    moveDeviceToRoom,
    deviceInfo
};


