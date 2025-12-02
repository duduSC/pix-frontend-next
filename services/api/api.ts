import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:4000/v1',
  timeout: 10000,
  headers: {'Accept': 'application/json'},
  withCredentials:true  
});
export default api;