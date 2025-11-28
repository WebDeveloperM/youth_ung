import { useState, useEffect } from 'react';
import { FileText, Eye, Check, X, Clock, AlertCircle } from 'lucide-react';
import { applicationsAPI, Application } from '../api/applications';

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    loadApplications();
    loadStats();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationsAPI.getAll();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await applicationsAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await applicationsAPI.update(id, { status: newStatus as any });
      loadApplications();
      loadStats();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const data = await applicationsAPI.getOne(id);
      setSelectedApplication(data);
    } catch (error) {
      console.error('Error loading application details:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Ожидает' },
      reviewing: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, text: 'На рассмотрении' },
      approved: { color: 'bg-green-100 text-green-800', icon: Check, text: 'Одобрена' },
      rejected: { color: 'bg-red-100 text-red-800', icon: X, text: 'Отклонена' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Заявки</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Управление заявками на гранты, стипендии и конкурсы
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Всего</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ожидают</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Одобрено</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Отклонено</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <X className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'reviewing', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {f === 'all' ? 'Все' : getStatusBadge(f)}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Заявитель
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Контакты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Объект
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Загрузка...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Заявок нет
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      #{app.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {app.full_name}
                      </div>
                      {app.organization && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {app.organization}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{app.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {app.content_type_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {app.content_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(app.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetails(app.id)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Заявка #{selectedApplication.id}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedApplication.content_title}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status & Actions */}
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedApplication.status)}
                <div className="flex gap-2">
                  {selectedApplication.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Check size={16} />
                      Одобрить
                    </button>
                  )}
                  {selectedApplication.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <X size={16} />
                      Отклонить
                    </button>
                  )}
                  {selectedApplication.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(selectedApplication.id, 'reviewing')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      На рассмотрении
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Личная информация
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Полное имя</p>
                    <p className="text-gray-900 dark:text-white">{selectedApplication.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Телефон</p>
                    <p className="text-gray-900 dark:text-white">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Организация</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedApplication.organization || 'Не указано'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Должность</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedApplication.position || 'Не указано'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              {selectedApplication.experience && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Опыт</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedApplication.experience}
                  </p>
                </div>
              )}

              {/* Motivation */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Мотивационное письмо
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedApplication.motivation}
                </p>
              </div>

              {/* Files */}
              {(selectedApplication.cv_file || selectedApplication.portfolio_file) && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Файлы</h4>
                  <div className="flex gap-4">
                    {selectedApplication.cv_file && (
                      <a
                        href={selectedApplication.cv_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        <FileText size={16} />
                        Резюме
                      </a>
                    )}
                    {selectedApplication.portfolio_file && (
                      <a
                        href={selectedApplication.portfolio_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      >
                        <FileText size={16} />
                        Портфолио
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Подана: {new Date(selectedApplication.created_at).toLocaleString('ru-RU')}</p>
                {selectedApplication.reviewed_at && (
                  <p>
                    Рассмотрена: {new Date(selectedApplication.reviewed_at).toLocaleString('ru-RU')}{' '}
                    {selectedApplication.reviewed_by_info && (
                      <>от {selectedApplication.reviewed_by_info.full_name}</>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

