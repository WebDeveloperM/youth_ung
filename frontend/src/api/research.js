import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const researchClient = axios.create({
	baseURL: `${API_BASE_URL}/research`,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Get research list (public)
export const getResearchList = async (params = {}) => {
	try {
		const response = await researchClient.get('/', { params })
		return response.data.results || response.data
	} catch (error) {
		console.error('Error loading research:', error)
		throw error
	}
}

// Get single research
export const getResearchDetail = async (id) => {
	try {
		const response = await researchClient.get(`/${id}/`)
		return response.data
	} catch (error) {
		console.error('Error loading research:', error)
		throw error
	}
}

export default {
	getResearchList,
	getResearchDetail,
}

