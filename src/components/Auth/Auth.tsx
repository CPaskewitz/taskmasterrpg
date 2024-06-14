import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './Auth.scss';

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
        <div className='auth__container'>
            <h2 className='auth__header'>{isLogin ? 'Login' : 'Register'}</h2>
            <form className='auth__form' onSubmit={handleSubmit}>
                <div className='auth__form__group'>
                    <label className='auth__form__group__label'>Username:</label>
                    <input
                        className='auth__form__group__input'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='auth__form__group'>
                    <label className='auth__form__group__label'>Password:</label>
                    <input
                        className='auth__form__group__input'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='auth__form__button' type="submit">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <button
                className='auth__toggle-button'
                onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </button>
        </div>
    );
};

export default Auth;