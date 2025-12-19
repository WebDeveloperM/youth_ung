import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Получить список всех организаций (публичный доступ для регистрации)
 */
export const getOrganisationsList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/organisations/public/organisations/`);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки организаций:', error);
    throw error;
  }
};


