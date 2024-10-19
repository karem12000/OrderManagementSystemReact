import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../Utility/cookieUtils';

const axiosInstance = axios.create({
    baseURL: 'https://your-api-endpoint.com', 
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token =getToken();
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Unauthorized. Redirecting to login.');
            const navigate = useNavigate();
            navigate('/login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;