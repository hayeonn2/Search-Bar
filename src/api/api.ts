import axios from 'axios';

export const BASE_URL = 'http://localhost:4000/sick';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
