import { useState, useEffect } from 'react';
import { X, Eye, Check, Clock, AlertCircle, FileText } from 'lucide-react';
import { applicationsAPI, Application } from '../api';

interface ContentApplicationsModalProps {
  contentId: number;
  contentTitle: string;
  contentType: string; // 'grant', 'scholarship', 'competition', 'internship', 'job'
  onClose: () => void;
}

export default function ContentApplicationsModal({ 
  contentId, 
  contentTitle, 
  contentType,
  onClose 
}: ContentApplicationsModalProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const contentTypeLabels: Record<string, string> = {
    grant: 'грант',
    scholarship: 'стипендию',
    competition: 'конкурс',
    internship: 'стажировку',
    job: 'вакансию',
  };

  useEffect(() => {
    loadApplications();
  }, [contentId, contentType]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const allApplications = await applicationsAPI.getAll();
      
      console.log('🔍 ВСЕ ЗАЯВКИ:', allApplications);
      console.log('🎯 ИЩЕМ:', { contentType, contentId });
      
      // Фильтруем заявки только для этого контента
      const contentApplications = allApplications.filter(
        (app) => {
          console.log('📋 Проверка заявки:', {
            id: app.id,
            content_type_name: app.content_type_name,
            object_id: app.object_id,
            match: app.content_type_name === contentType && app.object_id === contentId
          });
          return app.content_type_name === contentType && app.object_id === contentId;
        }
      );
      
      console.log('✅ НАЙДЕНО ЗАЯВОК:', contentApplications.length, contentApplications);
      setApplications(contentApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await applicationsAPI.update(id, { status: newStatus as any });
      loadApplications();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Заявки на {contentTypeLabels[contentType] || 'объект'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{contentTitle}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Всего заявок: <strong>{applications.length}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Заявок пока нет</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Заявитель
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Контакты
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        #{app.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {app.full_name}
                        </div>
                        {app.organization && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {app.organization}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">{app.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(app.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(app.id)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal (если выбрана заявка) */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Detail Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Заявка #{selectedApplication.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedApplication.full_name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Detail Content */}
              <div className="p-6 space-y-6">
                {/* Status & Actions */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  {getStatusBadge(selectedApplication.status)}
                  <div className="flex gap-2">
                    {selectedApplication.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                      >
                        <Check size={16} />
                        Одобрить
                      </button>
                    )}
                    {selectedApplication.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                      >
                        <X size={16} />
                        Отклонить
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
                      Рассмотрена: {new Date(selectedApplication.reviewed_at).toLocaleString('ru-RU')}
                      {selectedApplication.reviewed_by_info && (
                        <> от {selectedApplication.reviewed_by_info.full_name}</>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

