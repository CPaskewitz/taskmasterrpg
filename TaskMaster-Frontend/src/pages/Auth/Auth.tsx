import React, { useState, FormEvent } from 'react';
import axios from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Auth.scss';

const Auth: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const navigate = useNavigate();

    const validateUsername = (username: string): string => {
        if (username.length < 3) {
            return 'Username must be at least 3 characters long.';
        }
        if (/[^a-zA-Z0-9]/.test(username)) {
            return 'Username can only contain letters and numbers.';
        }
        return '';
    };

    const validatePassword = (password: string): string => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number.';
        }
        return '';
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const usernameValidationError = validateUsername(username);
        const passwordValidationError = validatePassword(password);

        if (usernameValidationError) {
            setUsernameError(usernameValidationError);
            return;
        } else {
            setUsernameError('');
        }

        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        } else {
            setPasswordError('');
        }

        if (!isLogin && password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return;
        } else {
            setConfirmPasswordError('');
        }

        const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
        const userData = isLogin ? { username, password } : { username, password, confirmPassword };

        try {
            const response = await axios.post(endpoint, userData);
            const { token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', username);

            setUsername('');
            setPassword('');
            setConfirmPassword('');

            navigate('/');
        } catch (error: any) {
            console.error('Error during authentication:', error.response.data);

            if (error.response && error.response.data) {
                const { usernameError, passwordError } = error.response.data;
                if (usernameError) setUsernameError(usernameError);
                if (passwordError) setPasswordError(passwordError);
            } else {
                alert('An unexpected error occurred');
            }
        }
    };

    return (
        <div className='auth__container'>
            <h1 className="auth__title">QuestListRPG</h1>
            <h2 className='auth__header'>{isLogin ? 'Login' : 'Register'}</h2>
            <form className='auth__form' onSubmit={handleSubmit}>
                <div className='auth__form__group'>
                    <label className='auth__form__group__label'>Username:</label>
                    <input
                        className={`auth__form__group__input ${usernameError ? 'error' : ''}`}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {usernameError && <div className='auth__form__group__error'>{usernameError}</div>}
                </div>
                <div className='auth__form__group'>
                    <label className='auth__form__group__label'>Password:</label>
                    <input
                        className={`auth__form__group__input ${passwordError ? 'error' : ''}`}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {passwordError && <div className='auth__form__group__error'>{passwordError}</div>}
                </div>
                {!isLogin && (
                    <div className='auth__form__group'>
                        <label className='auth__form__group__label'>Confirm Password:</label>
                        <input
                            className={`auth__form__group__input ${confirmPasswordError ? 'error' : ''}`}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPasswordError && <div className='auth__form__group__error'>{confirmPasswordError}</div>}
                    </div>
                )}
                <button className='auth__form__button' type="submit">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <button
                className='auth__toggle-button'
                onClick={() => {
                    setIsLogin(!isLogin);
                    setUsernameError('');
                    setPasswordError('');
                    setConfirmPasswordError('');
                }}
            >
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </button>
        </div>
    );
};

export default Auth;