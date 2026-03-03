import { useState, useEffect } from 'react';
import { Search, Eye, UserCheck, UserX, Shield, User as UserIcon, Edit, Trash2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { getAllUsers, getUserStatistics, toggleUserStatus, deleteUser, setUserPassword, setUserRole, User, UserStatistics } from '../api/users';
import UserEditForm from '../components/forms/UserEditForm';
import { authAPI, AdminUser } from '../api/auth';

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
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

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
    let filtered = users;
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.is_active === (statusFilter === 'active'));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.first_name?.toLowerCase().includes(term) ||
        u.last_name?.toLowerCase().includes(term)
      );
    }
    setFilteredUsers(filtered);
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

  const handleToggleStatus = async (user: User) => {
    if (!window.confirm(`${user.first_name || user.email} ni ${user.is_active ? 'nofaol' : 'faol'} qilmoqchimisiz?`)) return;
    try {
      const updated = await toggleUserStatus(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: updated.is_active } : u));
      toast.success(`Foydalanuvchi ${updated.is_active ? 'faollashtirildi' : 'nofaol qilindi'}`);
    } catch {
      toast.error(`Statusni o'zgartirib bo'lmadi`);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`${user.first_name || user.email} ni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.`)) return;
    try {
      await deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success('Foydalanuvchi o\'chirildi');
    } catch {
      toast.error('Foydalanuvchini o\'chirib bo\'lmadi');
    }
  };

  const canManage = currentUser?.role === 'Admin' || currentUser?.is_superuser;

  const handleResetPassword = async () => {
    if (!resetPasswordUser) return;
    if (newPassword.length < 12) {
      toast.error('Parol kamida 12 ta belgidan iborat bo\'lishi kerak');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Parollar mos kelmadi');
      return;
    }
    setResetLoading(true);
    try {
      await setUserPassword(resetPasswordUser.id, newPassword);
      toast.success('Parol muvaffaqiyatli o\'zgartirildi');
      setResetPasswordUser(null);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      const msg = apiErr?.response?.data?.error || 'Parolni o\'zgartirib bo\'lmadi';
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  const handleSetRole = async (user: User, newRole: string) => {
    if (newRole === user.role) return;
    if (!window.confirm(`${user.first_name || user.email} rolini "${newRole}" ga o'zgartirishni xohlaysizmi?`)) return;
    try {
      const updated = await setUserRole(user.id, newRole);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: updated.role } : u));
      toast.success(`Rol "${updated.role}" ga o'zgartirildi`);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      const msg = apiErr?.response?.data?.error || 'Rolni o\'zgartirib bo\'lmadi';
      toast.error(msg);
    }
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
                      <div className="shrink-0 h-10 w-10">
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
                    {canManage && !user.is_superuser && user.id !== currentUser?.id ? (
                      <select
                        value={user.role}
                        onChange={e => handleSetRole(user, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 outline-none cursor-pointer ${getRoleBadge(user.role)}`}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Coordinator">Coordinator</option>
                        <option value="User">User</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    )}
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
                      {/* View */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        title="Ko'rish"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit — Coordinator only */}
                      {currentUser?.role === 'Coordinator' && (
                        <button
                          onClick={() => setEditingUserId(user.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {/* Toggle active/inactive — Admin only */}
                      {canManage && !user.is_superuser && (
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            user.is_active
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title={user.is_active ? 'Nofaol qilish' : 'Faollashtirish'}
                        >
                          {user.is_active ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          {user.is_active ? 'Bloklash' : 'Faollashtirish'}
                        </button>
                      )}

                      {/* Reset password — Admin only */}
                      {canManage && (
                        <button
                          onClick={() => { setResetPasswordUser(user); setNewPassword(''); setConfirmPassword(''); }}
                          className="text-purple-600 hover:text-purple-800"
                          title="Parolni tiklash"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete — Admin only, not superusers */}
                      {canManage && !user.is_superuser && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-800"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-600" />
                Parolni tiklash
              </h2>
              <button onClick={() => setResetPasswordUser(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium text-gray-800">
                {resetPasswordUser.first_name || resetPasswordUser.email}
              </span>{' '}
              uchun yangi parol o'rnating.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parol</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Kamida 12 ta belgi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Parolni qayta kiriting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600">Parollar mos kelmadi</p>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setResetPasswordUser(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleResetPassword}
                disabled={resetLoading || !newPassword || newPassword !== confirmPassword}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetLoading ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
