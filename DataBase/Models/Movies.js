// models/Movie.js
const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
    username: String,
    bidAmount: Number
});

const SeatSchema = new mongoose.Schema({
    id: Number,
    number: String,
    selected: Boolean,
    booked: Boolean,
    bids: [BidSchema] // Add bids attribute as an array of bid objects
});

const ShowtimeSchema = new mongoose.Schema({
    id: Number,
    time: String,
    seats: [SeatSchema]
});

const MovieSchema = new mongoose.Schema({
    id: Number,
    name: String,
    showtimes: [ShowtimeSchema]
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
