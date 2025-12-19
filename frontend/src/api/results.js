import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const resultsClient = axios.create({
	baseURL: `${API_BASE_URL}/results`,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Get results list (public)
export const getResultsList = async (params = {}) => {
	try {
		const response = await resultsClient.get('/', { params })
		return response.data.results || response.data
	} catch (error) {
		console.error('Error loading results:', error)
		throw error
	}
}

// Get single result
export const getResultDetail = async (id) => {
	try {
		const response = await resultsClient.get(`/${id}/`)
		return response.data
	} catch (error) {
		console.error('Error loading result:', error)
		throw error
	}
}

export default {
	getResultsList,
	getResultDetail,
}

