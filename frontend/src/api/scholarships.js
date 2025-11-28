import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.20.10.2:8000/api/v1'

console.log('🔧 API Base URL:', API_BASE_URL)

export const getScholarshipsList = async (params = {}) => {
	try {
		console.log('💰 Загрузка стипендий с параметрами:', params)
		const response = await axios.get(`${API_BASE_URL}/scholarships/`, { params })
		console.log('✅ Стипендии загружены:', response.data)
		// API возвращает {count, results}, возвращаем только массив
		return response.data.results || response.data
	} catch (error) {
		console.error('❌ Ошибка загрузки стипендий:', error)
		throw error
	}
}

export const getScholarshipDetail = async (id) => {
	try {
		console.log('💰 Загрузка стипендии:', id)
		const response = await axios.get(`${API_BASE_URL}/scholarships/${id}/`)
		console.log('✅ Стипендия загружена:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ Ошибка загрузки стипендии:', error)
		throw error
	}
}

