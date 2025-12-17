import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Создаем экземпляр axios для мaqолалар
const articlesClient = axios.create({
	baseURL: `${API_BASE_URL}/articles`,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Add token to requests if available
articlesClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('authToken')
		if (token) {
			config.headers.Authorization = `Token ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Tasdiqlangan maqolalar ro'yxatini olish (public)
export const getArticlesList = async (params = {}) => {
	console.log('📚 Maqolalar yuklanyapti:', params)
	try {
		const response = await articlesClient.get('/', { params })
		console.log('✅ Maqolalar yuklandi:', response.data)
		return response.data.results || response.data
	} catch (error) {
		console.error('❌ Maqolalar yuklashda xatolik:', error)
		throw error
	}
}

// Bitta maqolani olish
export const getArticleDetail = async (id) => {
	console.log(`📚 Maqola #${id} yuklanyapti`)
	try {
		const response = await articlesClient.get(`/${id}/`)
		console.log('✅ Maqola yuklandi:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ Maqola yuklashda xatolik:', error)
		throw error
	}
}

// Maqolaga like qo'yish
export const likeArticle = async (id) => {
	console.log(`❤️ Maqolaga like #${id}`)
	try {
		const response = await articlesClient.post(`/${id}/like/`)
		console.log('✅ Like qo\'yildi:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ Like qo\'yishda xatolik:', error)
		throw error
	}
}

// PDF faylni yuklab olish
export const downloadArticlePDF = async (id) => {
	console.log(`📥 PDF yuklanyapti #${id}`)
	try {
		const response = await articlesClient.post(`/${id}/download/`)
		console.log('✅ PDF yuklandi:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ PDF yuklashda xatolik:', error)
		throw error
	}
}

// Foydalanuvchining o'z maqolalari
export const getMyArticles = async () => {
	console.log('📚 Mening maqolalarim yuklanyapti')
	try {
		const response = await articlesClient.get('/my-articles/')
		console.log('✅ Mening maqolalarim yuklandi:', response.data)
		return response.data.results || response.data
	} catch (error) {
		console.error('❌ Mening maqolalarimni yuklashda xatolik:', error)
		throw error
	}
}

// Yangi maqola yuborish
export const submitArticle = async (articleData) => {
	console.log('📤 Yangi maqola yuklanmoqda:', articleData)
	try {
		const formData = new FormData()
		
		// Matnli maydonlarni qo'shish
		Object.keys(articleData).forEach(key => {
			if (articleData[key] !== null && articleData[key] !== undefined) {
				if (key === 'pdf_file' || key === 'cover_image') {
					if (articleData[key] instanceof File) {
						formData.append(key, articleData[key])
					}
				} else {
					formData.append(key, articleData[key])
				}
			}
		})
		
		const response = await articlesClient.post('/my-articles/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		console.log('✅ Maqola yuborildi:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ Maqola yuborishda xatolik:', error)
		throw error
	}
}

// Maqolani tahrirlash
export const updateArticle = async (id, articleData) => {
	console.log(`📝 Maqola tahrirlanyapti #${id}:`, articleData)
	try {
		const formData = new FormData()
		
		Object.keys(articleData).forEach(key => {
			if (articleData[key] !== null && articleData[key] !== undefined) {
				if (key === 'pdf_file' || key === 'cover_image') {
					if (articleData[key] instanceof File) {
						formData.append(key, articleData[key])
					}
				} else {
					formData.append(key, articleData[key])
				}
			}
		})
		
		const response = await articlesClient.patch(`/my-articles/${id}/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		console.log('✅ Maqola tahrirlandi:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ Maqolani tahrirlashda xatolik:', error)
		throw error
	}
}

// Maqolani o'chirish
export const deleteArticle = async (id) => {
	console.log(`🗑️ Maqola o\'chirilmoqda #${id}`)
	try {
		const response = await articlesClient.delete(`/my-articles/${id}/`)
		console.log('✅ Maqola o\'chirildi')
		return response.data
	} catch (error) {
		console.error('❌ Maqolani o\'chirishda xatolik:', error)
		throw error
	}
}

// Statistika
export const getMyArticlesStatistics = async () => {
	console.log('📊 Statistika yuklanyapti')
	try {
		const response = await articlesClient.get('/my-articles/statistics/')
		console.log('✅ Statistika yuklandi:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ Statistika yuklashda xatolik:', error)
		throw error
	}
}

export default {
	getArticlesList,
	getArticleDetail,
	likeArticle,
	downloadArticlePDF,
	getMyArticles,
	submitArticle,
	updateArticle,
	deleteArticle,
	getMyArticlesStatistics,
}
