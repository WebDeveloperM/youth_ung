import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, UserCheck, UserX, Search } from 'lucide-react';
import { toast } from 'sonner';
import { adminsAPI, authAPI, AdminUserType } from '../api';
import AdminForm from '../components/forms/AdminForm';

const Administrators = () => {
  const [admins, setAdmins] = useState<AdminUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserType | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminsAPI.getAll();
      const adminsArray = Array.isArray(data) ? data : [];
      setAdmins(adminsArray);
    } catch (error: any) {
      toast.error('Administratorlarni yuklashda xatolik!');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await authAPI.getMe();
        setCurrentUser(user);
      } catch (error) {
        // silent
      }
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Administratorni deaktivatsiya qilishga ishonchingiz komilmi?')) {
      return;
    }

    const loadingToast = toast.loading('Deaktivatsiya qilinmoqda...');
    try {
      await adminsAPI.delete(id);
      toast.success('Administrator muvaffaqiyatli deaktivatsiya qilindi!', { id: loadingToast });
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      toast.error(`Xatolik: ${error.response?.data?.error || error.message}`, { id: loadingToast });
    }
  };

  const filteredAdmins = (Array.isArray(admins) ? admins : []).filter(admin => {
    const searchLower = searchTerm.toLowerCase();
    return (
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.username?.toLowerCase().includes(searchLower) ||
      `${admin.first_name || ''} ${admin.last_name || ''}`.toLowerCase().includes(searchLower) ||
      admin.role?.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadge = (role: string) => {
    const colors = {
      Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      Moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Coordinator: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      Admin: 'Administrator',
      Moderator: 'Moderator',
      Coordinator: 'Koordinator',
    };
    return labels[role as keyof typeof labels] || role;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Administratorlar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Administratorlar va ularning kirish huquqlarini boshqarish
          </p>
        </div>
        {currentUser?.role === 'Admin' && (
          <button
            onClick={() => {
              setEditingAdmin(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
          >
            <Plus size={20} />
            Administrator qo'shish
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Jami</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {Array.isArray(admins) ? admins.length : 0}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Faol</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {Array.isArray(admins) ? admins.filter(a => a.is_active).length : 0}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Faol emas</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                {Array.isArray(admins) ? admins.filter(a => !a.is_active).length : 0}
              </p>
            </div>
            <UserX className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Administrator qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
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
                  Ism
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Menyu kirish
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yaratilgan sana
                </th>
                {currentUser?.role === 'Admin' && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amallar
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={currentUser?.role === 'Admin' ? 8 : 7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'Administrator topilmadi' : 'Administratorlar yo\'q'}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
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
                      {getRoleLabel(admin.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="max-w-xs">
                      {admin.role === 'Admin' ? (
                        <span className="text-indigo-600 dark:text-indigo-400">
                          To'liq kirish
                        </span>
                      ) : admin.role === 'Coordinator' ? (
                        <span className="text-green-600 dark:text-green-400">
                          Tashkilot #{admin.organization || 'N/A'}
                        </span>
                      ) : admin.allowed_menus && admin.allowed_menus.length > 0 ? (
                        <span className="text-gray-600 dark:text-gray-400">
                          {admin.allowed_menus.length} ta menyu
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">Kirish yo'q</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {admin.is_active ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Faol
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Faol emas
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {admin.date_joined ? format(new Date(admin.date_joined), 'dd.MM.yyyy') : '-'}
                  </td>
                  {currentUser?.role === 'Admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={async () => {
                            const loadingToast = toast.loading('Administrator yuklanmoqda...');
                            try {
                              const fullAdmin = await adminsAPI.getOne(admin.id);
                              setEditingAdmin(fullAdmin);
                              setIsModalOpen(true);
                              toast.dismiss(loadingToast);
                            } catch (error: any) {
                              toast.error('Administratorni yuklashda xatolik!', { id: loadingToast });
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
                  )}
                </tr>
                ))
              )}
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
