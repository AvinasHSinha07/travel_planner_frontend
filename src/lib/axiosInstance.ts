import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';
const isClient = typeof window !== 'undefined';

const axiosInstance = axios.create({
  baseURL: isProduction && isClient ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
