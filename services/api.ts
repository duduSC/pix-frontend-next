import axios from "axios";

const api = axios.create({
    baseURL : "localhost:4000",
    headers: {Accept: "aplication/json"},
    timeout: 1000
    }
)
export default api;