import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Team API - Jamoa a'zolari uchun API
 */

// Jamoa a'zolari ro'yxatini olish
export const getTeamMembersList = async (params = {}) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/team/`, {
			params: {
				ordering: 'order',
				is_active: true,
				...params,
			},
		})
		return response.data
	} catch (error) {
		console.error('❌ Ошибка загрузки команды:', error)
		throw error
	}
}

// Bitta jamoa a'zosi ma'lumotlarini olish
export const getTeamMemberDetail = async id => {
	try {
		const response = await axios.get(`${API_BASE_URL}/team/${id}/`)
		return response.data
	} catch (error) {
		console.error(`❌ Ошибка загрузки члена команды #${id}:`, error)
		throw error
	}
}

// Filtr bilan jamoa a'zolari
export const getFilteredTeamMembers = async (filters = {}) => {
	try {
		const params = {}

		if (filters.is_active !== undefined) params.is_active = filters.is_active
		if (filters.limit) params.limit = filters.limit

		const response = await axios.get(`${API_BASE_URL}/team/`, { params })
		return response.data
	} catch (error) {
		console.error('❌ Ошибка фильтрации команды:', error)
		throw error
	}
}

