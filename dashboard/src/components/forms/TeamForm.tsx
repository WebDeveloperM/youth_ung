import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { TeamMember, teamAPI } from '../../api';

interface TeamFormProps {
  member?: TeamMember | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TeamForm = ({ member, onClose, onSuccess }: TeamFormProps) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('ru');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    position_uz: '',
    position_ru: '',
    position_en: '',
    bio_uz: '',
    bio_ru: '',
    bio_en: '',
    photo: null as File | null,
    email: '',
    phone: '',
    linkedin: '',
    telegram: '',
    instagram: '',
    github: '',
    order: '1',
    is_active: true,
  });

  useEffect(() => {
    if (member) {
      console.log('📝 ЗАГРУЗКА ЧЛЕНА КОМАНДЫ ДЛЯ РЕДАКТИРОВАНИЯ:', member);
      setFormData({
        name_uz: member.name_uz || '',
        name_ru: member.name_ru || '',
        name_en: member.name_en || '',
        position_uz: member.position_uz || '',
        position_ru: member.position_ru || '',
        position_en: member.position_en || '',
        bio_uz: member.bio_uz || '',
        bio_ru: member.bio_ru || '',
        bio_en: member.bio_en || '',
        photo: null,
        email: member.email || '',
        phone: member.phone || '',
        linkedin: member.linkedin || '',
        telegram: member.telegram || '',
        instagram: member.instagram || '',
        github: member.github || '',
        order: String(member.order || '1'),
        is_active: member.is_active !== undefined ? member.is_active : true,
      });
      if (member.photo) {
        setPhotoPreview(member.photo);
      }
    }
  }, [member]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name_uz || !formData.name_ru || !formData.name_en) {
      toast.error('Илтимос, барча тилларда исм киритинг!');
      return;
    }

    if (!formData.position_uz || !formData.position_ru || !formData.position_en) {
      toast.error('Илтимос, барча тилларда лавозим киритинг!');
      return;
    }

    if (!formData.email) {
      toast.error('Илтимос, email киритинг!');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(member ? 'Сақланмоқда...' : 'Яратилмоқда...');

    try {
      const submitData: any = { ...formData };
      
      console.log('📝 ОТПРАВЛЯЕМ ЧЛЕНА КОМАНДЫ:', submitData);
      
      // Если редактирование и нет нового фото, удаляем поле photo
      if (member && !formData.photo) {
        delete submitData.photo;
      }

      if (member) {
        await teamAPI.update(member.id, submitData);
        toast.success('Жамоа аъзоси муваффақиятли янгиланди! ✅', { id: loadingToast });
      } else {
        const result = await teamAPI.create(submitData);
        console.log('✅ ЧЛЕН КОМАНДЫ СОЗДАН:', result);
        toast.success('Жамоа аъзоси муваффақиятли яратилди! 🎉', { id: loadingToast });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Ошибка при сохранении члена команды:', error);
      
      // Better error messages
      if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          toast.error(`Хатолик:\n${errorMessages}`, { id: loadingToast });
        } else {
          toast.error(`Хатолик: ${errors}`, { id: loadingToast });
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
            {member ? 'Жамоа аъзосини таҳрирлаш' : 'Янги жамоа аъзоси қўшиш'}
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
          {/* Language Tabs */}
          <div className="flex gap-2 border-b-2 border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab('uz')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'uz'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              🇺🇿 O'zbekcha
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ru')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'ru'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              🇷🇺 Русский
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'en'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* Content for active tab */}
          {activeTab === 'uz' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Исм (O'zbekcha) *
                </label>
                <input
                  type="text"
                  value={formData.name_uz}
                  onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Алишер Навоий"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Лавозим (O'zbekcha) *
                </label>
                <input
                  type="text"
                  value={formData.position_uz}
                  onChange={(e) => setFormData({ ...formData, position_uz: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Директор"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Биография
                </label>
                <textarea
                  value={formData.bio_uz}
                  onChange={(e) => setFormData({ ...formData, bio_uz: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Қисқача биография..."
                />
              </div>
            </div>
          )}

          {activeTab === 'ru' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имя (Русский) *
                </label>
                <input
                  type="text"
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Алишер Навои"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Должность (Русский) *
                </label>
                <input
                  type="text"
                  value={formData.position_ru}
                  onChange={(e) => setFormData({ ...formData, position_ru: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Директор"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Биография
                </label>
                <textarea
                  value={formData.bio_ru}
                  onChange={(e) => setFormData({ ...formData, bio_ru: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Краткая биография..."
                />
              </div>
            </div>
          )}

          {activeTab === 'en' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (English) *
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Alisher Navoiy"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position (English) *
                </label>
                <input
                  type="text"
                  value={formData.position_en}
                  onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Director"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biography
                </label>
                <textarea
                  value={formData.bio_en}
                  onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Short biography..."
                />
              </div>
            </div>
          )}

          {/* Photo Upload */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Фотография
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {photoPreview && (
              <img src={photoPreview} alt="Preview" className="mt-4 w-32 h-32 rounded-full object-cover" />
            )}
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Телефон
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="+998901234567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telegram
              </label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub
              </label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тартиб *
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="1"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Фаол
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Бекор қилиш
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Сақланмоқда...
              </>
            ) : (
              <>💾 Saqlash</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamForm;

