import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Создать новое обращение
 */
export const createAppeal = async (appealData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Требуется авторизация');
  }

  const response = await axios.post(
    `${API_BASE_URL}/appeals/`,
    appealData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }
  );

  return response.data;
};
