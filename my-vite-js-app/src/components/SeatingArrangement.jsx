import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../component_styles/SeatingArrangement.css';
import SelectedSeatsPopup from './SelectedSeatsPopup';

const SeatingArrangement = ({ isAuthenticated, userID }) => {
    if (!isAuthenticated) {
        return null; // Don't render if not authenticated
    }

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedShowtime, setSelectedShowtime] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [view, setView] = useState('movie'); // Add view state to toggle between movie list and seating arrangement

    useEffect(() => {
        // Fetch movies from the server
        axios.get('http://localhost:3000/api/movies')
            .then(response => {
                setMovies(response.data);
                // Initialize default movie and showtime
                if (response.data.length > 0) {
                    setSelectedMovie(response.data[0]?.id || '');
                    setSelectedShowtime(response.data[0]?.showtimes[0]?.id || '');
                }
            })
            .catch(error => console.error('Error fetching movies:', error));
    }, []);

    const handleMovieClick = (movieId) => {
        setSelectedMovie(movieId);
        const movie = movies.find(m => m.id === parseInt(movieId));
        setSelectedShowtime(movie.showtimes[0].id);
        setSelectedSeats([]); // Clear selected seats on movie change
        setView('showtime'); // Switch view to showtime selection
    };

    const handleShowtimeChange = (showtimeId) => {
        setSelectedShowtime(showtimeId);
        setSelectedSeats([]); // Clear selected seats on showtime change
        setView('seats'); // Switch view to seating arrangement
    };

    const handleBackToMovieSelection = () => {
        setView('movie');
    };

    const handleBackToShowtimeSelection = () => {
        setView('showtime');
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
            <div key={row} className="flex items-center space-x-2">
                <div className="w-10 h-10 flex items-center justify-center font-bold text-white bg-gray-700 rounded-full">
                    {row}
                </div>
                {showtime.seats
                    .filter(seat => seat.number.startsWith(row))
                    .map((seat, index) => (
                        <React.Fragment key={seat.id}>
                            <button
                                className={`w-10 h-10 flex items-center justify-center border rounded-lg shadow-md transition-transform duration-200 ${seat.selected || selectedSeats.includes(seat.id) ? 'bg-red-300' : 'bg-gray-900 text-white'
                                    } hover:bg-gray-700 hover:scale-105`}
                                onClick={() => handleSeatClick(seat.id)}
                            >
                                {seat.number}
                            </button>
                            {index === 9 && <div className="w-2" />} {/* Gap between seats 10 and 11 */}
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
        <div className="p-4">
            {view === 'movie' && (
                <>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Select Movie</h3>
                    <div className="space-y-2">
                        {movies.map(movie => (
                            <button
                                key={movie.id}
                                className="w-full p-2 text-left bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                                onClick={() => handleMovieClick(movie.id)}
                            >
                                {movie.name}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {view === 'showtime' && (
                <>
                    <button
                        onClick={handleBackToMovieSelection}
                        className="back-button mb-4"
                    >
                        &larr; Back to Movie Selection
                    </button>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Select Showtime:</h3>
                    <div className="flex flex-wrap gap-2">
                        {movies.find(m => m.id === parseInt(selectedMovie))?.showtimes.map(showtime => (
                            <button
                                key={showtime.id}
                                onClick={() => handleShowtimeChange(showtime.id)} // Pass showtime.id directly
                                className={`px-4 py-2 rounded-md border border-gray-300 text-white transition-colors duration-200 ${showtime.id === selectedShowtime
                                        ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-gray-800 hover:bg-gray-700'
                                    }`}
                            >
                                {showtime.time}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {view === 'seats' && (
                <>
                    <button
                        onClick={handleBackToShowtimeSelection}
                        className="back-button mb-4"
                    >
                        &larr; Back to Showtime Selection
                    </button>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Screen 1</h3>
                    <div className="flex flex-col items-center space-y-4 p-2 border border-gray-300 rounded-md bg-gray-800">
                        {renderSeats()}
                        <div className="w-4/5 h-12 bg-gray-900 mt-4 mb-4 rounded-full">
                            {/* Screen area */}
                        </div>
                        <button
                            className="px-4 py-2 bg-gray-900 text-white rounded-md shadow-md hover:bg-gray-700 transition-colors duration-200"
                            onClick={handleSubmit}
                        >
                            BID
                        </button>
                    </div>
                </>
            )}

            {showPopup && (
                <SelectedSeatsPopup selectedSeats={getSelectedSeatNumbers()} onClose={handleClosePopup} userID={userID} />
            )}
        </div>
    );
};

export default SeatingArrangement;
