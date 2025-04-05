const mongoose = require('mongoose');
mongoose.set('strictQuery', true);


module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
