import axios from 'axios';

export const apiGateway = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});