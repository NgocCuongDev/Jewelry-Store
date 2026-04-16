// src/lib/axios.js
import axios from "axios";
import { API_URL } from "../../config";

export const api = axios.create({
  baseURL: API_URL, // http://127.0.0.1:8000/api/
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
