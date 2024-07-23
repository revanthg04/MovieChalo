const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./Models/User');
const morgan =require('morgan')
const Movie = require('./Models/Movies');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// User registration route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User authentication route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'User authenticated successfully', isAuthenticated: true , userId:username});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Existing movie routes
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// New route to fetch seat details by seat number
app.get('/api/seats/:seatNumber', async (req, res) => {
    try {
        const seatNumber = req.params.seatNumber;
        const movie = await Movie.findOne({ 'showtimes.seats.number': seatNumber }, { 'showtimes.$': 1 });
        const showtime = movie.showtimes.find(showtime => showtime.seats.some(seat => seat.number === seatNumber));
        const seat = showtime.seats.find(seat => seat.number === seatNumber);
        res.json(seat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/// New route to place a bid
app.post('/api/seats/:seatNumber/bid', async (req, res) => {
    try {
        const seatNumber = req.params.seatNumber;
        const { username, bidAmount } = req.body;

        const movie = await Movie.findOne({ 'showtimes.seats.number': seatNumber }, { 'showtimes.$': 1 });
        if (!movie) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        const showtimeIndex = movie.showtimes.findIndex(showtime => 
            showtime.seats.some(seat => seat.number === seatNumber)
        );
        const seatIndex = movie.showtimes[showtimeIndex].seats.findIndex(seat => seat.number === seatNumber);

        const update = { 
            $push: { [`showtimes.${showtimeIndex}.seats.${seatIndex}.bids`]: { username, bidAmount } }
        };

        await Movie.updateOne({ _id: movie._id }, update);
        res.status(200).json({ message: 'Bid placed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
