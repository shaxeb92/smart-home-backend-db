const mongoose = require('mongoose');
const Home = require('../models/Home');
const Device = require('../models/Device');

const User = require('../models/User');

const Room = require('../models/Room'); // I added this


// Get User homes
const getUserHomes = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            console.log(userId)
            return res.status(404).json({ message: 'User not found' });
        }

        // Find homes assigned to user
        const homes = await Home.find({_id:{$in: user.home_ids}});
        if (!homes.length) {
            return res.status(200).json([]); // Empty array if no homes
        }


        const homeList = homes.map(home => ({
            _id: home._id.toString(),
            home_name: home.home_name,
            address: home.address
        }));

        res.status(200).json(homeList);
    } catch (error) {
        console.error('Error in getUserHomes:', error);
        res.status(500).json({ message: 'Error fetching user homes', error: error.message });
    }
};

/*
// Save devices under a homeId
const saveHomeDevices = async (req, res) => {
    try {
        const { homeId, devices } = req.body;
        if (!homeId || !devices || !Array.isArray(devices)) {
            return res.status(400).json({ message: 'homeId and devices array are required' });
        }

        const home = await Home.findById(homeId);
        if (!home) {
            return res.status(404).json({ message: 'Home not found' });
        }

        const devicePromises = devices.map(async (deviceData) => {
            const { device_name, device_type, status } = deviceData;
            if (!device_name || !device_type) {
                throw new Error('device_name and device_type are required');
            }
            const device = new Device({
                device_name,
                device_type,
                home_id: homeId,
                status: status || 'Off',
            });
            await device.save();
            return device._id;
        });

        await Promise.all(devicePromises);
        res.status(200).json({ message: 'Devices saved successfully', homeId });
    } catch (error) {
        res.status(500).json({ message: 'Error saving devices', error: error.message });
    }
};


// Generate a new homeId
const generateHomeId = async (req, res) => {
    try {
        const home = new Home({
            home_name: `Home-${new mongoose.Types.ObjectId().toString().slice(-6)}`, // Temporary name
        });
        await home.save();
        res.status(201).json({ homeId: home._id });
    } catch (error) {
        res.status(500).json({ message: 'Error generating homeId', error: error.message });
    }
};

*/




//The following new functionalities are added based on the group's comment


const createNewHome = async (req, res) => {
    try {
        const { home_name, address, floor_number } = req.body;
        
        // Create home with custom name or default generated name
        const home = new Home({
            home_name: home_name || `Home-${new mongoose.Types.ObjectId().toString().slice(-6)}`,
            address: address || null,
        });

        // Create living room with custom floor or default (1)
        const livingRoom = new Room({
            room_name: 'Living Room',
            home_id: home._id,
            floor_number: floor_number || 1
        });

        await Promise.all([home.save(), livingRoom.save()]);

        res.status(201).json({ 
            homeId: home._id,
            home_name: home.home_name,
            address: home.address,
            rooms: [livingRoom]
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating home', 
            error: error.message 
        });
    }
};


// Get rooms in home
const getHomeRooms = async (req, res) => {
    try {
        const { homeId } = req.params;
        const rooms = await Room.find({ home_id: homeId });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error: error.message });
    }
};

module.exports = { 
    /*generateHomeId, 
    saveHomeDevices,*/ 
    createNewHome,
    getHomeRooms,
    getUserHomes
};
