import axios from 'axios';

const token = localStorage.getItem('token');
const baseURL = process.env.BASE_URL || 3000;

const instance = axios.create({
    baseURL: `${baseURL}`,
    headers: {
        Authorization: token ? `Bearer ${token}` : ''
    }
});

export default instance;