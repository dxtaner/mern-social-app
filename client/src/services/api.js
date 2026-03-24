import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

export default API;
