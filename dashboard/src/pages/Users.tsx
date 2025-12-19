import { useState, useEffect } from 'react';
import { Search, Eye, Users as UsersIcon, UserCheck, UserX, Shield, User as UserIcon, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { getAllUsers, getUserStatistics, User, UserStatistics } from '../api/users';
import UserEditForm from '../components/forms/UserEditForm';
import { authAPI } from '../api';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
    loadStatistics();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await authAPI.getMe();
      setCurrentUser(user);
    } catch (error) {
      console.error('Ошибка загрузки текущего пользователя:', error);
    }
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ ordering: '-date_joined' });
      setUsers(data.results || data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      toast.error('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getUserStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Фильтр по роли
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.is_active === isActive);
    }

    // Поиск
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      Admin: 'bg-red-100 text-red-800',
      Moderator: 'bg-blue-100 text-blue-800',
      User: 'bg-gray-100 text-gray-800',
    };
    return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      Admin: <Shield className="w-4 h-4" />,
      Moderator: <UserCheck className="w-4 h-4" />,
      User: <UserIcon className="w-4 h-4" />,
    };
    return icons[role as keyof typeof icons] || <UserIcon className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Загрузка пользователей...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Заголовок и статистика */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Foydalanuvchilar</h1>
        
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Jami</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
              <p className="text-sm text-green-600">Faol</p>
              <p className="text-2xl font-bold text-green-900">{statistics.active}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Nofaol</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.inactive}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
              <p className="text-sm text-red-600">Adminlar</p>
              <p className="text-2xl font-bold text-red-900">{statistics.admins}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
              <p className="text-sm text-blue-600">Moderatorlar</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.moderators}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200">
              <p className="text-sm text-purple-600">Foydalanuvchilar</p>
              <p className="text-2xl font-bold text-purple-900">{statistics.users}</p>
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
              placeholder="Qidirish (ism, email, telefon)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Фильтр по роли */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Barcha rollar</option>
          <option value="Admin">Adminlar</option>
          <option value="Moderator">Moderatorlar</option>
          <option value="User">Foydalanuvchilar</option>
        </select>

        {/* Фильтр по статусу */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Barcha statuslar</option>
          <option value="active">Faol</option>
          <option value="inactive">Nofaol</option>
        </select>
      </div>

      {/* Список пользователей */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foydalanuvchi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email / Telefon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tashkilot
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ro'yxatdan o'tgan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Foydalanuvchilar topilmadi
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar_url}
                            alt={user.username || 'User'}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name || user.last_name
                            ? `${user.first_name} ${user.last_name}`.trim()
                            : user.username || 'Без имени'}
                        </div>
                        <div className="text-sm text-gray-500">@{user.username || 'unknown'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.organization_name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          Faol
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" />
                          Nofaol
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.date_joined).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {/* Кнопка редактирования - доступна Coordinator */}
                      {currentUser?.role === 'Coordinator' && (
                        <button
                          onClick={() => setEditingUserId(user.id)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                          title="Таҳрирлаш"
                        >
                          <Edit className="w-4 h-4" />
                          Tahrirlash
                        </button>
                      )}
                      {/* Кнопка просмотра */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        title="Кўриш"
                      >
                        <Eye className="w-4 h-4" />
                        Ko'rish
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Edit Modal */}
      {editingUserId && (
        <UserEditForm
          userId={editingUserId}
          onClose={() => setEditingUserId(null)}
          onSuccess={() => {
            loadUsers();
            loadStatistics();
          }}
        />
      )}

      {/* Модальное окно детального просмотра */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Заголовок */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Foydalanuvchi ma'lumotlari
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Аватар и основная инфо */}
              <div className="flex items-center mb-6">
                {selectedUser.avatar_url ? (
                  <img
                    className="h-20 w-20 rounded-full object-cover"
                    src={selectedUser.avatar_url}
                    alt={selectedUser.username || 'User'}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-2xl">
                      {selectedUser.first_name?.[0]?.toUpperCase() || selectedUser.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="ml-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.first_name || selectedUser.last_name
                      ? `${selectedUser.first_name} ${selectedUser.last_name}`.trim()
                      : selectedUser.username || 'Без имени'}
                  </h3>
                  <p className="text-gray-500">@{selectedUser.username || 'unknown'}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                        selectedUser.role
                      )}`}
                    >
                      {getRoleIcon(selectedUser.role)}
                      {selectedUser.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedUser.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedUser.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Детальная информация */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Ro'yxatdan o'tgan</p>
                  <p className="font-medium">
                    {new Date(selectedUser.date_joined).toLocaleString('ru-RU')}
                  </p>
                </div>
                {selectedUser.last_login && (
                  <div>
                    <p className="text-sm text-gray-600">Oxirgi kirish</p>
                    <p className="font-medium">
                      {new Date(selectedUser.last_login).toLocaleString('ru-RU')}
                    </p>
                  </div>
                )}
                {selectedUser.organization && (
                  <div>
                    <p className="text-sm text-gray-600">Tashkilot</p>
                    <p className="font-medium">{selectedUser.organization.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
