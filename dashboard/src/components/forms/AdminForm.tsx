import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { adminsAPI, AdminUserType, MenuItem } from '../../api';
import { getOrganisationsList } from '../../api/organisations';

interface AdminFormProps {
  admin?: AdminUserType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminForm = ({ admin, onClose, onSuccess }: AdminFormProps) => {
  const [loading, setLoading] = useState(false);
  const [menuOptions, setMenuOptions] = useState<MenuItem[]>([]);
  const [organisations, setOrganisations] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'Moderator' as 'Admin' | 'Moderator' | 'Coordinator',
    allowed_menus: [] as string[],
    phone: '',
    organization: null as number | null,
    position: '',
    is_active: true,
  });

  // Загрузка списка доступных меню и организаций
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Загрузка меню и организаций...');
        const [menus, orgs] = await Promise.all([
          adminsAPI.getMenuOptions(),
          getOrganisationsList()
        ]);
        setMenuOptions(menus);
        const orgList = orgs.results || orgs;
        setOrganisations(orgList);
        console.log('✅ Меню:', menus.length, 'Организаций:', orgList.length);
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
      }
    };

    loadData();
  }, []);

  // Заполнение формы при редактировании
  useEffect(() => {
    if (admin) {
      console.log('📝 ЗАГРУЗКА АДМИНА ДЛЯ РЕДАКТИРОВАНИЯ:', admin);
      setFormData({
        email: admin.email || '',
        username: admin.username || '',
        first_name: admin.first_name || '',
        last_name: admin.last_name || '',
        password: '', // Пароль не заполняем при редактировании
        role: admin.role || 'Moderator',
        allowed_menus: admin.allowed_menus || [],
        phone: admin.phone || '',
        organization: admin.organization || 1,
        position: admin.position || '',
        is_active: admin.is_active !== undefined ? admin.is_active : true,
      });
    }
  }, [admin]);

  const handleMenuToggle = (menuKey: string) => {
    setFormData(prev => ({
      ...prev,
      allowed_menus: prev.allowed_menus.includes(menuKey)
        ? prev.allowed_menus.filter(m => m !== menuKey)
        : [...prev.allowed_menus, menuKey]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      allowed_menus: menuOptions.map(m => m.key)
    }));
  };

  const handleDeselectAll = () => {
    setFormData(prev => ({
      ...prev,
      allowed_menus: []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.username || !formData.first_name || !formData.last_name) {
      toast.error('Илтимос, барча майдонларни тўлдиринг!');
      return;
    }

    if (!admin && !formData.password) {
      toast.error('Янги администратор учун пароль киритинг!');
      return;
    }

    // Для админа и модератора меню обязательны
    if (formData.role !== 'Coordinator' && formData.allowed_menus.length === 0) {
      toast.error('Камида битта менюни танланг!');
      return;
    }

    // Для координатора организация обязательна
    if (formData.role === 'Coordinator' && !formData.organization) {
      toast.error('Координатор учун ташкилот танланг!');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(admin ? 'Сақланмоқда...' : 'Яратилмоқда...');

    try {
      const submitData: any = { ...formData };
      
      console.log('📝 ОТПРАВЛЯЕМ АДМИНИСТРАТОРА:', submitData);
      
      // При редактировании удаляем пароль если он пустой
      if (admin && !formData.password) {
        delete submitData.password;
      }

      if (admin) {
        await adminsAPI.update(admin.id, submitData);
        toast.success('Администратор муваффақиятли янгиланди! ✅', { id: loadingToast });
      } else {
        await adminsAPI.create(submitData);
        toast.success('Администратор муваффақиятли яратилди! 🎉', { id: loadingToast });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Ошибка при сохранении администратора:', error);
      
      // Better error messages
      if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          toast.error(`Хатолик:\n${errorMessages}`, { id: loadingToast });
        } else {
          toast.error(`Хатолик: ${errors.error || errors}`, { id: loadingToast });
        }
      } else {
        toast.error(`Хатолик: ${error.message}`, { id: loadingToast });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {admin ? 'Редактировать администратора' : 'Новый администратор'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Имя *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Фамилия *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Телефон *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Должность *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Пароль {!admin && '*'}
              {admin && <span className="text-gray-500 text-xs ml-2">(оставьте пустым, чтобы не менять)</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required={!admin}
            />
          </div>

          {/* Role and Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Роль *
              </label>
              <select
                value={formData.role}
                onChange={(e) => {
                  const newRole = e.target.value as any;
                  setFormData({ 
                    ...formData, 
                    role: newRole,
                    // Для координатора очищаем меню, для других очищаем организацию
                    allowed_menus: newRole === 'Coordinator' ? [] : formData.allowed_menus,
                    organization: newRole !== 'Coordinator' ? null : formData.organization
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Admin">Администратор</option>
                <option value="Moderator">Модератор</option>
                <option value="Coordinator">Координатор</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.role === 'Admin' && '• Полный доступ ко всем функциям'}
                {formData.role === 'Moderator' && '• Доступ к выбранным разделам'}
                {formData.role === 'Coordinator' && '• Доступ только к пользователям своей организации'}
              </p>
            </div>

            {/* Organization - обязательно для Coordinator */}
            {formData.role === 'Coordinator' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Организация * <span className="text-red-500">(обязательно)</span>
                </label>
                <select
                  value={formData.organization || ''}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Выберите организацию...</option>
                  {organisations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Координатор будет видеть только пользователей этой организации
                </p>
              </div>
            )}
          </div>

          {/* Active Status */}
          {admin && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Активен
              </label>
            </div>
          )}

          {/* Allowed Menus - только для Admin и Moderator */}
          {formData.role !== 'Coordinator' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Доступ к меню * (выберите минимум 1)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Выбрать все
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400"
                  >
                    Снять все
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                {menuOptions.map((menu) => (
                  <div key={menu.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`menu-${menu.key}`}
                      checked={formData.allowed_menus.includes(menu.key)}
                      onChange={() => handleMenuToggle(menu.key)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`menu-${menu.key}`}
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {menu.label}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Выбрано: {formData.allowed_menus.length} из {menuOptions.length}
              </div>
            </div>
          )}

          {/* Info для координаторов */}
          {formData.role === 'Coordinator' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>ℹ️ Координатор:</strong> Автоматически получает доступ к просмотру всех пользователей своей организации.
                Настройка меню не требуется.
              </p>
            </div>
          )}
        </form>

        {/* Buttons */}
        <div className="flex gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }}
            className="flex-1 bg-linear-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : admin ? 'Сохранить изменения' : 'Создать администратора'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;


