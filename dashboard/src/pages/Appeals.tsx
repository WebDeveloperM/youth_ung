import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getAppeals, updateAppealStatus, Appeal, getAppealStatistics, AppealStatistics } from '../api/appeals';

const Appeals = () => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [filteredAppeals, setFilteredAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [statistics, setStatistics] = useState<AppealStatistics | null>(null);

  useEffect(() => {
    loadAppeals();
    loadStatistics();
  }, []);

  useEffect(() => {
    filterAppeals();
  }, [searchTerm, statusFilter, appeals]);

  const loadAppeals = async () => {
    setLoading(true);
    try {
      const data = await getAppeals({ ordering: '-created_at' });
      setAppeals(data.results || data);
    } catch (error) {
      console.error('Ошибка загрузки обращений:', error);
      toast.error('Не удалось загрузить обращения');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getAppealStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const filterAppeals = () => {
    let filtered = appeals;

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appeal => appeal.status === statusFilter);
    }

    // Поиск
    if (searchTerm) {
      filtered = filtered.filter(appeal =>
        appeal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppeals(filtered);
  };

  const handleStatusChange = async (appealId: number, newStatus: string) => {
    try {
      await updateAppealStatus(appealId, newStatus, adminResponse);
      toast.success('Статус обновлен');
      loadAppeals();
      loadStatistics();
      setSelectedAppeal(null);
      setAdminResponse('');
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      toast.error('Не удалось обновить статус');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      new: <AlertCircle className="w-4 h-4" />,
      in_progress: <Clock className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || <AlertCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Загрузка обращений...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Заголовок и статистика */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Обращения пользователей</h1>
        
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Всего</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
              <p className="text-sm text-blue-600">Новые</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.new}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
              <p className="text-sm text-yellow-600">В работе</p>
              <p className="text-2xl font-bold text-yellow-900">{statistics.in_progress}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
              <p className="text-sm text-green-600">Решено</p>
              <p className="text-2xl font-bold text-green-900">{statistics.resolved}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
              <p className="text-sm text-red-600">Отклонено</p>
              <p className="text-2xl font-bold text-red-900">{statistics.rejected}</p>
            </div>
          </div>
        )}
      </div>

      {/* Фильтры */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Поиск */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по теме, имени или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Фильтр по статусу */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Все статусы</option>
          <option value="new">Новые</option>
          <option value="in_progress">В работе</option>
          <option value="resolved">Решено</option>
          <option value="rejected">Отклонено</option>
        </select>
      </div>

      {/* Список обращений */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тема
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppeals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Обращений не найдено
                </td>
              </tr>
            ) : (
              filteredAppeals.map((appeal) => (
                <tr key={appeal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appeal.user_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appeal.user_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {appeal.subject.length > 50
                        ? appeal.subject.substring(0, 50) + '...'
                        : appeal.subject}
                    </div>
                    {appeal.is_anonymous && (
                      <span className="text-xs text-gray-500 italic">🕶️ Анонимно</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        appeal.status
                      )}`}
                    >
                      {getStatusIcon(appeal.status)}
                      {appeal.status_display}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(appeal.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedAppeal(appeal)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Просмотр
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно детального просмотра */}
      {selectedAppeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Заголовок */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Детали обращения</h2>
                <button
                  onClick={() => {
                    setSelectedAppeal(null);
                    setAdminResponse('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Информация о пользователе */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Информация о пользователе</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Имя:</span>
                    <span className="ml-2 font-medium">{selectedAppeal.user_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{selectedAppeal.user_email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Дата:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedAppeal.created_at).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Анонимно:</span>
                    <span className="ml-2 font-medium">
                      {selectedAppeal.is_anonymous ? 'Да' : 'Нет'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Язык и Тема */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Язык обращения</h3>
                <p className="text-gray-600">{selectedAppeal.language_display}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Тема</h3>
                <p className="text-gray-900">{selectedAppeal.subject}</p>
              </div>

              {/* Сообщение */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Сообщение</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedAppeal.message}</p>
              </div>

              {/* Текущий статус */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Текущий статус</h3>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    selectedAppeal.status
                  )}`}
                >
                  {getStatusIcon(selectedAppeal.status)}
                  {selectedAppeal.status_display}
                </span>
              </div>

              {/* Ответ администратора */}
              {selectedAppeal.admin_response && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-2">Ответ администратора</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedAppeal.admin_response}</p>
                </div>
              )}

              {/* Изменение статуса */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Изменить статус</h3>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleStatusChange(selectedAppeal.id, 'in_progress')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    disabled={selectedAppeal.status === 'in_progress'}
                  >
                    В работу
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedAppeal.id, 'resolved')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    disabled={selectedAppeal.status === 'resolved'}
                  >
                    Решено
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedAppeal.id, 'rejected')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={selectedAppeal.status === 'rejected'}
                  >
                    Отклонить
                  </button>
                </div>

                {/* Поле для ответа */}
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Введите ответ администратора (необязательно)..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appeals;

