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
        <div>
            {!isAuthenticated ? (
                <>
                {showRegister ? (
                    <RegisterComponent onRegisterSuccess={handleRegisterSuccess} />
                ) : (
                    <LoginComponent onLoginSuccess={handleLoginSuccess} />
                )}
                <button onClick={() => setShowRegister(!showRegister)}>
                    {showRegister ? 'Go to Login' : 'Go to Register'}
                </button>
            </>
                
            ) : (
                <SeatingArrangement isAuthenticated={isAuthenticated} userID={username} />
            )}
        </div>
    );
};

export default MainComponent;
