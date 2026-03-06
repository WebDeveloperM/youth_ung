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
    confirm_password: '',
    role: 'Moderator' as 'Admin' | 'Moderator' | 'Coordinator',
    allowed_menus: [] as string[],
    phone: '',
    organization: null as number | null,
    position: '',
    is_active: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [menus, orgs] = await Promise.all([
          adminsAPI.getMenuOptions(),
          getOrganisationsList()
        ]);
        setMenuOptions(menus);
        const orgList = orgs.results || orgs;
        setOrganisations(orgList);
      } catch (error) {
        // silent
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (admin) {
      setFormData({
        email: admin.email || '',
        username: admin.username || '',
        first_name: admin.first_name || '',
        last_name: admin.last_name || '',
        password: '',
        confirm_password: '',
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

  const handleRoleChange = (newRole: 'Admin' | 'Moderator' | 'Coordinator') => {
    setFormData(prev => ({
      ...prev,
      role: newRole,
      // Admin gets all menus automatically; Coordinator uses organization instead
      allowed_menus: newRole === 'Admin'
        ? menuOptions.map(m => m.key)
        : newRole === 'Coordinator'
          ? []
          : prev.allowed_menus,
      organization: newRole !== 'Coordinator' ? null : prev.organization,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.username || !formData.first_name || !formData.last_name) {
      toast.error('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    if (!admin && !formData.password) {
      toast.error('Yangi administrator uchun parol kiriting!');
      return;
    }

    // Password confirmation check
    if (formData.password && formData.password !== formData.confirm_password) {
      toast.error('Parollar mos kelmadi! Qaytadan tekshiring.');
      return;
    }

    // Moderator must have at least one menu selected
    if (formData.role === 'Moderator' && formData.allowed_menus.length === 0) {
      toast.error('Moderator uchun kamida bitta menyuni tanlang!');
      return;
    }

    if (formData.role === 'Coordinator' && !formData.organization) {
      toast.error('Koordinator uchun tashkilot tanlang!');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(admin ? 'Saqlanmoqda...' : 'Yaratilmoqda...');

    try {
      const submitData: any = { ...formData };
      delete submitData.confirm_password;

      // Remove password if editing and left blank
      if (admin && !formData.password) {
        delete submitData.password;
      }

      // Admin role — ensure all menus are included
      if (formData.role === 'Admin') {
        submitData.allowed_menus = menuOptions.map(m => m.key);
      }

      if (admin) {
        await adminsAPI.update(admin.id, submitData);
        toast.success('Administrator muvaffaqiyatli yangilandi!', { id: loadingToast });
      } else {
        await adminsAPI.create(submitData);
        toast.success('Administrator muvaffaqiyatli yaratildi!', { id: loadingToast });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          toast.error(`Xatolik:\n${errorMessages}`, { id: loadingToast });
        } else {
          toast.error(`Xatolik: ${errors.error || errors}`, { id: loadingToast });
        }
      } else {
        toast.error(`Xatolik: ${error.message}`, { id: loadingToast });
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
            {admin ? 'Administratorni tahrirlash' : 'Yangi administrator'}
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
                Ism *
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
                Familiya *
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
                Telefon *
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
                Lavozim *
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Parol {!admin && '*'}
                {admin && <span className="text-gray-500 text-xs ml-2">(o'zgartirmasangiz bo'sh qoldiring)</span>}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required={!admin}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Parolni tasdiqlang {!admin && '*'}
              </label>
              <input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  formData.confirm_password && formData.password !== formData.confirm_password
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                required={!admin}
              />
              {formData.confirm_password && formData.password !== formData.confirm_password && (
                <p className="mt-1 text-xs text-red-500">Parollar mos kelmadi</p>
              )}
            </div>
          </div>

          {/* Role and Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol *
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Admin">Administrator</option>
                <option value="Moderator">Moderator</option>
                <option value="Coordinator">Koordinator</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.role === 'Admin' && '• Barcha bo\'limlarga to\'liq kirish huquqi'}
                {formData.role === 'Moderator' && '• Tanlangan bo\'limlarga kirish huquqi'}
                {formData.role === 'Coordinator' && '• Faqat o\'z tashkiloti foydalanuvchilariga kirish'}
              </p>
            </div>

            {/* Organization — required for Coordinator */}
            {formData.role === 'Coordinator' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tashkilot * <span className="text-red-500">(majburiy)</span>
                </label>
                <select
                  value={formData.organization || ''}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Tashkilotni tanlang...</option>
                  {organisations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Koordinator faqat shu tashkilot foydalanuvchilarini ko'radi
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
                Faol
              </label>
            </div>
          )}

          {/* Allowed Menus — Admin: info only; Moderator: selectable */}
          {formData.role === 'Admin' && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                <strong>Administrator</strong> barcha bo'limlarga avtomatik to'liq kirish huquqiga ega. Menyu sozlash shart emas.
              </p>
            </div>
          )}

          {formData.role === 'Moderator' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Menyu kirish * (kamida 1 tani tanlang)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Hammasini tanlash
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400"
                  >
                    Barchasini bekor qilish
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
                Tanlangan: {formData.allowed_menus.length} ta / {menuOptions.length} ta
              </div>
            </div>
          )}

          {formData.role === 'Coordinator' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Koordinator</strong> o'z tashkilotining barcha foydalanuvchilarini ko'rish huquqiga avtomatik ega bo'ladi. Menyu sozlash shart emas.
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
            {loading ? 'Saqlanmoqda...' : admin ? 'O\'zgarishlarni saqlash' : 'Administrator yaratish'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;
