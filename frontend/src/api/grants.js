/**
 * API клиент для работы с грантами
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Создаем экземпляр axios для грантов
const grantsClient = axios.create({
  baseURL: `${API_BASE_URL}/grants`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Получить список грантов
 * @param {Object} params - Параметры запроса
 * @param {number} params.limit - Лимит грантов
 * @param {string} params.status - Статус (active, closed, upcoming)
 * @param {string} params.category - Категория
 * @returns {Promise} Массив грантов
 */
export const getGrantsList = async (params = {}) => {
  console.log('💰 Загрузка грантов с параметрами:', params);
  try {
    const response = await grantsClient.get('/', { params });
    console.log('✅ Гранты загружены:', response.data);
    return response.data.results;
  } catch (error) {
    console.error('❌ Ошибка загрузки грантов:', error);
    throw error;
  }
};

/**
 * Получить детальный грант
 * @param {number} id - ID гранта
 * @returns {Promise} Детальный грант
 */
export const getGrantDetail = async (id) => {
  console.log(`💰 Загрузка гранта #${id}`);
  try {
    const response = await grantsClient.get(`/${id}/`);
    console.log('✅ Грант загружен:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки гранта:', error);
    throw error;
  }
};

export default {
  getGrantsList,
  getGrantDetail,
};

