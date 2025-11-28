import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { adminsAPI, AdminUserType } from '../api';
import AdminForm from '../components/forms/AdminForm';

const Administrators = () => {
  const [admins, setAdmins] = useState<AdminUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserType | null>(null);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminsAPI.getAll();
      setAdmins(data);
    } catch (error) {
      console.error('Ошибка загрузки администраторов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите деактивировать этого администратора?')) {
      return;
    }

    try {
      await adminsAPI.delete(id);
      alert('Администратор деактивирован');
      loadAdmins();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении администратора');
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      Moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Администраторы
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Управление администраторами и их правами доступа
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAdmin(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
        >
          <Plus size={20} />
          Добавить администратора
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Всего</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {admins.length}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Активные</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {admins.filter(a => a.is_active).length}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Неактивные</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                {admins.filter(a => !a.is_active).length}
              </p>
            </div>
            <UserX className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Имя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Доступ к меню
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{admin.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {admin.first_name} {admin.last_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{admin.username}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(admin.role)}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs">
                      {admin.allowed_menus && admin.allowed_menus.length > 0 ? (
                        <span className="text-gray-600 dark:text-gray-400">
                          {admin.allowed_menus.length} меню
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">Нет доступа</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {admin.is_active ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Активен
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Неактивен
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {admin.date_joined ? format(new Date(admin.date_joined), 'dd.MM.yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const fullAdmin = await adminsAPI.getOne(admin.id);
                            setEditingAdmin(fullAdmin);
                            setIsModalOpen(true);
                          } catch (error) {
                            alert('Ошибка загрузки администратора');
                          }
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Form Modal */}
      {isModalOpen && (
        <AdminForm
          admin={editingAdmin}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAdmin(null);
          }}
          onSuccess={() => {
            loadAdmins();
          }}
        />
      )}
    </div>
  );
};

export default Administrators;

