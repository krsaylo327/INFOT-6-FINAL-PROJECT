import axios from 'axios';
import { BASE_URL } from './constants';

// Create an Axios instance with default settings for API requests
const axiosInstance = axios.create({
    baseURL: BASE_URL, // Base URL for all API calls
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json', // Default content type
    },
});

// Add a request interceptor to include the JWT token in headers if available
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // Attach token to Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // Handle request errors
    }
);

export default axiosInstance;
