// axios.js
import axios from "axios";
const baseUrl = import.meta.env.VITE_BACK_BASE_URL;

const instance = axios.create({
  baseURL: `${baseUrl}`,
});

const token = localStorage.getItem("token");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default instance;
