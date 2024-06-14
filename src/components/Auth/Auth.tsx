import React, { useState, FormEvent } from 'react';
import axios from 'axios';

const Auth: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
        const userData = { username, password };

        try {
            const response = await axios.post(endpoint, userData);
            const { token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', username);

            setUsername('');
            setPassword('');
        } catch (error: any) {
            console.error('Error during authentication:', error.response.data);
            alert(error.response.data);
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </button>
        </div>
    );
};

export default Auth;