import axios from 'axios';

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000';

export const registerUser = async userData => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};
