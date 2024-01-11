// axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api", // Set your API base URL here
});

// Set the authorization header if a token is present in local storage
const token = localStorage.getItem("token");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default instance;
