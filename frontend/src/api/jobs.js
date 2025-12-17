import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Jobs API - Вакансиялар учун API
 */

// Вакансиялар рўйхатини олиш
export const getJobsList = async (params = {}) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/jobs/`, {
			params: {
				ordering: '-created_at',
				...params,
			},
		})
		return response.data
	} catch (error) {
		console.error('❌ Ошибка загрузки вакансий:', error)
		throw error
	}
}

// Битта вакансия маълумотларини олиш
export const getJobDetail = async id => {
	try {
		const response = await axios.get(`${API_BASE_URL}/jobs/${id}/`)
		return response.data
	} catch (error) {
		console.error(`❌ Ошибка загрузки вакансии #${id}:`, error)
		throw error
	}
}

// Фильтрланган вакансиялар
export const getFilteredJobs = async (filters = {}) => {
	try {
		const params = {}

		if (filters.status) params.status = filters.status
		if (filters.category) params.category = filters.category
		if (filters.employment_type) params.employment_type = filters.employment_type
		if (filters.limit) params.limit = filters.limit

		const response = await axios.get(`${API_BASE_URL}/jobs/`, { params })
		return response.data
	} catch (error) {
		console.error('❌ Ошибка фильтрации вакансий:', error)
		throw error
	}
}

// Вакансияга ариза юбориш
export const submitJobApplication = async (jobId, applicationData) => {
	try {
		const formData = new FormData()

		formData.append('content_type', 'job')
		formData.append('object_id', jobId)
		formData.append('full_name', applicationData.full_name)
		formData.append('email', applicationData.email)
		formData.append('phone', applicationData.phone)
		formData.append('message', applicationData.message || '')

		if (applicationData.resume) {
			formData.append('resume', applicationData.resume)
		}
		if (applicationData.cover_letter) {
			formData.append('cover_letter', applicationData.cover_letter)
		}

		const response = await axios.post(`${API_BASE_URL}/applications/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		return response.data
	} catch (error) {
		console.error('❌ Ошибка отправки заявки:', error)
		throw error
	}
}

