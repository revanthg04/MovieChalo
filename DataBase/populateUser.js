const mongoose = require('mongoose');
const User = require('./Models/User'); // Ensure the path is correct
require('dotenv').config(); // Load environment variables from .env file

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', async () => {
    console.log('Connected to MongoDB');

    const newUser = new User({
        username: 'Bindhu',
        password: 'asdf'
    });

    try {
        await newUser.save();
        console.log('User added successfully');
    } catch (error) {
        console.error('Error adding user:', error);
    } finally {
        mongoose.connection.close();
    }
});
