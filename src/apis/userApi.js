import axios from 'axios';
axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACK_URL;

export const registerUser = async userData => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};
