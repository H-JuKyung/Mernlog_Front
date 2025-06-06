import axios from 'axios';
axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACK_URL;

export const registerUser = async userData => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const checkUserIdDuplicate = async userId => {
  try {
    const response = await axios.get(`${API_URL}/auth/check-duplicate`, {
      params: { userId },
    });
    return response.data.isAvailable;
  } catch (err) {
    console.error('아이디 중복 확인 실패:', err);
    throw err;
  }
};

export const loginUser = async credentials => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`);
  return response.data;
};

export const getUserProfile = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/profile`);
    return res.data;
  } catch (err) {
    console.error('프로필 조회 실패:', err);
    throw err;
  }
};

/* 사용자 페이지 관련 API */
// 특정 사용자 정보 조회
export const getUserInfo = async userId => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err);
    throw err;
  }
};

// 특정 사용자가 작성한 글 조회
export const getUserPosts = async userId => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/posts`);
    return response.data;
  } catch (err) {
    console.error('사용자 게시물 조회 실패:', err);
    throw err;
  }
};

// 특정 사용자가 작성한 댓글 조회
export const getUserComments = async userId => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/comments`);
    return response.data;
  } catch (err) {
    console.error('사용자 댓글 조회 실패:', err);
    throw err;
  }
};

// 특정 사용자가 좋아요 클릭한 글 조회
export const getUserLikes = async userId => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/likes`);
    return response.data;
  } catch (err) {
    console.error('사용자 좋아요 게시물 조회 실패:', err);
    throw err;
  }
};

// 사용자 정보 수정
export const updateUserInfo = async userData => {
  try {
    const response = await axios.put(`${API_URL}/users/update`, userData);
    return response.data;
  } catch (err) {
    console.error('사용자 정보 수정 실패:', err);
    throw err;
  }
};

// 회원 탈퇴
export const deleteAccount = async () => {
  try {
    const response = await axios.delete(`${API_URL}/auth/delete-account`);
    return response.data;
  } catch (err) {
    console.error('회원 탈퇴 실패:', err);
    throw err;
  }
};
