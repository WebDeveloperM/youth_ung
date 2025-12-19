import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    login: 'admin@admin.com',
    password: 'admin123',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      console.log('✅ Вход выполнен:', response);
      
      // Токен уже сохранен в authAPI.login
      // Перенаправляем на dashboard
      navigate('/dashboard');
      window.location.reload(); // Обновляем чтобы загрузить данные
    } catch (err: any) {
      console.error('❌ Ошибка входа:', err);
      console.error('❌ Детали ошибки:', err.response?.data);
      
      // Извлекаем сообщение об ошибке
      let errorMessage = 'Логин ёки парол хато!';
      
      if (err.response?.data) {
        const data = err.response.data;
        // Проверяем различные форматы ошибок
        if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          errorMessage = data.non_field_errors[0];
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UNG Youth</h1>
          <p className="text-gray-600">Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email ёки Username
            </label>
            <input
              type="text"
              required
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@admin.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Парол
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Кутилмоқда...' : 'Кириш'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            <strong>Тест учун:</strong><br />
            Email: admin@admin.com<br />
            Парол: admin123
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 UNG Youth Platform
        </p>
      </div>
    </div>
  );
};

export default Login;

