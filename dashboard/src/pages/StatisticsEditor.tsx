import { useState, useEffect } from 'react';
import { Save, RefreshCw, Users, GraduationCap, Briefcase, Languages, BookOpen, Crown, Medal, FileDown } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Statistics {
  id: number;
  total_youth: number;
  male_count: number;
  female_count: number;
  foreign_graduates: number;
  top300_graduates: number;
  top500_graduates: number;
  higher_education: number;
  secondary_education: number;
  technical_staff: number;
  service_staff: number;
  promoted_youth: number;
  language_cert_total: number;
  ielts_count: number;
  cefr_count: number;
  topik_count: number;
  scientific_degree_total: number;
  phd_count: number;
  dsc_count: number;
  candidate_count: number;
  young_leaders_total: number;
  directors_count: number;
  heads_count: number;
  managers_count: number;
  state_awards_total: number;
  orders_count: number;
  medals_count: number;
  honorary_count: number;
  last_updated: string;
  updated_by_name: string | null;
}

export default function StatisticsEditor() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API_URL}/api/v1/statistics/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      showMessage('error', 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!statistics) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      
      await axios.put(
        `${API_URL}/api/v1/statistics/`,
        statistics,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showMessage('success', 'Статистика успешно обновлена!');
      await fetchStatistics(); // Перезагрузить данные
    } catch (error: any) {
      console.error('Ошибка сохранения:', error);
      showMessage('error', error.response?.data?.detail || 'Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `${API_URL}/api/v1/statistics/export/pdf/`,
        {
          headers: {
            'Authorization': `Token ${token}`
          },
          responseType: 'blob' // Важно для получения файла
        }
      );

      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `youth_statistics_${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showMessage('success', 'PDF отчет успешно скачан!');
    } catch (error) {
      console.error('Ошибка экспорта PDF:', error);
      showMessage('error', 'Ошибка при генерации PDF');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleChange = (field: keyof Statistics, value: number) => {
    if (statistics) {
      setStatistics({ ...statistics, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Не удалось загрузить данные статистики
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Редактирование статистики</h1>
          <p className="text-sm text-gray-500 mt-1">
            Последнее обновление: {new Date(statistics.last_updated).toLocaleString('ru-RU')}
            {statistics.updated_by_name && ` • ${statistics.updated_by_name}`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchStatistics}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Обновить
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <FileDown className="w-4 h-4" />
            Экспорт в PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`border rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Основная статистика */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Основная статистика</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Общее количество молодежи</label>
              <input
                type="number"
                value={statistics.total_youth}
                onChange={(e) => handleChange('total_youth', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Мужчин</label>
                <input
                  type="number"
                  value={statistics.male_count}
                  onChange={(e) => handleChange('male_count', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Женщин</label>
                <input
                  type="number"
                  value={statistics.female_count}
                  onChange={(e) => handleChange('female_count', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Образование */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Образование</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Высшее</label>
                <input
                  type="number"
                  value={statistics.higher_education}
                  onChange={(e) => handleChange('higher_education', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Среднее</label>
                <input
                  type="number"
                  value={statistics.secondary_education}
                  onChange={(e) => handleChange('secondary_education', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Зарубежные вузы</label>
              <input
                type="number"
                value={statistics.foreign_graduates}
                onChange={(e) => handleChange('foreign_graduates', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TOP 300</label>
                <input
                  type="number"
                  value={statistics.top300_graduates}
                  onChange={(e) => handleChange('top300_graduates', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TOP 500</label>
                <input
                  type="number"
                  value={statistics.top500_graduates}
                  onChange={(e) => handleChange('top500_graduates', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Сотрудники */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Сотрудники</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Технические</label>
              <input
                type="number"
                value={statistics.technical_staff}
                onChange={(e) => handleChange('technical_staff', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Обслуживающие</label>
              <input
                type="number"
                value={statistics.service_staff}
                onChange={(e) => handleChange('service_staff', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Повышенные</label>
              <input
                type="number"
                value={statistics.promoted_youth}
                onChange={(e) => handleChange('promoted_youth', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Языковые сертификаты */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Languages className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Языковые сертификаты</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Всего</label>
              <input
                type="number"
                value={statistics.language_cert_total}
                onChange={(e) => handleChange('language_cert_total', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IELTS</label>
                <input
                  type="number"
                  value={statistics.ielts_count}
                  onChange={(e) => handleChange('ielts_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEFR</label>
                <input
                  type="number"
                  value={statistics.cefr_count}
                  onChange={(e) => handleChange('cefr_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TOPIK</label>
                <input
                  type="number"
                  value={statistics.topik_count}
                  onChange={(e) => handleChange('topik_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Научные степени */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Научные степени</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Всего</label>
              <input
                type="number"
                value={statistics.scientific_degree_total}
                onChange={(e) => handleChange('scientific_degree_total', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PhD</label>
                <input
                  type="number"
                  value={statistics.phd_count}
                  onChange={(e) => handleChange('phd_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DSc</label>
                <input
                  type="number"
                  value={statistics.dsc_count}
                  onChange={(e) => handleChange('dsc_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Соиск.</label>
                <input
                  type="number"
                  value={statistics.candidate_count}
                  onChange={(e) => handleChange('candidate_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Молодые лидеры */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Молодые лидеры</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Всего</label>
              <input
                type="number"
                value={statistics.young_leaders_total}
                onChange={(e) => handleChange('young_leaders_total', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Директ.</label>
                <input
                  type="number"
                  value={statistics.directors_count}
                  onChange={(e) => handleChange('directors_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Началь.</label>
                <input
                  type="number"
                  value={statistics.heads_count}
                  onChange={(e) => handleChange('heads_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Менедж.</label>
                <input
                  type="number"
                  value={statistics.managers_count}
                  onChange={(e) => handleChange('managers_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Государственные награды */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <Medal className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Государственные награды</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Всего</label>
              <input
                type="number"
                value={statistics.state_awards_total}
                onChange={(e) => handleChange('state_awards_total', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ордена</label>
                <input
                  type="number"
                  value={statistics.orders_count}
                  onChange={(e) => handleChange('orders_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Медали</label>
                <input
                  type="number"
                  value={statistics.medals_count}
                  onChange={(e) => handleChange('medals_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Почетн.</label>
                <input
                  type="number"
                  value={statistics.honorary_count}
                  onChange={(e) => handleChange('honorary_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  );
}

