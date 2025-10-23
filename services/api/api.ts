import axios from "axios";

const api = axios.create({
  baseURL: 'http://127.0.0.1:4000',
  timeout: 1000,
  headers: {'Accept': 'aplication/json'}
});
export default api;