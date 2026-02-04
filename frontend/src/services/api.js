import axios from "axios";

const API = axios.create({
  baseURL: "https://hrmslite-2.onrender.com/",
});

export default API;