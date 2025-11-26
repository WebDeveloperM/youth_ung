import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function TestAuthPage() {
	const navigate = useNavigate()
	const [result, setResult] = useState('')
	const [loading, setLoading] = useState(false)

	const testSignUp = async () => {
		setLoading(true)
		setResult('⏳ Отправка...')
		
		const data = {
			full_name: 'Test User',
			date_of_birth: '1995-01-01',
			phone_number: '+998901234567',
			residential_address: 'Tashkent',
			place_of_work: 'IT Company',
			position: 'Developer',
			login: 'testuser' + Date.now() + '@test.com',
			password: '123456',
			confirm_password: '123456'
		}

		console.log('📤 Sending:', data)

		try {
			const response = await fetch('http://localhost:8000/api/v1/users/sign-up/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			})

			console.log('📥 Status:', response.status)
			const json = await response.json()
			console.log('📥 Response:', json)

			if (response.ok) {
				setResult('✅ УСПЕХ!\n' + JSON.stringify(json, null, 2))
				// Сохраняем токен
				localStorage.setItem('authToken', json.token)
				localStorage.setItem('user', JSON.stringify(json))
			} else {
				setResult('❌ ОШИБКА!\n' + JSON.stringify(json, null, 2))
			}
		} catch (error) {
			console.error('💥 Error:', error)
			setResult('💥 ОШИБКА СЕТИ!\n' + error.message)
		} finally {
			setLoading(false)
		}
	}

	const testSignIn = async () => {
		setLoading(true)
		setResult('⏳ Отправка...')
		
		const data = {
			login: 'testuser@test.com',
			password: '123456'
		}

		console.log('📤 Sending:', data)

		try {
			const response = await fetch('http://localhost:8000/api/v1/users/sign-in/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			})

			console.log('📥 Status:', response.status)
			const json = await response.json()
			console.log('📥 Response:', json)

			if (response.ok) {
				setResult('✅ УСПЕХ!\n' + JSON.stringify(json, null, 2))
				// Сохраняем токен
				localStorage.setItem('authToken', json.token)
				localStorage.setItem('user', JSON.stringify(json))
			} else {
				setResult('❌ ОШИБКА!\n' + JSON.stringify(json, null, 2))
			}
		} catch (error) {
			console.error('💥 Error:', error)
			setResult('💥 ОШИБКА СЕТИ!\n' + error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
			<h1>🧪 Тест Авторизации</h1>
			
			<div style={{ marginBottom: '20px' }}>
				<button 
					onClick={testSignUp}
					disabled={loading}
					style={{
						padding: '15px 30px',
						marginRight: '10px',
						fontSize: '16px',
						background: '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: loading ? 'not-allowed' : 'pointer'
					}}
				>
					🚀 Тест Регистрации
				</button>

				<button 
					onClick={testSignIn}
					disabled={loading}
					style={{
						padding: '15px 30px',
						marginRight: '10px',
						fontSize: '16px',
						background: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: loading ? 'not-allowed' : 'pointer'
					}}
				>
					🔑 Тест Входа
				</button>

				<button 
					onClick={() => navigate('/login')}
					style={{
						padding: '15px 30px',
						fontSize: '16px',
						background: '#6c757d',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer'
					}}
				>
					← Назад к форме
				</button>
			</div>

			{result && (
				<pre style={{
					padding: '20px',
					background: result.includes('✅') ? '#d4edda' : '#f8d7da',
					border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
					borderRadius: '5px',
					whiteSpace: 'pre-wrap',
					fontSize: '14px'
				}}>
					{result}
				</pre>
			)}

			<div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '5px' }}>
				<h3>📋 Инструкция:</h3>
				<ol>
					<li>Нажми "Тест Регистрации" - создастся новый пользователь</li>
					<li>Нажми "Тест Входа" - войдет под testuser@test.com</li>
					<li>Смотри результат ниже кнопок</li>
					<li>Смотри консоль браузера (F12) для деталей</li>
				</ol>
				<p><strong>Backend:</strong> http://localhost:8000</p>
				<p><strong>Эта страница:</strong> http://localhost:5173/testauth</p>
			</div>
		</div>
	)
}



