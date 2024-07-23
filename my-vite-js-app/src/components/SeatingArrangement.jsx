import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../component_styles/SeatingArrangement.css'; // Correct import path
import SelectedSeatsPopup from './SelectedSeatsPopup'; // Import the popup component

const SeatingArrangement = ({ isAuthenticated, userID }) => {
    if (!isAuthenticated) {
        return null; // Don't render if not authenticated
    }
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedShowtime, setSelectedShowtime] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Fetch movies from the server
        axios.get('http://localhost:3000/api/movies')
            .then(response => {
                setMovies(response.data);
                setSelectedMovie(response.data[0]?.id || '');
                setSelectedShowtime(response.data[0]?.showtimes[0]?.id || '');
            })
            .catch(error => console.error('Error fetching movies:', error));
    }, []);

    const handleMovieChange = (event) => {
        const movieId = event.target.value;
        setSelectedMovie(movieId);
        const movie = movies.find(m => m.id === parseInt(movieId));
        setSelectedShowtime(movie.showtimes[0].id);
        setSelectedSeats([]); // Clear selected seats on movie change
    };

    const handleShowtimeChange = (event) => {
        setSelectedShowtime(event.target.value);
        setSelectedSeats([]); // Clear selected seats on showtime change
    };

    const handleSeatClick = (seatId) => {
        const movie = movies.find(m => m.id === parseInt(selectedMovie));
        const showtime = movie.showtimes.find(st => st.id === parseInt(selectedShowtime));
        const seat = showtime.seats.find(seat => seat.id === seatId);
        
        // Toggle seat booked status
        seat.selected = !seat.selected;

        // Update selectedSeats based on the new booked status
        const updatedSelectedSeats = seat.selected
            ? [...selectedSeats, seatId]
            : selectedSeats.filter(id => id !== seatId);
        setSelectedSeats(updatedSelectedSeats);
    };

    const handleSubmit = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const renderSeats = () => {
        const movie = movies.find(m => m.id === parseInt(selectedMovie));
        if (!movie) return null;
        const showtime = movie.showtimes.find(st => st.id === parseInt(selectedShowtime));
        if (!showtime) return null;

        const rows = 'ABCDEFGHIJKL';
        return rows.split('').map(row => (
            <div key={row} className="seat-row">
                <div className="row-label">{row}</div>
                {showtime.seats
                    .filter(seat => seat.number.startsWith(row))
                    .map((seat, index) => (
                        <React.Fragment key={seat.id}>
                            <button
                                className={`seat ${seat.selected ? 'selected' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                                onClick={() => handleSeatClick(seat.id)}
                            >
                                {seat.number}
                            </button>
                            {index === 9 && <div className="gap" />} {/* Gap between seats 10 and 11 */}
                        </React.Fragment>
                    ))}
            </div>
        ));
    };

    const getSelectedSeatNumbers = () => {
        const movie = movies.find(m => m.id === parseInt(selectedMovie));
        const showtime = movie.showtimes.find(st => st.id === parseInt(selectedShowtime));
        return selectedSeats.map(seatId => {
            const seat = showtime.seats.find(seat => seat.id === seatId);
            return seat ? seat.number : null;
        }).filter(seat => seat !== null);
    };

    return (
        <div>
            <h3>Select Movie:</h3>
            <select id="movies" value={selectedMovie} onChange={handleMovieChange}>
                {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>
                        {movie.name}
                    </option>
                ))}
            </select>
            <br />
            <h3>Select Showtime:</h3>
            <select id="showtimes" value={selectedShowtime} onChange={handleShowtimeChange}>
                {movies.find(m => m.id === parseInt(selectedMovie))?.showtimes.map(showtime => (
                    <option key={showtime.id} value={showtime.id}>
                        {showtime.time}
                    </option>
                ))}
            </select>
            <br />
            <h3>Seating Arrangement</h3>
            <div className="seats-container">
                {renderSeats()}
                <div className="screen"></div>
                <button className="submit-button" onClick={handleSubmit}>BID</button>
            </div>
            {showPopup && (
                <SelectedSeatsPopup selectedSeats={getSelectedSeatNumbers()} onClose={handleClosePopup} userID={userID} />
            )}
        </div>
    );
};

export default SeatingArrangement;
