import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const technologiesClient = axios.create({
	baseURL: `${API_BASE_URL}/technologies`,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Get technologies list (public)
export const getTechnologiesList = async (params = {}) => {
	try {
		const response = await technologiesClient.get('/', { params })
		return response.data.results || response.data
	} catch (error) {
		console.error('Error loading technologies:', error)
		throw error
	}
}

// Get single technology
export const getTechnologyDetail = async (id) => {
	try {
		const response = await technologiesClient.get(`/${id}/`)
		return response.data
	} catch (error) {
		console.error('Error loading technology:', error)
		throw error
	}
}

// Like technology
export const likeTechnology = async (id) => {
	try {
		const response = await technologiesClient.post(`/${id}/like/`)
		return response.data
	} catch (error) {
		console.error('Error liking technology:', error)
		throw error
	}
}

export default {
	getTechnologiesList,
	getTechnologyDetail,
	likeTechnology,
}

