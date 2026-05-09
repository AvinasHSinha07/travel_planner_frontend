import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';
const isClient = typeof window !== 'undefined';

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
