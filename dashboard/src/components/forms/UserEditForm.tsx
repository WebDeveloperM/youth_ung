import { useState, useEffect } from 'react';
import { X, Save, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { User, UpdateUserData, updateUser, getUserById } from '../../api/users';

interface UserEditFormProps {
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const UserEditForm = ({ userId, onClose, onSuccess }: UserEditFormProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({
    first_name: '',
    last_name: '',
    phone: '',
    position: '',
    date_of_birth: '',
    address: '',
    gender: '',
    // Образование
    education_level: '',
    is_foreign_graduate: false,
    is_top300_graduate: false,
    is_top500_graduate: false,
    // Тип сотрудника
    staff_type: '',
    is_promoted: false,
    // Языковые сертификаты
    has_ielts: false,
    has_cefr: false,
    has_topik: false,
    // Научные степени
    scientific_degree: '',
    // Лидерские позиции
    leadership_position: '',
    // Государственные награды
    state_award_type: '',
  });

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(userId);
      setUser(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        position: data.position || '',
        date_of_birth: data.date_of_birth || '',
        address: data.address || '',
        gender: data.gender || '',
        // Образование
        education_level: data.education_level || '',
        is_foreign_graduate: data.is_foreign_graduate || false,
        is_top300_graduate: data.is_top300_graduate || false,
        is_top500_graduate: data.is_top500_graduate || false,
        // Тип сотрудника
        staff_type: data.staff_type || '',
        is_promoted: data.is_promoted || false,
        // Языковые сертификаты
        has_ielts: data.has_ielts || false,
        has_cefr: data.has_cefr || false,
        has_topik: data.has_topik || false,
        // Научные степени
        scientific_degree: data.scientific_degree || '',
        // Лидерские позиции
        leadership_position: data.leadership_position || '',
        // Государственные награды
        state_award_type: data.state_award_type || '',
      });
    } catch (error: any) {
      console.error('Ошибка загрузки пользователя:', error);
      toast.error('Фойдаланувчини юклашда хатолик!');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!formData.first_name?.trim() || !formData.last_name?.trim()) {
      toast.error('Исм ва фамилия мажбурий!');
      return;
    }

    try {
      setSaving(true);
      await updateUser(userId, formData);
      toast.success('Фойдаланувчи маълумотлари янгиланди!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Ошибка сохранения:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Хатолик юз берди!';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">Юкланмоқда...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Фойдаланувчини таҳрирлаш
              </h2>
              <p className="text-sm text-gray-500">
                {user?.username} (@{user?.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Основная информация */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Асосий маълумотлар</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Исм <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Исм"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Фамилия"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+998901234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Туғилган сана
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Жинси
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Танланг...</option>
                  <option value="Эркак">Эркак</option>
                  <option value="Аёл">Аёл</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Лавозим
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Лавозим"
                />
              </div>
            </div>
          </div>

          {/* Адрес */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Манзил
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Яшаш манзили"
            />
          </div>

          {/* ОБРАЗОВАНИЕ */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎓</span> Маълумот
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Маълумот даражаси
                </label>
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Танланг...</option>
                  <option value="secondary">Ўрта маълумот</option>
                  <option value="higher">Олий маълумот</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_foreign_graduate"
                    checked={formData.is_foreign_graduate}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Хорижий вуз битирган</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_top300_graduate"
                    checked={formData.is_top300_graduate}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">TOP 300 битирувчиси</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_top500_graduate"
                    checked={formData.is_top500_graduate}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">TOP 500 битирувчиси</span>
                </label>
              </div>
            </div>
          </div>

          {/* ТИП СОТРУДНИКА */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💼</span> Ходим тури
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ходим тури
                </label>
                <select
                  name="staff_type"
                  value={formData.staff_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Танланг...</option>
                  <option value="technical">Техник ходим</option>
                  <option value="service">Хизмат кўрсатувчи</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_promoted"
                    checked={formData.is_promoted}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Лавозимда кўтарилган</span>
                </label>
              </div>
            </div>
          </div>

          {/* ЯЗЫКОВЫЕ СЕРТИФИКАТЫ */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌐</span> Тил сертификатлари
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_ielts"
                  checked={formData.has_ielts}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">IELTS сертификати бор</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_cefr"
                  checked={formData.has_cefr}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">CEFR сертификати бор</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_topik"
                  checked={formData.has_topik}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">TOPIK сертификати бор</span>
              </label>
            </div>
          </div>

          {/* НАУЧНЫЕ СТЕПЕНИ */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span> Илмий даража
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Илмий даража
              </label>
              <select
                name="scientific_degree"
                value={formData.scientific_degree}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Йўқ</option>
                <option value="phd">PhD</option>
                <option value="dsc">DSc</option>
                <option value="candidate">Талабгор</option>
              </select>
            </div>
          </div>

          {/* ЛИДЕРСКИЕ ПОЗИЦИИ */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">👑</span> Раҳбар лавозимлар
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Раҳбар лавозим
              </label>
              <select
                name="leadership_position"
                value={formData.leadership_position}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Йўқ</option>
                <option value="director">Директор</option>
                <option value="head">Бошлиқ</option>
                <option value="manager">Менежер</option>
              </select>
            </div>
          </div>

          {/* ГОСУДАРСТВЕННЫЕ НАГРАДЫ */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏅</span> Давлат мукофотлари
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мукофот тури
              </label>
              <select
                name="state_award_type"
                value={formData.state_award_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Йўқ</option>
                <option value="order">Орден</option>
                <option value="medal">Медаль</option>
                <option value="honorary">Фахрий унвон</option>
              </select>
            </div>
          </div>

          {/* Информация о пользователе */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Қўшимча маълумот</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Username:</span>
                <span className="ml-2 font-medium">{user?.username}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 font-medium">{user?.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Ташкилот:</span>
                <span className="ml-2 font-medium">{user?.organization_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Роль:</span>
                <span className="ml-2 font-medium">{user?.role}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ⓘ Логин, email, ташкилот ва рольни ўзгартириб бўлмайди
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Бекор қилиш
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Сақланмоқда...' : 'Сақлаш'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditForm;

