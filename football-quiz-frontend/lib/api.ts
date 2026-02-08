import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://13.209.87.175:4000',
  withCredentials: true,
});