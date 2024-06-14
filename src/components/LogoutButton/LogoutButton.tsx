import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.scss'

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        navigate('/login');
    };

    return (
        <button className='logout-button' onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;