import axios from 'axios';
export const serviciosApi = axios.create({
    baseURL: 'http://192.168.0.199:3000/api/dsm44/servicios',
});

export default serviciosApi;