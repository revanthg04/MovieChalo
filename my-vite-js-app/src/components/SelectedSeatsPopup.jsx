import React, { useState, useEffect } from 'react';
import '../component_styles/SelectedSeatsPopup.css';

const SelectedSeatsPopup = ({ selectedSeats, onClose, userID }) => {
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatDetails, setSeatDetails] = useState(null);
    const [bidAmount, setBidAmount] = useState('');

    const fetchSeatDetails = async (seatNumber) => {
        try {
            const response = await fetch(`http://localhost:3000/api/seats/${seatNumber}`);
            const data = await response.json();
            setSeatDetails(data);
        } catch (error) {
            console.error('Error fetching seat details:', error);
        }
    };

    const handleSeatClick = async (seatNumber) => {
        setSelectedSeat(seatNumber);
        await fetchSeatDetails(seatNumber);
    };

    const handlePlaceBid = async () => {
        if (!bidAmount) {
            alert('Please enter a bid amount');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/seats/${selectedSeat}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: userID, bidAmount }),
            });

            if (response.ok) {
                setBidAmount('');
                await fetchSeatDetails(selectedSeat);
                alert('Bid placed successfully');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h3>Selected Seats</h3>
                <div className="horizontal-buttons">
                    {selectedSeats.map(seatNumber => (
                        <button 
                            key={seatNumber} 
                            onClick={() => handleSeatClick(seatNumber)} 
                            className="seat-button"
                        >
                            {seatNumber}
                        </button>
                    ))}
                </div>
                {selectedSeat && seatDetails && (
                    <div className="seat-details">
                        <h4>Seat Number: {seatDetails.number}</h4>
                        <h4>Bids:</h4>
                        <ul>
                            {seatDetails.bids.map((bid, index) => (
                                <li key={index}>
                                    {bid.username}: ${bid.bidAmount}
                                </li>
                            ))}
                        </ul>
                        <div className="bid-form">
                            <input 
                                type="number" 
                                placeholder="Bid Amount" 
                                value={bidAmount} 
                                onChange={(e) => setBidAmount(e.target.value)} 
                            />
                            <button onClick={handlePlaceBid}>Place Bid</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectedSeatsPopup;
