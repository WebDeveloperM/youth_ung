import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Building2, Users, CheckCircle } from 'lucide-react';
import { 
  Organisation, 
  OrganisationStatistics,
  getAllOrganisations, 
  getOrganisationById, 
  createOrganisation, 
  updateOrganisation, 
  deleteOrganisation,
  getOrganisationStatistics 
} from '../api/organisations';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const OrganisationsPage = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [filteredOrganisations, setFilteredOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormMode, setIsFormMode] = useState<'create' | 'edit'>('create');
  const [statistics, setStatistics] = useState<OrganisationStatistics | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    avatar: null as File | null,
  });

  useEffect(() => {
    loadOrganisations();
    loadStatistics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, organisations]);

  const loadOrganisations = async () => {
    setLoading(true);
    try {
      const data = await getAllOrganisations({ ordering: '-created_at' });
      setOrganisations(data.results || []);
    } catch (error) {
      console.error('Ошибка загрузки организаций:', error);
      toast.error('Не удалось загрузить организации');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getOrganisationStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const applyFilters = () => {
    let filtered = organisations;

    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrganisations(filtered);
  };

  const openCreateModal = () => {
    setIsFormMode('create');
    setFormData({
      name: '',
      email: '',
      address: '',
      phone: '',
      avatar: null,
    });
    setSelectedOrganisation(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (org: Organisation) => {
    try {
      const fullOrg = await getOrganisationById(org.id);
      setIsFormMode('edit');
      setFormData({
        name: fullOrg.name,
        email: fullOrg.email,
        address: fullOrg.address,
        phone: fullOrg.phone || '',
        avatar: null,
      });
      setSelectedOrganisation(fullOrg);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка загрузки организации:', error);
      toast.error('Не удалось загрузить данные организации');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrganisation(null);
    setFormData({
      name: '',
      email: '',
      address: '',
      phone: '',
      avatar: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('address', formData.address);
    if (formData.phone) data.append('phone', formData.phone);
    if (formData.avatar) data.append('avatar', formData.avatar);

    try {
      if (isFormMode === 'create') {
        await createOrganisation(data);
        toast.success('Организация успешно создана');
      } else if (selectedOrganisation) {
        await updateOrganisation(selectedOrganisation.id, data);
        toast.success('Организация успешно обновлена');
      }
      loadOrganisations();
      loadStatistics();
      closeModal();
    } catch (error: any) {
      console.error('Ошибка сохранения организации:', error);
      toast.error(error.response?.data?.detail || 'Не удалось сохранить организацию');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту организацию?')) return;
    
    try {
      await deleteOrganisation(id);
      toast.success('Организация успешно удалена');
      loadOrganisations();
      loadStatistics();
    } catch (error: any) {
      console.error('Ошибка удаления организации:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Не удалось удалить организацию';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-700">Загрузка организаций...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tashkilotlar</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить организацию
        </button>
      </div>

      {/* Статистика */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего организаций</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total_organisations}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">С сотрудниками</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.organisations_with_employees}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Без сотрудников</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.organisations_without_employees}</p>
            </div>
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего сотрудников</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total_employees}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      )}

      {/* Поиск */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию, email или телефону..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Таблица организаций */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Адрес</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата создания</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrganisations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  Организации не найдены.
                </td>
              </tr>
            ) : (
              filteredOrganisations.map(org => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {org.avatar_url ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover mr-3"
                          src={org.avatar_url}
                          alt={org.name || 'Organisation'}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">{org.name || 'Без названия'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{org.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{org.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{org.address || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {org.created_at ? format(new Date(org.created_at), 'dd.MM.yyyy', { locale: ru }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(org)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isFormMode === 'create' ? 'Создать организацию' : 'Редактировать организацию'}
            </h2>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998901234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Логотип
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.files?.[0] || null })}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isFormMode === 'create' ? 'Создать' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganisationsPage;

