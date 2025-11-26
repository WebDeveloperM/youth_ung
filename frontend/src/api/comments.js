import apiClient from './auth'

/**
 * API client для работы с комментариями
 */
export const commentsAPI = {
	/**
	 * Получить список комментариев для объекта
	 * @param {string} contentType - Тип контента (news, innovation, etc.)
	 * @param {number} objectId - ID объекта
	 */
	async getComments(contentType, objectId) {
		try {
			console.log(`📥 Загрузка комментариев для ${contentType}:${objectId}`)
			const response = await apiClient.get('/comments/', {
				params: {
					content_type: contentType,
					object_id: objectId,
				},
			})
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			console.error('❌ Ошибка загрузки комментариев:', error)
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при загрузке комментариев' },
			}
		}
	},

	/**
	 * Создать новый комментарий
	 * @param {string} contentType - Тип контента
	 * @param {number} objectId - ID объекта
	 * @param {string} content - Содержание комментария
	 */
	async createComment(contentType, objectId, content) {
		try {
			console.log(`📤 Создание комментария для ${contentType}:${objectId}`)
			const response = await apiClient.post('/comments/', {
				content_type: contentType,
				object_id: objectId,
				content: content,
			})
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			console.error('❌ Ошибка создания комментария:', error)
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при создании комментария' },
			}
		}
	},

	/**
	 * Лайкнуть комментарий
	 * @param {number} commentId - ID комментария
	 */
	async likeComment(commentId) {
		try {
			const response = await apiClient.post(`/comments/${commentId}/like/`)
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			console.error('❌ Ошибка лайка комментария:', error)
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при лайке комментария' },
			}
		}
	},

	/**
	 * Убрать лайк с комментария
	 * @param {number} commentId - ID комментария
	 */
	async unlikeComment(commentId) {
		try {
			const response = await apiClient.delete(`/comments/${commentId}/like/`)
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			console.error('❌ Ошибка удаления лайка:', error)
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при удалении лайка' },
			}
		}
	},

	/**
	 * Дизлайкнуть комментарий
	 * @param {number} commentId - ID комментария
	 */
	async dislikeComment(commentId) {
		try {
			const response = await apiClient.post(`/comments/${commentId}/dislike/`)
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			console.error('❌ Ошибка дизлайка комментария:', error)
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при дизлайке комментария' },
			}
		}
	},

	/**
	 * Убрать дизлайк с комментария
	 * @param {number} commentId - ID комментария
	 */
	async undislikeComment(commentId) {
		try {
			const response = await apiClient.delete(`/comments/${commentId}/dislike/`)
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			console.error('❌ Ошибка удаления дизлайка:', error)
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при удалении дизлайка' },
			}
		}
	},

	/**
	 * Удалить комментарий
	 * @param {number} commentId - ID комментария
	 */
	async deleteComment(commentId) {
		try {
			const response = await apiClient.delete(`/comments/${commentId}/`)
			return {
				success: true,
				data: response.data,
			}
		} catch (error) {
			console.error('❌ Ошибка удаления комментария:', error)
			return {
				success: false,
				error: error.response?.data || { message: 'Ошибка при удалении комментария' },
			}
		}
	},
}

export default commentsAPI



