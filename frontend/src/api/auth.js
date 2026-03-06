import axios from 'axios'

// Базовый URL API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Интерсептор для добавления токена в каждый запрос
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('authToken')
		if (token) {
			config.headers['Authorization'] = `Token ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// API для аутентификации
export const authAPI = {
	/**
	 * Регистрация нового пользователя
	 * @param {Object} data - Данные для регистрации
	 * @param {string} data.fullName - Полное имя
	 * @param {string} data.dateOfBirth - Дата рождения (YYYY-MM-DD)
	 * @param {string} data.phoneNumber - Номер телефона
	 * @param {string} data.residentialAddress - Адрес проживания
	 * @param {string} data.placeOfWork - Место работы
	 * @param {string} data.position - Должность
	 * @param {string} data.login - Логин
	 * @param {string} data.password - Пароль
	 * @param {string} data.confirmPassword - Подтверждение пароля
	 */
	signUp: async (data) => {
		try {
			const payload = {
				full_name: data.fullName,
				date_of_birth: data.dateOfBirth,
				phone_number: data.phoneNumber,
				residential_address: data.residentialAddress,
				place_of_work: data.placeOfWork,
				position: data.position,
				login: data.login,
				password: data.password,
				confirm_password: data.confirmPassword,
			}
			const response = await apiClient.post('/users/sign-up/', payload)
			
			// Сохраняем токен в localStorage
			if (response.data.token) {
				localStorage.setItem('authToken', response.data.token)
				localStorage.setItem('user', JSON.stringify(response.data))
			}
			
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при регистрации' },
			}
		}
	},

	/**
	 * Вход пользователя
	 * @param {Object} data - Данные для входа
	 * @param {string} data.login - Логин (email или username)
	 * @param {string} data.password - Пароль
	 */
	signIn: async (data) => {
		try {
			const response = await apiClient.post('/users/sign-in/', {
				login: data.login,
				password: data.password,
			})
			
			// Сохраняем токен в localStorage
			if (response.data.token) {
				localStorage.setItem('authToken', response.data.token)
				localStorage.setItem('user', JSON.stringify(response.data))
			}
			
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при входе' },
			}
		}
	},

	/**
	 * Выход пользователя
	 */
	signOut: () => {
		localStorage.removeItem('authToken')
		localStorage.removeItem('user')
	},

	/**
	 * Получить текущего пользователя
	 */
	getCurrentUser: () => {
		const userStr = localStorage.getItem('user')
		return userStr ? JSON.parse(userStr) : null
	},

	/**
	 * Проверить, авторизован ли пользователь
	 */
	isAuthenticated: () => {
		return !!localStorage.getItem('authToken')
	},

	/**
	 * Получить токен
	 */
	getToken: () => {
		return localStorage.getItem('authToken')
	},

	/**
	 * Получить данные профиля текущего пользователя
	 */
	getProfile: async () => {
		try {
			const response = await apiClient.get('/users/profile/')
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при загрузке профиля' },
			}
		}
	},

	/**
	 * Обновить данные профиля
	 * @param {Object} profileData - Данные профиля для обновления
	 */
	updateProfile: async (profileData) => {
		try {
			const response = await apiClient.patch('/users/profile/', profileData)
			
			// Обновляем данные пользователя в localStorage
			if (response.data.data) {
				const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
				const updatedUser = { ...currentUser, ...response.data.data }
				localStorage.setItem('user', JSON.stringify(updatedUser))
			}
			
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при обновлении профиля' },
			}
		}
	},

	/**
	 * Загрузить аватар пользователя
	 * @param {File} file - Файл изображения
	 */
	uploadAvatar: async (file) => {
		try {
			const formData = new FormData()
			formData.append('avatar', file)
			const response = await apiClient.post('/users/profile/avatar/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			
			// Обновляем аватар в localStorage
			const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
			currentUser.avatar_url = response.data.avatar_url
			localStorage.setItem('user', JSON.stringify(currentUser))
			
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при загрузке аватара' },
			}
		}
	},

	/**
	 * Удалить аватар пользователя
	 */
	deleteAvatar: async () => {
		try {
			const response = await apiClient.delete('/users/profile/avatar/')
			
			// Удаляем аватар из localStorage
			const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
			currentUser.avatar_url = null
			localStorage.setItem('user', JSON.stringify(currentUser))
			
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при удалении аватара' },
			}
		}
	},
}

export default apiClient

