// src/components/SeatDetails.jsx

import React from 'react';

const SeatDetails = ({ seatNumber }) => {
    return (
        <div className="seat-details">
            <h4>Seat Number: {seatNumber}</h4>
            {/* Add more details or actions related to the seat here */}
        </div>
    );
};

export default SeatDetails;
