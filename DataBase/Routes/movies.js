const express = require('express');
const router = express.Router();
const Movie = require('../Models/Movie');

// Fetch all movies
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
