/**
 * API клиент для работы с новостями
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Создаем экземпляр axios для новостей
const newsClient = axios.create({
  baseURL: `${API_BASE_URL}/news`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Получить список новостей
 * @param {Object} params - Параметры запроса
 * @param {number} params.limit - Лимит новостей
 * @param {boolean} params.is_featured - Только избранные
 * @returns {Promise} Массив новостей
 */
export const getNewsList = async (params = {}) => {
  console.log('📰 Загрузка новостей с параметрами:', params);
  try {
    const response = await newsClient.get('/', { params });
    console.log('✅ Новости загружены:', response.data);
    return response.data.results;
  } catch (error) {
    console.error('❌ Ошибка загрузки новостей:', error);
    throw error;
  }
};

/**
 * Получить детальную новость
 * @param {number} id - ID новости
 * @returns {Promise} Детальная новость
 */
export const getNewsDetail = async (id) => {
  console.log(`📰 Загрузка новости #${id}`);
  try {
    const response = await newsClient.get(`/${id}/`);
    console.log('✅ Новость загружена:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка загрузки новости:', error);
    throw error;
  }
};

/**
 * Увеличить лайки новости
 * @param {number} id - ID новости
 * @returns {Promise} Обновленное количество лайков
 */
export const likeNews = async (id) => {
  console.log(`❤️ Лайк новости #${id}`);
  try {
    const response = await newsClient.post(`/${id}/like/`);
    console.log('✅ Лайк добавлен:', response.data);
    return response.data.likes;
  } catch (error) {
    console.error('❌ Ошибка добавления лайка:', error);
    throw error;
  }
};

export default {
  getNewsList,
  getNewsDetail,
  likeNews,
};


