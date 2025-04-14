import axios from 'axios';

const axiosApi = axios.create({
    baseURL: 'http://localhost:4000',  
    withCredentials: true,             
});

export default axiosApi;
