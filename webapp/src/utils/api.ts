import axios from "axios";

export const BACKEND = "http://localhost:8000";

const api = axios.create({
    baseURL: BACKEND,
    withCredentials: true
});

export default api;
