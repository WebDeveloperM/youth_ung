import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const projectsClient = axios.create({
	baseURL: `${API_BASE_URL}/projects`,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Get projects list (public)
export const getProjectsList = async (params = {}) => {
	try {
		const response = await projectsClient.get('/', { params })
		return response.data.results || response.data
	} catch (error) {
		console.error('Error loading projects:', error)
		throw error
	}
}

// Get single project
export const getProjectDetail = async (id) => {
	try {
		const response = await projectsClient.get(`/${id}/`)
		return response.data
	} catch (error) {
		console.error('Error loading project:', error)
		throw error
	}
}

export default {
	getProjectsList,
	getProjectDetail,
}

