import axios from "axios";

const api = axios.create({
    baseURL: "http://82.112.237.61:8000",

});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if(token){
        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;
});

export default api;