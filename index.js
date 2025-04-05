require('dotenv').config();
const express = require('express');
const connectDB = require('./db/config/db');
const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

//added rout
const roomRoutes = require('./routes/roomRoutes');

const app = express();
app.use(express.json());

connectDB();

//This code is jsut to test the api
app.get('/api/test', (req, res) => {
    res.send('API is working');
});
//cross-origin resource sharing
const cors = require('cors');
app.use(cors({origins: '*'}));
app.use(express.urlencoded({ extended: true }));

app.use('/api', homeRoutes);
app.use('/api', roomRoutes);
app.use('/api', userRoutes);
app.use('/api', deviceRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));