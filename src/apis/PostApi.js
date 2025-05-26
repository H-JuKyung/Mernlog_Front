import axios from 'axios';
axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACK_URL;

// axios가 자동으로 헤더를 처리하도록 기본값을 사용
export const createPost = async postData => {
  const response = await axios.post(`${API_URL}/postWrite`, postData);
  return response.data;
};
