import React, { useState } from 'react';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import SeatingArrangement from './SeatingArrangement';

const MainComponent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [username, setUsername] = useState('');

    const handleLoginSuccess = (username) => {
        setIsAuthenticated(true);
        setUsername(username);
    };

    const handleRegisterSuccess = () => {
        setShowRegister(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            
                {!isAuthenticated ? (
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                        {showRegister ? (
                            <RegisterComponent onRegisterSuccess={handleRegisterSuccess} />
                        ) : (
                            <LoginComponent onLoginSuccess={handleLoginSuccess} />
                        )}
                        <button
                            className="mt-4 w-full text-center py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            onClick={() => setShowRegister(!showRegister)}
                        >
                            {showRegister ? 'Go to Login' : 'Go to Register'}
                        </button>
                        </div>
                ) : (
                    <SeatingArrangement isAuthenticated={isAuthenticated} userID={username} />
                )}
            
        </div>
    );
};

export default MainComponent;
