import axios from "axios";

const baseURL = "http://localhost:8080";

export const request = axios.create({
  baseURL: baseURL,
  timeout: 1000,
});
