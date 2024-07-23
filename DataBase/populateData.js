// populateData.js
require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./Models/Movies');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const initializeMovies = () => {
    const movies = [
        {
            id: 1,
            name: 'Inception',
            showtimes: [
                { id: 1, time: 'Morning', seats: [] },
                { id: 2, time: 'Afternoon', seats: [] },
                { id: 3, time: 'Evening', seats: [] },
            ],
        },
        {
            id: 2,
            name: 'Avatar',
            showtimes: [
                { id: 4, time: 'Morning', seats: [] },
                { id: 5, time: 'Afternoon', seats: [] },
                { id: 6, time: 'Evening', seats: [] },
            ],
        },
    ];

    const rows = 'ABCDEFGHIJKL';
    const totalSeats = 20;

    movies.forEach(movie => {
        movie.showtimes.forEach(showtime => {
            let seatId = 1;
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                for (let j = 1; j <= totalSeats; j++) {
                    showtime.seats.push({ id: seatId++, number: `${row}${j}`, selected: false, booked: false, bids: [] });
                }
            }
        });
    });

    return movies;
};

const movies = initializeMovies();

Movie.insertMany(movies)
    .then(() => {
        console.log('Data inserted successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error inserting data', err);
        mongoose.connection.close();
    });
